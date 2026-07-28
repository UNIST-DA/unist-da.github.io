import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "소개",
  description:
    "UNIST 산업공학과 데이터 애널리틱스 연구실 소개 — 통계와 머신러닝을 방법론으로, 산업 현장의 문제를 푸는 연구.",
};

const principles = [
  {
    n: "01",
    t: "방법론으로서의 산업 AI 및 데이터사이언스",
    en: "Industrial AI & data science as methodology",
    d: "문제의 구조를 분석하고, 이에 적합한 산업 AI 및 데이터사이언스 모델을 설계합니다.",
  },
  {
    n: "02",
    t: "실제 데이터에서 출발",
    en: "From real data",
    d: "산업 현장의 실제 데이터를 바탕으로 문제를 정의하고 방법론을 검증합니다.",
  },
  {
    n: "03",
    t: "산업 현장으로의 적용",
    en: "To the field",
    d: "연구 결과를 현장의 의사결정 문제에 적용합니다.",
  },
];

const domains = [
  {
    title: "Manufacturing AI",
    image: "/assets/about/ManufacturingAI.webp",
    desc: "제조 공정의 품질 관리와 고차원 시계열 신호의 이상 탐지를 연구합니다.",
    keywords: ["Quality Engineering", "Statistical Process Control", "Time Series Analysis", "Anomaly Detection"],
  },
  {
    title: "Healthcare AI",
    image: "/assets/about/healthcareAI.webp",
    desc: "생존 분석과 시계열·불확실성 모델링으로 의료 데이터를 분석합니다.",
    keywords: ["Survival Analysis", "Irregular Time Series", "Uncertainty Quantification", "Domain Adaptation"],
  },
  {
    title: "Service AI",
    image: "/assets/about/serviceAI.webp",
    desc: "LLM 기반 에이전트와 추천 시스템, 서비스 품질 지표 개발로 의사결정을 지원합니다.",
    keywords: ["Agentic AI", "Large Language Models", "Recommendation System", "Quality Metrics"],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        title="About"
        lead="산업 AI 및 데이터사이언스 핵심 기술을 연구·개발하여 산업 현장의 실제 문제를 해결하는 UNIST 산업공학과 연구실입니다."
      />

      <section className="section">
        <div className="container">
          {/* thesis */}
          <Reveal className="about-lead">
            <span className="kicker">About the Lab</span>
            <p className="about-lead__stmt">
              UNIST 산업공학과 데이터 애널리틱스 연구실은 <span className="keep">제조, 물류, 의료, 교통</span> 등 다양한
              산업 현장의 복잡한 공학 문제를 해결하는 <strong>산업 AI 및 데이터사이언스 기술과 방법론</strong>을
              연구·개발합니다. 품질 향상, 시스템 모니터링 및 이상 탐지, 시계열 표현학습을 중심으로
              방법론 연구와 산업 현장의 실제 문제 해결을 함께 추구합니다.
            </p>
            <p className="about-lead__en">
              The Data Analytics Lab at UNIST develops novel statistical and data science
              methodologies—grounded in industrial AI and data science—to solve
              complex engineering problems across manufacturing, logistics, healthcare, and
              transportation. Our research centers on quality improvement, system monitoring
              and anomaly detection, and time-series representation learning.
            </p>
          </Reveal>

          {/* how we work */}
          <Reveal className="about-block">
            <div className="about-block__head">
              <span className="kicker">How we work</span>
              <h2 className="about-block__title">연구 방식</h2>
            </div>
            <div className="about-principles">
              {principles.map((p) => (
                <div key={p.n} className="principle">
                  <span className="principle__n">{p.n}</span>
                  <h3 className="principle__t">{p.t}</h3>
                  <span className="principle__en">{p.en}</span>
                  <p className="principle__d">{p.d}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* what we research */}
          <Reveal className="about-block">
            <div className="about-block__head">
              <span className="kicker">Research Focus</span>
              <h2 className="about-block__title">Industrial AI</h2>
              <p className="about-block__lead">
                제조·의료·서비스 도메인을 아우르는 산업 AI 연구
              </p>
            </div>
            <div className="about-domains">
              {domains.map((d) => (
                <div key={d.title} className="about-domain">
                  <div className="about-domain__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(d.image)} alt="" loading="lazy" />
                  </div>
                  <h3 className="about-domain__title">{d.title}</h3>
                  <p className="about-domain__desc">{d.desc}</p>
                  <div className="about-domain__kw">
                    {d.keywords.map((k) => (
                      <span key={k}>{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
