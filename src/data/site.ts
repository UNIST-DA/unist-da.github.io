// Lab-wide metadata, navigation, and identity (Korean-first).
// Single source of truth for strings shared across pages.

export const site = {
  name: "Data Analytics Lab",
  nameKo: "데이터 애널리틱스 연구실",
  shortName: "DA Lab",
  org: "UNIST 산업공학과",
  orgEn: "UNIST · Industrial Engineering",
  url: "https://unist-da.github.io",
  title: "Data Analytics Lab | UNIST 산업공학과",
  description:
    "UNIST 산업공학과 데이터 애널리틱스 연구실. 산업통계와 머신러닝으로 품질공학, 시스템 모니터링·이상탐지, 시계열 표현학습을 연구합니다.",
  email: "sungil.kim@unist.ac.kr",
  address: "유니스트길 50, 112동 302-4",
  logo: "/assets/hero/LabSign_DA_only.png",
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: "About", href: "/about/" },
  {
    label: "Members",
    href: "/members/professor/",
    children: [
      { label: "Professor", href: "/members/professor/" },
      { label: "Students", href: "/members/students/" },
      { label: "Alumni", href: "/members/alumni/" },
    ],
  },
  {
    label: "Research",
    href: "/research/",
    children: [
      { label: "Projects", href: "/research/" },
      { label: "Publications", href: "/research/publications/" },
    ],
  },
  {
    label: "Activity",
    href: "/activity/",
    children: [
      { label: "News", href: "/activity/#news" },
      { label: "Events", href: "/activity/#events" },
      { label: "Seminar", href: "/activity/#seminar" },
    ],
  },
  {
    label: "Contact",
    href: "/contact/",
    children: [
      { label: "Contact", href: "/contact/" },
      { label: "Apply", href: "/contact/apply/" },
    ],
  },
];

export const interests = [
  "Industrial Statistics",
  "Quality Engineering & Management",
  "Machine Learning & Data Mining",
  "Time-Series Analytics",
];

export const researchAreas = [
  {
    code: "01",
    title: "품질공학을 위한 AI",
    titleEn: "AI in Quality Engineering",
    desc: "통계 및 딥러닝 모델로 제조 품질을 개선하고 공정을 제어합니다.",
  },
  {
    code: "02",
    title: "시스템 모니터링 · 이상탐지",
    titleEn: "System Monitoring & Anomaly Detection",
    desc: "고차원 산업 신호에서 결함과 희귀 이벤트를 탐지합니다.",
  },
  {
    code: "03",
    title: "시계열 표현학습",
    titleEn: "Time-Series Representation Learning",
    desc: "불규칙·다변량 시계열의 강건한 표현을 학습합니다.",
  },
];

export const externalLinks = [
  { label: "GitHub Organization", href: "https://github.com/UNIST-DA" },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=BISaBGoAAAAJ&hl=ko",
  },
  { label: "UNIST 산업공학과", href: "https://ie.unist.ac.kr/" },
];

// Lab Life — photos for the full-bleed gallery band.
export const galleryPhotos = [
  { src: "/assets/activity/Lab_Events/QCRE_awards_2026.jpg", caption: "QCRE Awards" },
  { src: "/assets/activity/Lab_Events/prof_birthday_2026_1.jpg", caption: "Professor's Birthday" },
  { src: "/assets/activity/Lab_Events/cherry_1.jpg", caption: "Cherry Blossom" },
  { src: "/assets/activity/Lab_Events/Picnic.jpg", caption: "Pizza Picnic" },
  { src: "/assets/activity/Lab_Events/spring_unity_2026.jpg", caption: "Spring Unity" },
  { src: "/assets/activity/Lab_Events/CIKM_group_11_14.jpg", caption: "CIKM · Seoul" },
  { src: "/assets/activity/Lab_Events/Homecoming_11_14.jpg", caption: "DA Lab Homecoming" },
  { src: "/assets/activity/Lab_Events/KIIE_11_8.jpg", caption: "KIIE Fall" },
  { src: "/assets/activity/Lab_Events/Prof_birth.webp", caption: "Professor's Birthday" },
  { src: "/assets/activity/Lab_Events/spring_2025.webp", caption: "Cherry Blossom Picnic" },
];
