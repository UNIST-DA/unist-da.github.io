// Sync seminars from a Notion database into web/content/seminars/*.md.
//
// Lab members edit the Notion DB (title / date / presenter / category /
// keywords, and the write-up in the page body). A GitHub Action runs this on a
// schedule and on demand; it regenerates the seminars folder and commits, which
// auto-deploys. The Notion DB is the single source of truth — do NOT hand-edit
// files in content/seminars/.
//
// Notion DB property names (reuse the lab's existing seminar DB):
//   Title (title) · Date (date) · Presenter (people|rich_text) ·
//   Category (select|multi_select) · Keywords (multi_select|rich_text) ·
//   Published (checkbox)
//
// Env: NOTION_TOKEN, NOTION_SEMINAR_DB_ID
// Usage: node scripts/sync-seminars.mjs            # sync
//        node scripts/sync-seminars.mjs --selftest # offline logic check

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "content", "seminars");
const IMG_DIR = path.join(ROOT, "public", "assets", "seminars");
const IMG_URL_BASE = "/assets/seminars";

// Notion property names — change here if the DB uses different column names.
const F = {
  title: "Title",
  date: "Date",
  presenter: "Presenter",
  category: "Category",
  keywords: "Keywords",
  published: "Published",
};

// ---------- pure helpers (covered by --selftest) ----------

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/['".,()]/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";

const oneLine = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

const readProp = (prop) => {
  if (!prop) return "";
  const t = prop.type;
  if (t === "title" || t === "rich_text")
    return (prop[t] || []).map((x) => x.plain_text).join("").trim();
  if (t === "select") return prop.select?.name || "";
  if (t === "multi_select") return (prop.multi_select || []).map((x) => x.name).join(", ");
  if (t === "people") return (prop.people || []).map((p) => p.name || p.person?.email || "").join(", ");
  if (t === "date") {
    const s = prop.date?.start || "";
    return s.includes("T") ? s.slice(0, 10) : s;
  }
  if (t === "checkbox") return prop.checkbox;
  return "";
};

const keywordsFrom = (prop) => {
  if (!prop) return [];
  if (prop.type === "multi_select") return (prop.multi_select || []).map((x) => x.name);
  if (prop.type === "rich_text") return readProp(prop).split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  return [];
};

const notionUrl = (pageId) => `https://www.notion.so/${String(pageId).replace(/-/g, "")}`;

// Build a seminar .md file (frontmatter matches web/src/lib/content.ts parser:
// `key: value` lines, keywords comma-separated, body after the second `---`).
function buildMarkdown({ date, title, category, presenter, url, keywords, body }) {
  const fm = [
    "---",
    `date: ${oneLine(date)}`,
    `title: ${oneLine(title)}`,
    `category: ${oneLine(category) || "Lab Seminar"}`,
    `presenter: ${oneLine(presenter)}`,
    `url: ${oneLine(url)}`,
    `keywords: ${keywords.map(oneLine).filter(Boolean).join(", ")}`,
    "---",
    "",
  ].join("\n");
  return fm + (body?.trim() ? body.trimEnd() + "\n" : "");
}

// Parse frontmatter the same way the site does — used to validate our output.
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim();
    data[key] = key === "keywords" ? val.split(",").map((s) => s.trim()).filter(Boolean) : val;
  }
  return { data, body: m[2] };
}

// Notion nests display equations inside list items (indented). Markdown then
// mis-parses the indented `$$` block and swallows everything after it as raw
// text (LaTeX, headings, images all leak). Pull every multi-line `$$ … $$`
// block out to column 0 with a blank line on each side so remark-math renders
// it reliably.
function normalizeDisplayMath(md) {
  const lines = md.split("\n");
  const out = [];
  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "$$") {
      if (!inBlock) {
        if (out.length && out[out.length - 1].trim() !== "") out.push("");
        out.push("$$");
        inBlock = true;
      } else {
        out.push("$$");
        inBlock = false;
        if (i + 1 < lines.length && lines[i + 1].trim() !== "") out.push("");
      }
    } else if (inBlock) {
      out.push(line.replace(/^[ \t]+/, "")); // dedent the math content
    } else {
      out.push(line);
    }
  }
  return out.join("\n");
}

// Notion inline equations sometimes serialize with display delimiters ($$…$$)
// inline, which remark-math then mis-parses mid-sentence (stray `$` leaks as
// text). On any line that isn't a standalone display equation, collapse inline
// `$$…$$` to inline `$…$`.
function fixMath(md) {
  return md
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (t === "$$" || /^\$\$[^$]+\$\$$/.test(t)) return line; // keep standalone display math
      return line.replace(/\${2,}/g, "$"); // collapse stray inline double-dollars to inline `$`
    })
    .join("\n");
}

// ---------- selftest ----------

function selftest() {
  const assert = (cond, msg) => {
    if (!cond) throw new Error("selftest failed: " + msg);
  };
  assert(slugify("NEURAL DELAY DIFFERENTIAL EQUATIONS") === "neural-delay-differential-equations", "slug basic");
  assert(slugify("A/B: Test (v2)") === "a-b-test-v2", "slug punctuation");
  assert(slugify("불규칙 시계열") === "불규칙-시계열", "slug korean");

  // field parsers over mock Notion props
  assert(readProp({ type: "select", select: { name: "Paper Review" } }) === "Paper Review", "select");
  assert(readProp({ type: "people", people: [{ name: "Kim" }, { name: "Lee" }] }) === "Kim, Lee", "people");
  assert(readProp({ type: "date", date: { start: "2026-06-19T00:00:00" } }) === "2026-06-19", "date iso");
  assert(JSON.stringify(keywordsFrom({ type: "multi_select", multi_select: [{ name: "ODE" }, { name: "GRU" }] })) === '["ODE","GRU"]', "keywords");

  // round-trip: build → parse yields the same controlled fields
  const md = buildMarkdown({
    date: "2026-06-19",
    title: "Neural Delay: Differential Equations",
    category: "Lab Seminar",
    presenter: "SeungSu Kam",
    url: "https://www.notion.so/abc",
    keywords: ["Neural Differential Equation", "ODE"],
    body: "line one\n\n---\n\nline two",
  });
  const parsed = parseFrontmatter(md);
  assert(parsed, "parses");
  assert(parsed.data.title === "Neural Delay: Differential Equations", "title round-trip (keeps colon)");
  assert(parsed.data.category === "Lab Seminar", "category round-trip");
  assert(parsed.data.keywords.length === 2 && parsed.data.keywords[0] === "Neural Differential Equation", "keywords round-trip");
  assert(parsed.body.includes("line two"), "body preserved incl. --- rule");

  // math normalization
  assert(fixMath("- $z(t_1)$$ , $$z(t_0)$$: x").includes("$z(t_1)$ , $z(t_0)$: x"), "inline $$ collapse (malformed)");
  assert(fixMath("$$\nE=mc^2\n$$") === "$$\nE=mc^2\n$$", "display block preserved");
  assert(fixMath("$$a=b$$").trim() === "$$a=b$$", "one-line display preserved");
  assert(fixMath("plain $x$ text").includes("plain $x$ text"), "single inline math untouched");

  // display-math dedent (Notion nests it in lists)
  const nm = normalizeDisplayMath("- item\n    $$\n    a=b\n    $$\n- next");
  assert(nm.includes("\n$$\na=b\n$$\n"), "indented display math dedented to col 0");
  assert(!/ {2,}\$\$/.test(nm), "no indented $$ left");

  console.log("✓ selftest passed");
}

// ---------- asset download (Notion image/file URLs expire → localize) ----------

function pickExt(url, ct, def) {
  let u = "";
  try {
    u = (new URL(url).pathname.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  } catch {
    /* ignore */
  }
  if (u && u.length >= 2 && u.length <= 4) return u;
  const c = (ct.split("/")[1] || "").split(";")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  if (c && c.length >= 2 && c.length <= 5) return c;
  return def;
}

// Download a Notion-hosted image or attachment into public/assets/seminars/<slug>/
// so it stays viewable after the (expiring) Notion URL dies. Returns a site path.
async function downloadAsset(url, slug, name, defaultExt = "bin") {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${res.status} for ${url}`);
  const ext = pickExt(url, res.headers.get("content-type") || "", defaultExt);
  const dir = path.join(IMG_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });
  const file = `${name}.${ext}`;
  fs.writeFileSync(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
  return `${IMG_URL_BASE}/${slug}/${file}`;
}

// ---------- GitHub Release asset hosting (keeps large PDFs out of the site) ----------
// Notion-uploaded slides/PDFs are mirrored to a single "seminar-assets" release
// so they stay viewable (Notion URLs expire) WITHOUT bloating the Pages site or
// the repo tree. Needs GITHUB_TOKEN (contents:write) + GITHUB_REPOSITORY (both
// provided automatically in Actions). Falls back to a plain note when absent.

const GH = {
  repo: process.env.GITHUB_REPOSITORY || "",
  token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "",
  tag: "seminar-assets",
  _release: null,
  _seq: 0,
};
const ghEnabled = () => Boolean(GH.repo && GH.token);

async function ghApi(url, opts = {}) {
  return fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${GH.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers || {}),
    },
  });
}

async function ensureRelease() {
  if (GH._release) return GH._release;
  let res = await ghApi(`https://api.github.com/repos/${GH.repo}/releases/tags/${GH.tag}`);
  if (res.status === 404) {
    res = await ghApi(`https://api.github.com/repos/${GH.repo}/releases`, {
      method: "POST",
      body: JSON.stringify({
        tag_name: GH.tag,
        name: "Seminar assets",
        body: "Auto-uploaded seminar attachments (slides / PDFs). Managed by scripts/sync-seminars.mjs.",
        prerelease: true,
      }),
    });
  }
  if (!res.ok) throw new Error(`release ${res.status}: ${await res.text()}`);
  GH._release = await res.json();
  GH._release.assets = GH._release.assets || [];
  return GH._release;
}

// Upload a buffer as a release asset (replacing any same-named one). Returns its
// public download URL.
async function uploadReleaseAsset(name, buffer, contentType) {
  const rel = await ensureRelease();
  const existing = rel.assets.find((a) => a.name === name);
  if (existing) {
    await ghApi(`https://api.github.com/repos/${GH.repo}/releases/assets/${existing.id}`, { method: "DELETE" });
    rel.assets = rel.assets.filter((a) => a.name !== name);
  }
  const up = await ghApi(
    `https://uploads.github.com/repos/${GH.repo}/releases/${rel.id}/assets?name=${encodeURIComponent(name)}`,
    { method: "POST", headers: { "Content-Type": contentType || "application/octet-stream" }, body: buffer },
  );
  if (!up.ok) throw new Error(`asset upload ${up.status}: ${await up.text()}`);
  const asset = await up.json();
  rel.assets.push(asset);
  return asset.browser_download_url;
}

// ---------- sync ----------

async function sync() {
  const { Client } = await import("@notionhq/client");
  const { NotionToMarkdown } = await import("notion-to-md");

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_SEMINAR_DB_ID;
  if (!token || !dbId) {
    console.error("Missing NOTION_TOKEN or NOTION_SEMINAR_DB_ID env.");
    process.exit(1);
  }

  const notion = new Client({ auth: token });
  const n2m = new NotionToMarkdown({ notionClient: notion, config: { parseChildPages: false } });

  // External link blocks (bookmark/embed/link_preview) → a clean "📄 …" link.
  // These carry stable external URLs (arxiv, etc.). pdf/file blocks are handled
  // per-page below because Notion-hosted files expire and must be downloaded.
  const isEphemeral = (u) => /amazonaws\.com|notion-static|secure\.notion|X-Amz-/i.test(u);
  const linkBlock = (label) => (block) => {
    const b = block[block.type] || {};
    const url = b.url || b.external?.url || b.file?.url || "";
    const cap = (b.caption || []).map((c) => c.plain_text).join("").trim();
    if (!url) return "";
    return `\n[📄 ${cap || label} ↗](${url})\n`;
  };
  n2m.setCustomTransformer("bookmark", linkBlock("자료 링크"));
  n2m.setCustomTransformer("embed", linkBlock("자료"));
  n2m.setCustomTransformer("link_preview", linkBlock("링크"));
  // Display equation blocks → clean, well-formed `$$ … $$` on their own lines.
  n2m.setCustomTransformer("equation", (block) => {
    const expr = (block.equation?.expression || "").trim();
    return expr ? `\n$$\n${expr}\n$$\n` : "";
  });

  // fetch all published rows
  const pages = [];
  let cursor;
  do {
    const resp = await notion.databases.query({
      database_id: dbId,
      filter: { property: F.published, checkbox: { equals: true } },
      start_cursor: cursor,
    });
    pages.push(...resp.results);
    cursor = resp.has_more ? resp.next_cursor : undefined;
  } while (cursor);

  if (pages.length === 0) {
    console.error("Notion returned 0 published seminars — aborting without touching files (check token / DB / Published checkbox).");
    process.exit(1);
  }

  // clean the local image dir so removed seminars don't leave orphan files
  fs.rmSync(IMG_DIR, { recursive: true, force: true });

  // build files in memory first
  const files = new Map(); // filename -> content
  const usedSlugs = new Set();

  for (const page of pages) {
    const p = page.properties;
    const title = oneLine(readProp(p[F.title])) || "Untitled";
    const date = readProp(p[F.date]) || "";
    const category = oneLine(readProp(p[F.category])) || "Lab Seminar";
    const presenter = oneLine(readProp(p[F.presenter]));
    const keywords = keywordsFrom(p[F.keywords]);

    let slug = slugify(title);
    while (usedSlugs.has(slug)) slug = slug + "-2";
    usedSlugs.add(slug);
    const filename = `${date || "0000-00-00"}-${slug}.md`;

    // Images → downloaded into /public/assets/seminars/<slug>/ (small; render inline).
    let imgIdx = 0;
    n2m.setCustomTransformer("image", async (block) => {
      const img = block.image;
      const src = img?.type === "external" ? img.external?.url : img?.file?.url;
      if (!src) return false;
      const alt = (img.caption || []).map((c) => c.plain_text).join("").trim();
      try {
        const local = await downloadAsset(src, slug, String(imgIdx++), "png");
        return `![${alt}](${local})`;
      } catch (e) {
        console.warn(`  ! image skipped (${e.message})`);
        return `![${alt}]()`;
      }
    });

    // PDF / file attachments → external URLs link directly; Notion-uploaded files
    // (expiring) are mirrored to the GitHub Release so they stay viewable without
    // bloating the site. Falls back to a plain note if the upload can't happen.
    const fileBlock = (label) => async (block) => {
      const b = block[block.type] || {};
      const url = b.url || b.external?.url || b.file?.url || "";
      const cap = (b.caption || []).map((c) => c.plain_text).join("").trim();
      if (!url) return "";
      if (!isEphemeral(url)) return `\n[📄 ${cap || label} ↗](${url})\n`;
      if (!ghEnabled()) return `\n📄 ${cap || label} (노션 원문 참고)\n`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const ct = res.headers.get("content-type") || "application/pdf";
        const ext = pickExt(url, ct, "pdf");
        const asciiSlug = slug.replace(/[^a-z0-9-]/g, "").slice(0, 40) || "file";
        const name = `${date || "0000-00-00"}-${asciiSlug}-a${GH._seq++}.${ext}`;
        const link = await uploadReleaseAsset(name, buf, ct);
        return `\n[📄 ${cap || label} ↗](${link})\n`;
      } catch (e) {
        console.warn(`  ! attachment upload failed (${e.message})`);
        return `\n📄 ${cap || label} (노션 원문 참고)\n`;
      }
    };
    n2m.setCustomTransformer("pdf", fileBlock("PDF 자료"));
    n2m.setCustomTransformer("file", fileBlock("첨부파일"));

    let body = "";
    try {
      const blocks = await n2m.pageToMarkdown(page.id);
      body = fixMath(normalizeDisplayMath(n2m.toMarkdownString(blocks).parent || ""));
    } catch (e) {
      console.warn(`  ! body conversion failed for "${title}" (${e.message})`);
    }

    files.set(
      filename,
      buildMarkdown({ date, title, category, presenter, url: notionUrl(page.id), keywords, body }),
    );
  }

  // regenerate the directory (Notion is the source of truth)
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.endsWith(".md")) fs.rmSync(path.join(OUT_DIR, f));
  }
  for (const [name, content] of files) {
    fs.writeFileSync(path.join(OUT_DIR, name), content, "utf8");
  }

  // validate every written file parses back cleanly
  let bad = 0;
  for (const [name, content] of files) {
    const parsed = parseFrontmatter(content);
    if (!parsed || !parsed.data.title || !parsed.data.date) {
      console.error(`  ✗ invalid frontmatter: ${name}`);
      bad++;
    }
  }
  if (bad) process.exit(1);

  console.log(`✓ synced ${files.size} seminars → content/seminars/`);
}

// ---------- entry ----------

if (process.argv.includes("--selftest")) {
  selftest();
} else {
  sync().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
