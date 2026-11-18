import { Fragment } from "react";
import { IconChili, IconLeaf, IconSprout, IconWheat, Star8 } from "@/components/icons";
import { isSketch } from "@/lib/sketches";
import type { DishTags, PublicCategory } from "@/lib/types";

const TAGS = [
  { key: "vegan", label: "טבעוני", Icon: IconLeaf, cls: "text-jade" },
  { key: "vegetarian", label: "צמחוני", Icon: IconSprout, cls: "text-agave" },
  { key: "spicy", label: "חריף", Icon: IconChili, cls: "text-terracotta" },
  { key: "glutenFree", label: "ללא גלוטן", Icon: IconWheat, cls: "text-cobalt" },
] as const;

const activeTags = (tags: DishTags) => TAGS.filter((t) => tags[t.key] && !(t.key === "vegetarian" && tags.vegan));

function DishMarks({ tags }: { tags: DishTags }) {
  const active = activeTags(tags);
  if (!active.length) return null;
  return (
    <span className="ms-1.5 inline-flex items-center gap-1 align-[0.05em]">
      {active.map(({ key, label, Icon, cls }) => (
        <span key={key} title={label} className={cls}>
          <Icon size={15} />
          <span className="sr-only">{label}</span>
        </span>
      ))}
    </span>
  );
}

function CourseDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-2 text-cobalt/70" aria-hidden>
      <span className="size-1 rounded-full bg-turquoise" />
      <Star8 size={14} />
      <span className="size-1 rounded-full bg-turquoise" />
    </div>
  );
}

export function Menu({ menu }: { menu: PublicCategory[] }) {
  const usedTags = TAGS.filter((t) => menu.some((c) => c.dishes.some((d) => activeTags(d.tags).includes(t))));

  return (
    <section id="menu" className="grain relative bg-paper px-4 py-14 sm:py-20" aria-labelledby="menu-title">
      {/* Printed-menu card with a double hairline frame */}
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-cobalt/20 bg-paper px-5 py-12 text-center outline outline-1 outline-offset-[6px] outline-burgundy/15 sm:px-14 sm:py-16">
        <p lang="es" dir="ltr" className="font-display text-xl italic text-cobalt">
          El Menú
        </p>
        <h2 id="menu-title" className="mt-1 font-serif text-4xl font-bold text-burgundy sm:text-5xl">
          מה על השולחן
        </h2>
        <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-terracotta" aria-hidden>
          <span className="h-px w-12 bg-current opacity-40" />
          <Star8 size={16} />
          <span className="h-px w-12 bg-current opacity-40" />
        </div>

        {menu.length === 0 ? (
          <p className="mt-12 font-serif text-xl text-ink-soft">התפריט ייחשף בקרוב…</p>
        ) : (
          <div className="mt-10 space-y-8 sm:mt-12">
            {menu.map((cat, i) => (
              <Fragment key={cat.id}>
                {i > 0 && <CourseDivider />}
                <article className="print-break">
                  {cat.accent && (
                    <p lang="es" dir="ltr" className="font-display text-[0.95rem] italic tracking-wide text-cobalt">
                      {cat.accent}
                    </p>
                  )}
                  <h3 className="mt-0.5 font-serif text-[1.65rem] font-bold leading-tight text-burgundy sm:text-3xl">
                    {cat.name}
                  </h3>
                  <ul className="mt-5 space-y-7">
                    {cat.dishes.map((d) => (
                      <li key={d.id} className="flex flex-col items-center">
                        {d.image &&
                          (isSketch(d.image) ? (
                            // Hand-drawn illustration: shown uncropped, like a sketch in a printed menu
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={d.image}
                              alt=""
                              loading="lazy"
                              width={150}
                              height={120}
                              className="mb-1 h-[104px] w-[130px] object-contain mix-blend-multiply sm:h-[120px] sm:w-[150px]"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={d.image}
                              alt=""
                              loading="lazy"
                              className="mb-3 size-20 rounded-full object-cover ring-1 ring-cobalt/15 ring-offset-4 ring-offset-paper"
                            />
                          ))}
                        <p className="font-serif text-[1.22rem] font-medium leading-snug text-ink text-balance">
                          {d.name}
                          <DishMarks tags={d.tags} />
                        </p>
                        {d.description && (
                          <p className="mt-0.5 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft text-balance">
                            {d.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              </Fragment>
            ))}
          </div>
        )}

        <p className="mt-12 font-serif text-lg text-ink-soft">…ועוד כמה הפתעות שנשמור לערב עצמו</p>
        {usedTags.length > 0 && (
          <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-soft">
            {usedTags.map(({ key, label, Icon, cls }) => (
              <li key={key} className="inline-flex items-center gap-1.5">
                <Icon size={15} className={cls} />
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
