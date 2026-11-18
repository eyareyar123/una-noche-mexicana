"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { IconCheck, IconWhatsapp } from "@/components/icons";

/**
 * RSVP without a server: the form composes a WhatsApp message to the host.
 * The guest's last answer is remembered on their own device only, so they
 * can easily send an update later.
 */

const STORAGE_KEY = "unm.rsvp.v2";

type Answer = { fullName: string; attending: boolean; dietary: string; comments: string };

function readStoredRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
function parseStored(raw: string | null): Answer | null {
  if (!raw) return null;
  try {
    const a = JSON.parse(raw) as Answer;
    return typeof a?.fullName === "string" && typeof a.attending === "boolean" ? a : null;
  } catch {
    return null;
  }
}
function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
function writeStored(a: Answer) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  } catch {
    /* private mode — ignore */
  }
}

function buildMessage(a: Answer, eventLabel: string, isUpdate: boolean) {
  const lines = [
    `🌮 ${eventLabel}`,
    isUpdate ? "*עדכון לאישור ההגעה*" : "*אישור הגעה*",
    "",
    `שם: ${a.fullName.trim()}`,
    a.attending ? "מגיע/ה: כן! ¡Sí!" : "מגיע/ה: לצערי לא אוכל להגיע",
  ];
  if (a.attending && a.dietary.trim()) lines.push(`הגבלות תזונה / אלרגיות: ${a.dietary.trim()}`);
  if (a.comments.trim()) lines.push(`הערות: ${a.comments.trim()}`);
  return lines.join("\n");
}

function whatsappUrl(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

type Props = { rsvpOpen: boolean; hostWhatsApp: string; eventLabel: string };

export function RsvpForm({ rsvpOpen, hostWhatsApp, eventLabel }: Props) {
  const storedRaw = useSyncExternalStore(subscribeStorage, readStoredRaw, () => null);
  const existing = useMemo(() => parseStored(storedRaw), [storedRaw]);
  const [mode, setMode] = useState<"auto" | "new" | "update">("auto");
  const [done, setDone] = useState<{ answer: Answer; url: string } | null>(null);

  if (!rsvpOpen) {
    return (
      <div className="rounded-3xl bg-paper p-8 text-center shadow-[var(--shadow-lift)]">
        <p className="font-serif text-2xl font-bold text-burgundy">ההרשמה סגורה כרגע</p>
        <p className="mt-2 text-ink-soft">לשאלות ושינויים — דברו איתי ישירות.</p>
      </div>
    );
  }

  if (done) {
    return (
      <Success
        answer={done.answer}
        url={done.url}
        onAgain={() => {
          setDone(null);
          setMode("update");
        }}
      />
    );
  }

  if (existing && mode === "auto") {
    return (
      <div className="rounded-3xl bg-paper p-8 text-center shadow-[var(--shadow-lift)] animate-fade">
        <p lang="es" dir="ltr" className="font-display text-2xl italic text-terracotta">
          ¡Hola de nuevo!
        </p>
        <p className="mt-2 font-serif text-2xl font-bold text-burgundy">
          כבר שלחת תשובה{existing.fullName ? `, ${existing.fullName.split(" ")[0]}` : ""}
        </p>
        <p className="mt-2 text-ink-soft">
          {existing.attending ? "סימנת שמגיעים — איזה כיף!" : "סימנת שלא תוכל/י להגיע."} רוצה לשנות משהו?
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setMode("update")}
            className="inline-flex h-13 items-center justify-center rounded-full bg-burgundy px-8 py-3.5 text-base font-bold text-cream transition hover:bg-wine"
          >
            עדכון התשובה שלי
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className="inline-flex h-13 items-center justify-center rounded-full border border-burgundy/25 px-6 py-3.5 text-base font-semibold text-burgundy transition hover:bg-burgundy/5"
          >
            אישור הגעה עבור מישהו אחר
          </button>
        </div>
      </div>
    );
  }

  const isUpdate = mode === "update" && !!existing;
  return (
    <Form
      key={mode}
      initial={isUpdate ? existing : null}
      isUpdate={isUpdate}
      onSubmit={(answer) => {
        const url = whatsappUrl(hostWhatsApp, buildMessage(answer, eventLabel, isUpdate));
        // Open WhatsApp (app on phones, WhatsApp Web on desktop).
        const w = window.open(url, "_blank");
        if (w) w.opener = null;
        else window.location.href = url;
        writeStored(answer);
        setDone({ answer, url });
        requestAnimationFrame(() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }}
    />
  );
}

function Form({
  initial,
  isUpdate,
  onSubmit,
}: {
  initial: Answer | null;
  isUpdate: boolean;
  onSubmit: (a: Answer) => void;
}) {
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [attending, setAttending] = useState<boolean | null>(initial ? initial.attending : null);
  const [dietary, setDietary] = useState(initial?.dietary ?? "");
  const [comments, setComments] = useState(initial?.comments ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const ids = { name: useId(), dietary: useId(), comments: useId() };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (fullName.trim().length < 2) errs.fullName = "נא למלא שם מלא";
    if (attending === null) errs.attending = "נא לבחור אם מגיעים";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(errs.fullName ? ids.name : "rsvp-attending")?.focus();
      return;
    }
    onSubmit({
      fullName: fullName.trim().slice(0, 80),
      attending: !!attending,
      dietary: attending ? dietary.trim().slice(0, 500) : "",
      comments: comments.trim().slice(0, 1000),
    });
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-paper p-6 shadow-[var(--shadow-lift)] sm:p-9">
      {isUpdate && (
        <p className="mb-6 rounded-xl bg-turquoise-soft/50 px-4 py-3 text-sm font-semibold text-jade-deep">
          מעדכנים את התשובה הקודמת — שנו מה שצריך ושלחו שוב.
        </p>
      )}

      <div>
        <label htmlFor={ids.name} className="block text-base font-bold text-ink">
          שם מלא <span className="text-terracotta">*</span>
        </label>
        <input
          id={ids.name}
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          enterKeyHint="next"
          maxLength={80}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? `${ids.name}-err` : undefined}
          className="mt-2 h-14 w-full rounded-2xl border border-ink/15 bg-white px-4 text-[1.1rem] text-ink transition placeholder:text-ink-mute focus:border-burgundy focus:outline-none focus:ring-4 focus:ring-burgundy/10 aria-[invalid=true]:border-terracotta"
          placeholder="איך קוראים לך?"
        />
        {errors.fullName && (
          <p id={`${ids.name}-err`} className="mt-1.5 text-sm font-semibold text-terracotta">
            {errors.fullName}
          </p>
        )}
      </div>

      <fieldset className="mt-7">
        <legend className="text-base font-bold text-ink">
          מגיעים? <span className="text-terracotta">*</span>
        </legend>
        <div id="rsvp-attending" tabIndex={-1} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup">
          <Choice checked={attending === true} onSelect={() => setAttending(true)} title="מגיע/ה!" accent="¡Sí, claro!" tone="yes" />
          <Choice
            checked={attending === false}
            onSelect={() => setAttending(false)}
            title="לצערי לא אוכל להגיע"
            accent="La próxima vez"
            tone="no"
          />
        </div>
        {errors.attending && <p className="mt-1.5 text-sm font-semibold text-terracotta">{errors.attending}</p>}
      </fieldset>

      {attending !== false && (
        <div className="mt-7 animate-fade">
          <label htmlFor={ids.dietary} className="block text-base font-bold text-ink">
            הגבלות תזונה / אלרגיות <span className="text-sm font-normal text-ink-mute">(לא חובה)</span>
          </label>
          <input
            id={ids.dietary}
            name="dietary"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            maxLength={500}
            className="mt-2 h-14 w-full rounded-2xl border border-ink/15 bg-white px-4 text-[1.05rem] text-ink transition placeholder:text-ink-mute focus:border-burgundy focus:outline-none focus:ring-4 focus:ring-burgundy/10"
            placeholder="טבעוני/ת, אלרגיה לבוטנים, בלי כוסברה…"
          />
        </div>
      )}

      <div className="mt-7">
        <label htmlFor={ids.comments} className="block text-base font-bold text-ink">
          משהו נוסף? <span className="text-sm font-normal text-ink-mute">(לא חובה)</span>
        </label>
        <textarea
          id={ids.comments}
          name="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          maxLength={1000}
          rows={3}
          className="mt-2 w-full resize-y rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-[1.05rem] leading-relaxed text-ink transition placeholder:text-ink-mute focus:border-burgundy focus:outline-none focus:ring-4 focus:ring-burgundy/10"
          placeholder="ברכה, שאלה, בקשה לשיר…"
        />
      </div>

      <button
        type="submit"
        className="mt-8 inline-flex h-15 w-full items-center justify-center gap-2.5 rounded-full bg-burgundy py-4 text-lg font-bold text-cream shadow-[0_14px_30px_-14px_rgba(106,20,38,0.8)] transition hover:bg-wine"
      >
        <IconWhatsapp size={22} />
        {isUpdate ? "שליחת העדכון בוואטסאפ" : "שליחת אישור בוואטסאפ"}
      </button>
      <p className="mt-3 text-center text-sm text-ink-mute">ייפתח וואטסאפ עם הודעה מוכנה — רק ללחוץ ״שליחה״.</p>
    </form>
  );
}

function Choice({
  checked,
  onSelect,
  title,
  accent,
  tone,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  accent: string;
  tone: "yes" | "no";
}) {
  const on =
    tone === "yes"
      ? "border-olive bg-lime/25 ring-2 ring-olive/30"
      : "border-burgundy/60 bg-burgundy/[0.06] ring-2 ring-burgundy/15";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={`flex min-h-[4.5rem] items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-start transition ${
        checked ? on : "border-ink/15 hover:border-ink/30"
      }`}
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
          checked ? (tone === "yes" ? "border-olive bg-olive text-cream" : "border-burgundy bg-burgundy text-cream") : "border-ink/25"
        }`}
      >
        {checked && <IconCheck size={16} strokeWidth={2.4} />}
      </span>
      <span className="flex flex-col">
        <span className="text-[1.08rem] font-bold leading-tight text-ink">{title}</span>
        <span lang="es" dir="ltr" className="text-end font-display text-sm italic text-ink-mute">
          {accent}
        </span>
      </span>
    </button>
  );
}

function Success({ answer, url, onAgain }: { answer: Answer; url: string; onAgain: () => void }) {
  const first = answer.fullName.split(" ")[0];
  return (
    <div className="rounded-3xl bg-paper p-7 text-center shadow-[var(--shadow-lift)] sm:p-10 animate-rise" role="status">
      {answer.attending ? (
        <>
          <p className="font-display text-5xl font-medium italic text-jade sm:text-6xl" lang="es" dir="ltr">
            ¡Qué bueno!
          </p>
          <p className="mt-3 font-serif text-[1.7rem] font-bold leading-tight text-burgundy">מחכים לראות אותך!</p>
          <p className="mt-2 text-ink-soft">{first ? `${first}, ` : ""}שריינו לך מקום ליד השולחן.</p>
        </>
      ) : (
        <>
          <p className="font-display text-4xl italic text-terracotta sm:text-5xl" lang="es" dir="ltr">
            ¡Te vamos a extrañar!
          </p>
          <p className="mt-3 font-serif text-[1.6rem] font-bold leading-tight text-burgundy">תודה שעדכנת</p>
          <p className="mt-2 text-ink-soft text-pretty">
            חבל שלא תוכל/י להצטרף — נרים כוסית לכבודך. אם התוכניות משתנות, אפשר לעדכן בכל רגע.
          </p>
        </>
      )}

      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-jade/40 bg-turquoise-soft/30 p-5 text-start">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <IconWhatsapp size={18} className="text-jade" />
          השלב האחרון: ללחוץ ״שליחה״ בוואטסאפ
        </p>
        <p className="mt-1 text-sm text-ink-soft">התשובה מגיעה אליי רק אחרי שההודעה נשלחת. וואטסאפ לא נפתח?</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-jade text-sm font-bold text-cream transition hover:bg-jade-deep"
        >
          <IconWhatsapp size={18} />
          פתיחת וואטסאפ שוב
        </a>
      </div>

      <button type="button" onClick={onAgain} className="mt-6 text-sm font-semibold text-burgundy underline underline-offset-4">
        לשנות את התשובה
      </button>
    </div>
  );
}
