// Weekly seminars & paper reviews — one Markdown file each under
// web/content/seminars/. Researchers just type the write-up below the `---`
// frontmatter; it shows in the in-page modal (no internal Notion account needed).
import { readMarkdownDir } from "@/lib/content";

export type SeminarItem = {
  slug: string;
  date: string;
  title: string;
  category: "Lab Seminar" | "Paper Review";
  presenter: string;
  url: string;
  keywords: string[];
  notes?: string;
};

type SeminarMeta = Omit<SeminarItem, "slug" | "notes">;

// Normalize every field with a default — a seminar file (edited by non-devs via
// Notion) that omits `keywords:`/`date:` etc. must never crash the Activity/Home
// pages. Skip entries with no date or title.
export const seminars: SeminarItem[] = readMarkdownDir<Partial<SeminarMeta>>("seminars")
  .map(({ slug, data, body }): SeminarItem => ({
    slug,
    date: data.date ?? "",
    title: data.title ?? "(제목 없음)",
    category: data.category === "Paper Review" ? "Paper Review" : "Lab Seminar",
    presenter: data.presenter ?? "",
    url: data.url ?? "",
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    notes: body,
  }))
  .filter((s) => s.date && s.title)
  .sort((a, b) => b.date.localeCompare(a.date));
