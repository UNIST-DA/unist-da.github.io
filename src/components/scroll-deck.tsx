"use client";

import { useEffect } from "react";
import { smoothScrollTo } from "@/lib/smooth-scroll";

// Desktop (mouse/trackpad): one wheel/key gesture animates to the next/previous
// full-screen section — the intro→hero glide, generalized to the whole deck,
// both directions. Touch devices keep the native CSS scroll-snap (which feels
// good there); CSS snap is disabled for fine pointers so the two don't fight.
export function ScrollDeck() {
  useEffect(() => {
    // mark the home page so CSS scroll-snap (touch) applies here only
    const html = document.documentElement;
    html.setAttribute("data-deck", "");

    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return () => html.removeAttribute("data-deck");

    let targets: number[] = [];
    const collect = () => {
      const header = (document.querySelector(".site-header") as HTMLElement)?.offsetHeight ?? 0;
      targets = Array.from(document.querySelectorAll<HTMLElement>(".intro, .hero, .section--full"))
        .map((el) => Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - header)))
        .sort((a, b) => a - b);
    };
    collect();

    let animating = false;
    let timer: ReturnType<typeof setTimeout>;

    const move = (dir: number) => {
      const y = window.scrollY;
      const target =
        dir > 0 ? targets.find((t) => t > y + 5) : [...targets].reverse().find((t) => t < y - 5);
      if (target == null) return false;
      animating = true;
      smoothScrollTo(target);
      clearTimeout(timer);
      timer = setTimeout(() => { animating = false; }, 720);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (document.body.hasAttribute("data-modal")) return; // a modal owns scroll
      if (animating) { e.preventDefault(); return; }
      if (Math.abs(e.deltaY) < 4 || !targets.length) return;
      const y = window.scrollY;
      // free scroll once well past the last section (Lab Life / footer)
      if (y > targets[targets.length - 1] + window.innerHeight) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const has = dir > 0 ? targets.some((t) => t > y + 5) : targets.some((t) => t < y - 5);
      if (!has) return;
      e.preventDefault();
      move(dir);
    };

    // Don't hijack keys while a control is focused, or the gesture that should
    // activate/scroll it (Space on a button, arrows in a select, etc.) is lost.
    const onInteractive = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      return (
        ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(el.tagName) ||
        el.isContentEditable
      );
    };
    const onKey = (e: KeyboardEvent) => {
      if (animating || document.body.hasAttribute("data-modal") || onInteractive()) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { if (move(1)) e.preventDefault(); }
      else if (["ArrowUp", "PageUp"].includes(e.key)) { if (move(-1)) e.preventDefault(); }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", collect);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", collect);
      clearTimeout(timer);
      html.removeAttribute("data-deck");
    };
  }, []);

  return null;
}
