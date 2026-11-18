import { Star8 } from "@/components/icons";
import { asset } from "@/lib/asset";

export function Footer() {
  return (
    <footer className="bg-burgundy-ink pb-8 pt-12 text-center text-cream/70">
      <Star8 size={18} className="mx-auto text-lime" />
      <p lang="es" dir="ltr" className="mt-4 font-display text-2xl italic text-cream">
        ¡Nos vemos pronto!
      </p>
      <p className="mt-2 text-sm">ערב אחד, שולחן אחד, הרבה טאקוס · ירושלים</p>

      <div className="mx-auto mt-10 flex w-fit items-center gap-2.5 border-t border-cream/10 pt-6" dir="ltr">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/safam-logo-light.svg")} alt="" width={48} height={24} className="h-6 w-12 opacity-90" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/60">Made By Safam</span>
      </div>
    </footer>
  );
}
