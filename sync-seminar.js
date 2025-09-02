// sync-seminar.js
import { Client } from "@notionhq/client";
import fs from "fs-extra";
import slugify from "slugify";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_SEMINAR_DB_ID;

// ✅ 최종 출력 경로 (_data/seminar.json)
const OUT_PATH = "_data/seminar.json";

// ▶ Notion 속성명: 다르면 여기만 바꿔주세요
const F = {
  title: "Title",
  date: "Date",
  presenter: "Presenter",   // people 또는 rich_text 아무거나 OK
  category: "Category",     // select 또는 multi_select 둘 다 지원
  keywords: "Keywords",     // multi_select 권장
  published: "Published",
};

// ---------- helpers ----------
const text = (prop) => {
  if (!prop) return "";
  const t = prop[prop.type] || [];
  if (prop.type === "title" || prop.type === "rich_text")
    return t.map(x => x.plain_text).join("").trim();
  if (prop.type === "select") return prop.select?.name || "";
  if (prop.type === "multi_select") return (prop.multi_select || []).map(x => x.name).join(", ");
  if (prop.type === "people") return (prop.people || []).map(p => p.name || p.person?.email).join(", ");
  return "";
};
const dateISO = (prop) => {
  const s = prop?.date?.start || "";
  return s ? (s.includes("T") ? s.slice(0,10) : s) : "";
};
const notionUrl = (pageId) => `https://www.notion.so/${pageId.replace(/-/g, "")}`;

// 타입별 전용 파서
const getPresenter = (prop) => {
  if (!prop) return "";
  if (prop.type === "people") return (prop.people || []).map(p => p.name || p.person?.email).join(", ");
  return text(prop); // rich_text 등
};
const getCategory = (prop) => {
  if (!prop) return "";
  if (prop.type === "select") return prop.select?.name || "";
  if (prop.type === "multi_select") return (prop.multi_select?.[0]?.name) || ""; // 여러 개면 첫 번째만
  return text(prop);
};
const getKeywords = (prop) => {
  if (!prop) return [];
  if (prop.type === "multi_select") return (prop.multi_select || []).map(x => x.name);
  // rich_text로 쓴 경우 쉼표/공백 분리
  if (prop.type === "rich_text") return text(prop).split(/[,\s]+/).filter(Boolean);
  return [];
};

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

      const category = getCategory(props[F.category]);
      const presenter = getPresenter(props[F.presenter]);
      const keywords = getKeywords(props[F.keywords]);

      return {
        date,                     // "YYYY-MM-DD"
        title,                    // 원제목
        slug,                     // 앵커 id 용
        url: notionUrl(p.id),     // Notion 링크
        category,                 // "Review" 같은 단일 문자열(멀티는 첫 값)
        presenter,                // "홍길동, 김철수"
        keywords                  // ["RL","Bayes", ...]
        // 필요 시 하위호환: detail: presenter
      };
    })
    .filter(x => x.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // 최신순

    await fs.ensureDir("_data");
    await fs.writeJson(OUT_PATH, items, { spaces: 2 });
    console.log(`Wrote ${items.length} items → ${OUT_PATH}`);
  } catch (e) {
    console.error("Sync error:", e?.body || e?.message || e);
    process.exit(1);
  }
})();
