"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SeminarItem } from "@/data/seminars";
import { SeminarNotes } from "./seminar-notes";

type Filter = "all" | "Lab Seminar" | "Paper Review";
const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Lab Seminar", label: "Lab Seminar" },
  { key: "Paper Review", label: "Paper Review" },
];
const LIMIT = 9;

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });

function Badge({ c }: { c: SeminarItem["category"] }) {
  return <span className={`sem-badge ${c === "Paper Review" ? "sem-badge--review" : ""}`}>{c}</span>;
}

export function SeminarList({ seminars }: { seminars: SeminarItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [kw, setKw] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<SeminarItem | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const featured = seminars[0];

  // most-used keywords → a quick filter bar
  const topKeywords = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of seminars) for (const k of s.keywords) counts.set(k, (counts.get(k) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16).map(([k]) => k);
  }, [seminars]);

  const list = useMemo(
    () =>
      seminars.filter(
        (s) => (filter === "all" || s.category === filter) && (!kw || s.keywords.includes(kw)),
      ),
    [filter, kw, seminars],
  );
  const shown = showAll ? list : list.slice(0, LIMIT);
  const pick = (key: Filter) => { setFilter(key); setShowAll(false); };
  const toggleKw = (k: string) => { setKw((cur) => (cur === k ? null : k)); setShowAll(false); };

  // open = a modal-like panel; lock the page + pause the scroll-deck while open,
  // move focus into the dialog, trap Tab, and restore focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = () =>
      panel
        ? [...panel.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])')].filter(
            (el) => !el.hasAttribute("disabled"),
          )
        : [];
    (panel?.querySelector(".sem-modal__close") as HTMLElement | null)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); return; }
      if (e.key === "Tab") {
        const f = focusable();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.setAttribute("data-modal", "");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.removeAttribute("data-modal");
      document.body.style.overflow = prev;
      trigger?.focus?.();
    };
  }, [open]);

  if (!featured) return null;

  return (
    <div>
      {/* featured latest */}
      <button type="button" className="sem-featured" onClick={() => setOpen(featured)}>
        <div className="sem-top">
          <Badge c={featured.category} />
          <span className="sem-date">{fmt(featured.date)}</span>
          <span className="sem-featured__label">LATEST SEMINAR</span>
        </div>
        <div className="sem-featured__title">{featured.title}</div>
        {featured.presenter && <div className="sem-featured__meta">Presented by {featured.presenter}</div>}
        <div className="sem-kw-row">
          {featured.keywords.map((k) => <span key={k} className="sem-kw">{k}</span>)}
        </div>
      </button>

      {/* tabs */}
      <div className="tabs" style={{ marginTop: 36 }}>
        {TABS.map((t) => (
          <button key={t.key} className={`tab ${filter === t.key ? "is-active" : ""}`} onClick={() => pick(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* keyword quick-filter */}
      {topKeywords.length > 0 && (
        <div className="sem-kwfilter">
          {topKeywords.map((k) => (
            <button
              key={k}
              type="button"
              className={`sem-kwchip ${kw === k ? "is-active" : ""}`}
              onClick={() => toggleKw(k)}
            >
              {k}
            </button>
          ))}
        </div>
      )}

      {/* grid */}
      <div className="sem-grid">
        {shown.map((s) => (
          <button type="button" key={s.slug} className="sem-card glow" onClick={() => setOpen(s)}>
            <div className="sem-top">
              <Badge c={s.category} />
              <span className="sem-date">{fmt(s.date)}</span>
            </div>
            <div className="sem-card__title">{s.title}</div>
            {s.presenter && <div className="sem-card__presenter">{s.presenter}</div>}
            <div className="sem-card__kw">
              {s.keywords.slice(0, 3).map((k) => <span key={k} className="sem-kw">{k}</span>)}
            </div>
          </button>
        ))}
      </div>

      {list.length > LIMIT && (
        <div className="more-wrap">
          <button className="more-btn" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "접기" : `전체 보기 (${list.length})`}
          </button>
        </div>
      )}

      {/* modal-like write-up panel — portal to <body> so a transformed
          ancestor (Reveal) can't clip the fixed overlay */}
      {open && createPortal(
        <div className="sem-modal" role="dialog" aria-modal="true" aria-labelledby="sem-modal-title" onClick={() => setOpen(null)}>
          <div ref={panelRef} className="sem-modal__panel" onClick={(e) => e.stopPropagation()}>
            <button className="sem-modal__close" onClick={() => setOpen(null)} aria-label="닫기">✕</button>
            <div className="sem-modal__head">
              <div className="sem-top">
                <Badge c={open.category} />
                <span className="sem-date">{fmt(open.date)}</span>
              </div>
              <h3 id="sem-modal-title" className="sem-modal__title">{open.title}</h3>
              {open.presenter && <div className="sem-modal__meta">Presented by {open.presenter}</div>}
              {open.keywords.length > 0 && (
                <div className="sem-kw-row">
                  {open.keywords.map((k) => <span key={k} className="sem-kw">{k}</span>)}
                </div>
              )}
            </div>
            <div className="sem-modal__notes">
              {open.notes?.trim() ? (
                <SeminarNotes md={open.notes} />
              ) : (
                <p className="sem-notes__empty">아직 정리된 내용이 없습니다.</p>
              )}
            </div>
            {open.url && (
              <a href={open.url} target="_blank" rel="noopener noreferrer" className="sem-modal__link">
                내부 노션에서 보기 <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
