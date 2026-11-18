import { formatEventDate } from "@/lib/format";
import type { PublicEvent } from "@/lib/types";
import { RsvpForm } from "./RsvpForm";

export function Rsvp({ event }: { event: PublicEvent }) {
  const date = formatEventDate(event.date);
  const eventLabel = date ? `${event.title} · ${date}` : event.title;

  return (
    <section id="rsvp" className="relative isolate overflow-hidden bg-jade-deep py-16 sm:py-24" aria-labelledby="rsvp-title">
      <div className="tile-pattern pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" aria-hidden />
      <div className="mx-auto max-w-xl px-5 sm:px-8">
        <div className="mb-10 text-center text-cream">
          <p lang="es" dir="ltr" className="font-display text-3xl italic text-turquoise-soft sm:text-4xl">
            ¿Vienes?
          </p>
          <h2 id="rsvp-title" className="mt-1 font-serif text-4xl font-bold sm:text-5xl">
            אישור הגעה
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-cream/75 text-pretty">
            כל אחד ואחת מאשרים לעצמם — התשובה נשלחת אליי בהודעת וואטסאפ.
          </p>
        </div>
        <RsvpForm rsvpOpen={event.rsvpOpen} hostWhatsApp={event.hostWhatsApp} eventLabel={eventLabel} />
      </div>
    </section>
  );
}
