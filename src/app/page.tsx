import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { HomeMorph } from "@/components/home-morph";
import { ScrollDeck } from "@/components/scroll-deck";
import { ScrollCue } from "@/components/scroll-cue";
import { Gallery } from "@/components/gallery";
import { SiteFooter } from "@/components/site-footer";
import { RotatingWord } from "@/components/rotating-word";
import { WorkPanels } from "@/components/work-panels";
import { asset } from "@/lib/asset";
import { events } from "@/data/activity";
import { seminars } from "@/data/seminars";
import { news } from "@/data/news";

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export default function Home() {
  // Activity screen — the lab's current pulse (message "C"): the weekly seminar
  // as the research rhythm, plus a recent stream of news/events for momentum.
  const latest = <T extends { date: string }>(arr: T[], n: number) =>
    [...arr].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
  const featuredSeminar = latest(seminars, 1)[0];
  const recent = [
    ...latest(news, 4).map((n) => ({ kind: "News", date: n.date, title: n.title, href: "/activity/#news" })),
    ...latest(events, 3).map((e) => ({ kind: "Event", date: e.date, title: e.title, href: "/activity/#events" })),
    ...latest(seminars, 4)
      .filter((s) => s.slug !== featuredSeminar?.slug)
      .map((s) => ({ kind: "Seminar", date: s.date, title: s.title, href: "/activity/#seminar" })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  // Research map — Industrial AI branches into three domain pillars, each with
  // a representative image and two keyword areas.
  const focusAreas = [
    {
      title: "Manufacturing AI",
      keywords: ["Quality Engineering", "Time Series Analysis"],
      image: "/assets/about/ManufacturingAI.webp",
    },
    {
      title: "Healthcare AI",
      keywords: ["Survival Analysis", "Multimodal AI"],
      image: "/assets/about/healthcareAI.webp",
    },
    {
      title: "Service AI",
      keywords: ["Agentic AI", "Recommendation System"],
      image: "/assets/about/serviceAI.webp",
    },
  ];

  return (
    <>
      <ScrollDeck />
      {/* ===== Morph intro (first screen) ===== */}
      <HomeMorph />

      {/* ===== Hero (second screen) ===== */}
      <section className="hero">
        <div className="container hero__center">
          <span className="kicker">Data Analytics Lab · UNIST IE</span>
          <h1 className="stmt">
            <span className="stmt__line">
              <span className="stmt__in" style={{ animationDelay: "0.08s" }}>We find the</span>
            </span>
            <span className="stmt__line">
              <span className="stmt__in" style={{ animationDelay: "0.2s" }}>
                <RotatingWord />
              </span>
            </span>
            <span className="stmt__line">
              <span className="stmt__in" style={{ animationDelay: "0.32s" }}>in industrial data.</span>
            </span>
          </h1>
          <Reveal as="p" className="hero__lead" delay={0.5}>
            머신러닝과 딥러닝으로, 복잡한 <strong>산업 데이터</strong> 속에서
            신호·이상·구조를 찾아 신뢰할 수 있는 결정으로 만듭니다.
          </Reveal>
          <Reveal className="hero__cta" delay={0.58}>
            <Link href="/research/" className="btn btn-primary">
              연구 살펴보기 <span aria-hidden>→</span>
            </Link>
            <Link href="/about/" className="btn btn-ghost">
              연구실 소개 <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
        <div className="scrollcue" aria-hidden>
          SCROLL
          <span className="scrollcue__line" />
        </div>
      </section>

      {/* ===== Research map (Industrial AI → domain pillars) ===== */}
      <section id="focus" className="section section--full">
        <div className="container focus">
          <Reveal className="focus__root">
            <span className="kicker">Research Focus</span>
            <h2 className="focus__title">Industrial AI</h2>
            <p className="focus__sub">제조·의료·서비스로 뻗어가는 산업 AI 연구</p>
          </Reveal>

          <div className="focus__trunk" aria-hidden />

          <Reveal className="focus__branches">
            {focusAreas.map((a) => (
              <div key={a.title} className="focus-node">
                <h3 className="focus-node__title">{a.title}</h3>
                <div className="focus-node__media" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(a.image)} alt="" loading="lazy" />
                </div>
                <div className="focus-node__kw">
                  {a.keywords.map((k) => (
                    <span key={k} className="focus-kw">{k}</span>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
        <ScrollCue />
      </section>

      {/* ===== Projects & Papers (two rotating panels) ===== */}
      <section id="work" className="section section--full">
        <div className="container work">
          <Reveal className="work__head">
            <span className="kicker">Research Output</span>
            <h2 className="work__title">Projects &amp; Papers</h2>
            <p className="work__sub">실제 산업 현장의 문제를 해결합니다.</p>
          </Reveal>

          <Reveal>
            <WorkPanels />
          </Reveal>
        </div>
        <ScrollCue />
      </section>

      {/* ===== Activity — the lab's current pulse ===== */}
      <section id="activity" className="section section--full">
        <div className="container work">
          <Reveal className="work__head">
            <span className="kicker">Lab Pulse</span>
            <h2 className="work__title">Activity</h2>
            <p className="work__sub">매주 세미나로 연구를 다지고, 학회·수상 소식으로 채워갑니다.</p>
          </Reveal>

          <Reveal className="feed">
            <Link href="/activity/#seminar" className="glow feed__lead">
              <div className="feed__meta">
                <span className="feed__kind feed__kind--seminar">Seminar</span>
                {featuredSeminar && <span className="feed__date">{fmtDate(featuredSeminar.date)}</span>}
              </div>
              <div className="feed__lead-title">{featuredSeminar?.title}</div>
              {featuredSeminar?.presenter && (
                <p className="feed__lead-sub">발표 · {featuredSeminar.presenter}</p>
              )}
              {featuredSeminar?.keywords && featuredSeminar.keywords.length > 0 && (
                <div className="feed__lead-kw">
                  {featuredSeminar.keywords.slice(0, 3).map((k) => (
                    <span key={k}>{k}</span>
                  ))}
                </div>
              )}
              <span className="feed__lead-cue" aria-hidden>
                이번 주 세미나 →
              </span>
            </Link>

            <ul className="feed__list">
              {recent.map((it) => (
                <li key={it.kind + it.date + it.title}>
                  <Link href={it.href} className="feed__row">
                    <span className={`feed__kind feed__kind--${it.kind.toLowerCase()}`}>{it.kind}</span>
                    <span className="feed__date">{fmtDate(it.date)}</span>
                    <span className="feed__title">{it.title}</span>
                    <span className="feed__arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <ScrollCue />
      </section>

      {/* ===== Lab Life + footer (one final screen) ===== */}
      <section id="life" className="section section--full section--life">
        <div className="life__main">
          <div className="container">
            <Reveal className="work__head">
              <span className="kicker">Together</span>
              <h2 className="work__title">Lab Life</h2>
              <p className="work__sub">같이 연구하고, 같이 웃습니다</p>
            </Reveal>
          </div>
          <Reveal>
            <Gallery />
          </Reveal>
        </div>
        <SiteFooter />
      </section>
    </>
  );
}
