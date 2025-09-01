// sync-seminar.js
import { Client } from "@notionhq/client";
import fs from "fs-extra";
import slugify from "slugify";

// === 환경변수 ===
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_SEMINAR_DB_ID;

// === 출력 경로 (페이지가 site.data.activity.seminar를 읽으므로 이 경로로 작성) ===
const OUT_PATH = "_data/activity/seminar.json";

// === 너희 Notion 속성명에 맞춰 필요시만 바꿔줘 ===
const F = {
  title: "Title",
  date: "Date",
  presenter: "Presenter",   // 선택
  published: "Published",
};

const text = (prop) => {
  if (!prop) return "";
  const t = prop[prop.type] || [];
  if (prop.type === "title" || prop.type === "rich_text") {
    return t.map(x => x.plain_text).join("").trim();
  }
  if (prop.type === "select") return t?.name || "";
  if (prop.type === "multi_select") return t.map(x => x.name).join(", ");
  return "";
};
const dateISO = (prop) => {
  const s = prop?.date?.start || "";
  return s.includes("T") ? s.slice(0, 10) : s; // YYYY-MM-DD
};
const notionUrl = (pageId) => `https://www.notion.so/${pageId.replace(/-/g, "")}`;

async function fetchAll() {
  const rows = [];
  let cursor;
  while (true) {
    const resp = await notion.databases.query({
      database_id: DB_ID,
      filter: { property: F.published, checkbox: { equals: true } },
      start_cursor: cursor
    });
    rows.push(...resp.results);
    if (!resp.has_more) break;
    cursor = resp.next_cursor;
  }
  return rows;
}

(async () => {
  try {
    const pages = await fetchAll();
    const items = pages.map(p => {
      const props = p.properties;
      const title = text(props[F.title]) || "Untitled";
      const date = dateISO(props[F.date]);
      const slug =
        (date ? date + "-" : "") +
        slugify(title, { lower: true, strict: true, trim: true });

      return {
        date,                           // "YYYY-MM-DD"
        title,                          // 제목
        slug,                           // 페이지 id로 쓰임(선택)
        detail: text(props[F.presenter]) || "", // 네 템플릿의 it.detail
        url: notionUrl(p.id)            // Notion 하이퍼링크
      };
    })
    .filter(x => x.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // 최신순

    await fs.ensureDir("_data/activity");
    await fs.writeJson(OUT_PATH, items, { spaces: 2 });
    console.log(`Wrote ${items.length} items → ${OUT_PATH}`);
  } catch (e) {
    console.error("Sync error:", e?.body || e?.message || e);
    process.exit(1);
  }
})();
