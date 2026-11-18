import { DesertBand, Garland, HeroArch, TalaveraBand } from "@/components/decor";
import { IconCalendar, IconClock, IconPin } from "@/components/icons";
import { asset } from "@/lib/asset";
import { formatEventDate, formatEventTime } from "@/lib/format";
import type { PublicEvent } from "@/lib/types";

function TitleLockup({ title }: { title: string }) {
  const isDefault = title.trim().toLowerCase() === "una noche mexicana";
  if (!isDefault) {
    return <h1 className="font-serif text-5xl leading-[1.05] text-cream sm:text-6xl text-balance">{title}</h1>;
  }
  return (
    <h1 lang="es" dir="ltr" className="font-display text-center text-cream lg:text-right" aria-label="Una Noche Mexicana">
      <span className="text-[1.6rem] font-light italic leading-none text-terracotta-soft sm:text-3xl">Una </span>
      <span className="text-[3.6rem] font-medium italic leading-[0.95] tracking-[-0.02em] text-lime sm:text-7xl lg:text-[5.5rem]">
        Noche
      </span>
      <span className="block text-[2.6rem] font-light leading-[1] tracking-[-0.01em] sm:text-6xl lg:text-[4.2rem]">
        Mexicana
      </span>
    </h1>
  );
}

/**
 * Compact hero: title + the essentials (date · time · place) above the fold,
 * so guests reach the menu immediately.
 */
export function Hero({ event }: { event: PublicEvent }) {
  const date = formatEventDate(event.date);
  const time = formatEventTime(event.time, event.endTime);
  const place = event.locationName || (event.address ? event.address.split(",")[0] : "");

  const details = [
    { icon: IconCalendar, label: "מתי", value: date, placeholder: "התאריך ייקבע בקרוב" },
    { icon: IconClock, label: "שעה", value: time, placeholder: "תעודכן בקרוב" },
    { icon: IconPin, label: "איפה", value: place || null, placeholder: "יעודכן בקרוב" },
  ];

  return (
    <header className="relative isolate overflow-hidden bg-burgundy text-cream">
      <div className="tile-pattern pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-wine/60 blur-3xl"
        aria-hidden
      />
      <Garland className="absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-16">
        <div className="flex items-center justify-between text-cream/75">
          <p className="eyebrow">הזמנה פרטית · ערב בבית</p>
          <span className="flex shrink-0 items-center gap-1.5 sm:gap-2" dir="ltr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/safam-logo-light.svg")} alt="" width={40} height={20} className="h-4 w-8 sm:h-5 sm:w-10" />
            <span className="whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-cream/70 sm:text-[0.68rem] sm:tracking-[0.2em]">
              Made By Safam
            </span>
          </span>
        </div>

        <div className="grid items-center gap-8 pb-8 pt-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:pb-12 lg:pt-8">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start animate-rise">
            <TitleLockup title={event.title} />
            {event.subtitle && (
              <p className="mt-4 max-w-md font-serif text-xl leading-snug text-cream/90 sm:text-2xl text-balance">
                {event.subtitle}
              </p>
            )}

            {/* Date · time · place — the first thing a guest needs */}
            <dl className="mt-7 grid w-full max-w-xl grid-cols-3 overflow-hidden rounded-2xl border border-cream/15 bg-burgundy-deep/50 backdrop-blur-sm">
              {details.map(({ icon: Icon, label, value, placeholder }, i) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-1 px-2 py-3.5 text-center sm:px-4 sm:py-4 ${
                    i > 0 ? "border-s border-cream/10" : ""
                  }`}
                >
                  <Icon size={18} className="text-turquoise" />
                  <dt className="text-[0.7rem] font-semibold tracking-wider text-cream/55">{label}</dt>
                  <dd
                    className={`font-serif text-[0.98rem] leading-tight sm:text-lg ${
                      value ? "text-cream" : "text-[0.85rem] text-cream/50 italic"
                    }`}
                  >
                    {value ?? placeholder}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex w-full max-w-xl gap-3">
              <a
                href="#rsvp"
                className="inline-flex h-13 flex-1 items-center justify-center rounded-full bg-lime px-6 text-lg font-bold text-burgundy-ink shadow-[0_10px_30px_-10px_rgba(185,212,67,0.7)] transition hover:-translate-y-0.5 hover:bg-lime-soft"
              >
                אני מגיע/ה!
              </a>
              <a
                href="#details"
                className="inline-flex h-13 items-center justify-center rounded-full border border-cream/30 px-5 text-base font-semibold text-cream/90 transition hover:border-cream/60 hover:bg-cream/5"
              >
                איך מגיעים
              </a>
            </div>
          </div>

          {/* Arch illustration / photo — desktop only, keeps mobile compact */}
          <div className="hidden justify-center lg:flex animate-fade">
            <HeroArch image={event.heroImage} className="h-[420px] w-[315px]" />
          </div>
        </div>
      </div>

      {/* Desert horizon — the mobile stand-in for the arch */}
      <DesertBand className="lg:hidden" />
      <TalaveraBand />
    </header>
  );
}
