// Lab members. Content is edited via the CMS and stored as JSON under
// web/content/{students,alumni,professor.json}; this module loads it at build.
import { readJson, readJsonDir } from "@/lib/content";

export type Link = { label: string; url: string };
export type Milestone = { start: string; end?: string; title: string; note?: string };

export type Role =
  | "Combined M.S.–Ph.D."
  | "Ph.D. Student"
  | "M.S. Student"
  | "Intern";

export type Student = {
  slug: string;
  name: string;
  role: Role;
  period: string;
  photo: string;
  email?: string;
  tags: string[];
  links: Link[];
  about?: string;
  interests?: string[];
  milestones?: Milestone[];
  current?: string[];
};

export type Alumnus = {
  name: string;
  role: string;
  gradYear: number;
  position: string;
  photo: string;
  link?: string;
};

export type Professor = {
  name: string;
  nameKo: string;
  photo: string;
  title: string;
  affiliations: Link[];
  role: string;
  office: string;
  tel: string;
  email: string;
  links: Link[];
  bio: string;
  researchFields: string[];
  researchTopics: string[];
  employment: { time: string; title: string; sub: string }[];
  education: { time: string; title: string; sub: string }[];
  awards: string[];
};

// Display order of degree groups on the Students page.
export const ROLE_ORDER: Role[] = [
  "Combined M.S.–Ph.D.",
  "Ph.D. Student",
  "M.S. Student",
  "Intern",
];

// A student gets a detail page only if there's real content to show.
export const hasDetail = (s: Student) => Boolean(s.about);

type StudentFile = Omit<Student, "slug"> & { order?: number };

export const students: Student[] = readJsonDir<StudentFile>("students")
  .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  .map(({ slug, data }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { order: _order, ...rest } = data; // drop `order` (sort key) from output
    return { slug, ...rest };
  });

export const alumni: Alumnus[] = readJsonDir<Alumnus>("alumni").map((e) => e.data);

export const professor = readJson<Professor>("professor.json");
