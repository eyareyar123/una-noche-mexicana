import { Ornament } from "@/components/decor";
import { IconCalendar, IconInfo, IconPin } from "@/components/icons";
import { formatEventDate, formatEventTime, mapsLinks } from "@/lib/format";
import type { PublicEvent } from "@/lib/types";

function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="font-serif text-lg italic text-ink-mute">{children}</p>;
}

export function Details({ event }: { event: PublicEvent }) {
  const date = formatEventDate(event.date, true);
  const time = formatEventTime(event.time, event.endTime);
  const links = event.address ? mapsLinks(event.address) : null;

  return (
    <section id="details" className="bg-cream py-16 sm:py-20" aria-labelledby="details-title">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="text-center">
          <p lang="es" dir="ltr" className="font-display text-xl italic text-cobalt">
            Los Detalles
          </p>
          <h2 id="details-title" className="mt-1 font-serif text-4xl font-bold text-burgundy sm:text-5xl">
            פרטי הערב
          </h2>
          <Ornament className="mt-5" />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          <div className="rounded-3xl bg-paper p-7 shadow-[var(--shadow-card)]">
            <IconCalendar size={26} className="text-cobalt" />
            <h3 className="mt-4 text-sm font-bold tracking-wider text-ink-mute">מתי</h3>
            {date ? (
              <>
                <p className="mt-1 font-serif text-2xl font-bold leading-snug text-burgundy">{date}</p>
                {time && <p className="mt-1 text-lg text-ink-soft">בשעה {time}</p>}
              </>
            ) : (
              <Placeholder>התאריך והשעה יעודכנו בקרוב</Placeholder>
            )}
          </div>

          <div className="rounded-3xl bg-paper p-7 shadow-[var(--shadow-card)]">
            <IconPin size={26} className="text-cobalt" />
            <h3 className="mt-4 text-sm font-bold tracking-wider text-ink-mute">איפה</h3>
            {event.locationName || event.address ? (
              <>
                {event.locationName && (
                  <p className="mt-1 font-serif text-2xl font-bold leading-snug text-burgundy">{event.locationName}</p>
                )}
                {event.address && <p className="mt-1 text-lg leading-snug text-ink-soft">{event.address}</p>}
                {links && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={links.waze}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center rounded-full bg-burgundy px-5 text-sm font-bold text-cream transition hover:bg-wine"
                    >
                      ניווט עם Waze
                    </a>
                    <a
                      href={links.google}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center rounded-full border border-burgundy/25 px-5 text-sm font-bold text-burgundy transition hover:bg-burgundy/5"
                    >
                      Google Maps
                    </a>
                  </div>
                )}
              </>
            ) : (
              <Placeholder>הכתובת תעודכן בקרוב</Placeholder>
            )}
          </div>

          <div className="rounded-3xl bg-paper p-7 shadow-[var(--shadow-card)]">
            <IconInfo size={26} className="text-cobalt" />
            <h3 className="mt-4 text-sm font-bold tracking-wider text-ink-mute">טוב לדעת</h3>
            {event.additionalInfo ? (
              <p className="mt-2 whitespace-pre-line text-[1.02rem] leading-relaxed text-ink-soft text-pretty">
                {event.additionalInfo}
              </p>
            ) : (
              <Placeholder>פרטים נוספים יעודכנו בקרוב</Placeholder>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
