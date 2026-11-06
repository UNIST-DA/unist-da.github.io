"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import type { EventItem } from "@/data/activity";

// Show exactly ROWS complete rows by default, whatever the column count is at
// the current resolution (the grid is `auto-fill`, so columns vary) — so the
// last visible row is always full, never ragged.
const ROWS = 2;

const fmt = (iso: string) =>
  new Date((iso.length === 7 ? `${iso}-01` : iso) + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    ...(iso.length === 7 ? {} : { day: "2-digit" as const }),
  });

export function EventsGrid({ events }: { events: EventItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(4);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () =>
      setCols(
        getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length || 1
      );
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const limit = cols * ROWS;
  const shown = showAll ? events : events.slice(0, limit);

  return (
    <>
      <div className="events" ref={gridRef}>
        {shown.map((e) => (
          <div key={e.date + e.title} className="event">
            {e.image && (
              <div className="event__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(e.image)} alt={e.title} loading="lazy" />
              </div>
            )}
            <div className="event__body">
              <span className="event__date">{fmt(e.date)}</span>
              <div className="event__title">{e.title}</div>
            </div>
          </div>
        ))}
      </div>

      {events.length > limit && (
        <div className="more-wrap">
          <button className="more-btn" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "접기" : `전체 보기 (${events.length})`}
          </button>
        </div>
      )}
    </>
  );
}
