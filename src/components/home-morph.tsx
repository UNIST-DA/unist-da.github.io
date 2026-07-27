"use client";

import { useEffect, useRef, useState } from "react";

// First screen — a statistical process control (SPC) chart draws live, an
// out-of-limit point is caught as an anomaly, then the chart recedes and the
// lab identity resolves in. It's a normal full-screen section; the page-wide
// CSS scroll-snap carries the smooth one-screen-at-a-time transitions.
const DRAW = 2800; // ms to draw the chart
const RES = 1500; // ms to resolve into the wordmark

type Pt = { x: number; y: number; anomaly: boolean };

export function HomeMorph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0;
    let pts: Pt[] = [];
    let cy = 0, ucl = 0, lcl = 0, aIdx = 0;

    const build = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const N = W < 760 ? 30 : 46;
      const padX = W * 0.09;
      const plotW = W - padX * 2;
      cy = H * 0.46;
      const limit = H * 0.17;
      ucl = cy - limit;
      lcl = cy + limit;
      aIdx = Math.floor(N * 0.64);

      pts = [];
      for (let i = 0; i < N; i++) {
        const x = padX + (i / (N - 1)) * plotW;
        const anomaly = i === aIdx;
        const y = anomaly
          ? ucl - H * 0.05
          : cy + (Math.random() - 0.5) * 2 * (limit * 0.62);
        pts.push({ x, y, anomaly });
      }
    };

    build();

    const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
    const t0 = performance.now();
    let revealedFired = false;
    let stopped = false;

    const render = (now: number) => {
      const el = now - t0;
      // Schedule the next frame BEFORE drawing so a transient draw error can't
      // kill the loop (it self-heals next frame). Once the intro has fully
      // resolved, stop instead — otherwise it repaints a full-screen canvas
      // forever at the monitor's refresh rate, and that continuous GPU /
      // main-thread load froze scrolling and clicks on high-refresh / high-DPI
      // displays (reported on Windows).
      if (el >= DRAW + RES) stopped = true;
      else raf = requestAnimationFrame(render);
      if (!pts[0]) return;
      const p1 = Math.min(1, el / DRAW);
      const p2 = Math.min(1, Math.max(0, (el - DRAW) / RES));
      const ca = 1 - 0.82 * easeOut(p2);
      const t = (now - t0) / 1000;

      if (!revealedFired && el >= DRAW) { revealedFired = true; setRevealed(true); }

      ctx.clearRect(0, 0, W, H);

      const light = document.documentElement.dataset.theme === "light";
      const inkP = light ? "26,26,34" : "232,238,255";
      const blueP = light ? "15,98,254" : "120,160,255";
      const lineC = light ? "26,26,34" : "255,255,255";
      const limC = light ? "22,22,22" : "255,255,255";
      const meanC = light ? "15,98,254" : "120,160,255";
      const gridC = light ? "20,40,90" : "150,180,240";
      const redC = light ? "218,30,40" : "255,77,77";
      const labC = light ? "22,22,22" : "255,255,255";

      ctx.strokeStyle = `rgba(${gridC},${(light ? 0.07 : 0.05) * ca})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 60) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
      ctx.stroke();

      const padX = W * 0.09;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = `rgba(${limC},${(light ? 0.28 : 0.2) * ca})`;
      for (const ly of [ucl, lcl]) { ctx.beginPath(); ctx.moveTo(padX, ly); ctx.lineTo(W - padX, ly); ctx.stroke(); }
      ctx.strokeStyle = `rgba(${meanC},${(light ? 0.5 : 0.35) * ca})`;
      ctx.beginPath(); ctx.moveTo(padX, cy); ctx.lineTo(W - padX, cy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '500 11px ui-monospace, "SF Mono", monospace';
      ctx.fillStyle = `rgba(${labC},${(light ? 0.55 : 0.42) * ca})`;
      ctx.textBaseline = "middle";
      ctx.fillText("UCL", W - padX + 8, ucl);
      ctx.fillText("LCL", W - padX + 8, lcl);
      ctx.fillStyle = `rgba(${meanC},${0.7 * ca})`;
      ctx.fillText("μ", W - padX + 8, cy);

      const rf = p1 * (pts.length - 1);
      const whole = Math.floor(rf);
      ctx.strokeStyle = `rgba(${lineC},${0.5 * ca})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i <= whole; i++) ctx.lineTo(pts[i].x, pts[i].y);
      if (whole < pts.length - 1 && pts[whole] && pts[whole + 1]) {
        const f = rf - whole;
        const a = pts[whole], b = pts[whole + 1];
        ctx.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f);
      }
      ctx.stroke();

      for (let i = 0; i <= whole; i++) {
        const p = pts[i];
        if (!p) continue;
        if (p.anomaly) {
          ctx.fillStyle = `rgba(${redC},${ca})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill();
          const lock = Math.min(1, (rf - aIdx) / 2);
          const rad = 11 + (1 - easeOut(lock)) * 16 + Math.sin(t * 4) * 1.5;
          ctx.strokeStyle = `rgba(${redC},${0.9 * ca * lock})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.stroke();
          const s = rad + 5;
          ctx.beginPath();
          for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
            ctx.moveTo(p.x + sx * s, p.y + sy * (s - 6));
            ctx.lineTo(p.x + sx * s, p.y + sy * s);
            ctx.lineTo(p.x + sx * (s - 6), p.y + sy * s);
          }
          ctx.stroke();
          if (lock > 0.5) {
            ctx.font = '600 11px ui-monospace, "SF Mono", monospace';
            ctx.fillStyle = `rgba(${redC},${ca})`;
            ctx.fillText("ANOMALY · 3.2σ", p.x + s + 6, p.y);
          }
        } else {
          ctx.fillStyle = i % 7 === 0 ? `rgba(${blueP},${0.9 * ca})` : `rgba(${inkP},${0.85 * ca})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2); ctx.fill();
        }
      }
    };

    const onResize = () => {
      build();
      if (stopped) raf = requestAnimationFrame(render); // one repaint at the new size
    };

    let raf = requestAnimationFrame(render);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="intro" aria-label="Welcome to Data Analytics Lab">
      <canvas ref={canvasRef} className="intro__canvas" />
      <div className={`intro__resolve ${revealed ? "is-on" : ""}`}>
        <span className="intro__kicker">WELCOME TO</span>
        <h1 className="intro__title">Data Analytics Lab</h1>
        <p className="intro__tag">We find the signal in the noise.</p>
      </div>
      <div className="intro__cue">SCROLL</div>
    </section>
  );
}
