"use client";

import { useEffect, useState } from "react";

/** Small floating RSVP pill on mobile, shown between the hero and the RSVP section. */
export function StickyRsvp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("header");
    const rsvp = document.getElementById("rsvp");
    if (!hero || !rsvp) return;
    let heroVisible = true;
    let rsvpVisible = false;
    let pastRsvp = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) heroVisible = e.isIntersecting;
          if (e.target === rsvp) {
            rsvpVisible = e.isIntersecting;
            // Scrolled beyond the form (details/footer) — no need for the shortcut.
            pastRsvp = !e.isIntersecting && e.boundingClientRect.top < 0;
          }
        }
        setShow(!heroVisible && !rsvpVisible && !pastRsvp);
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(hero);
    io.observe(rsvp);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition duration-300 sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <a
        href="#rsvp"
        className="inline-flex h-13 items-center rounded-full bg-burgundy px-7 py-3.5 text-base font-bold text-cream shadow-[0_12px_30px_-8px_rgba(51,8,15,0.7)] ring-1 ring-lime/40"
      >
        אישור הגעה
      </a>
    </div>
  );
}
