import Link from "next/link";
import { Ornament } from "@/components/decor";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-burgundy px-6 text-center text-cream">
      <p lang="es" dir="ltr" className="font-display text-5xl italic text-lime">
        ¡Ay, caramba!
      </p>
      <Ornament className="mt-5" tone="text-cream/50" />
      <h1 className="mt-5 font-serif text-3xl font-bold">הדף הזה לא נמצא</h1>
      <Link
        href="/"
        className="mt-8 inline-flex h-13 items-center rounded-full bg-lime px-8 py-3.5 font-bold text-burgundy-ink transition hover:bg-lime-soft"
      >
        להזמנה
      </Link>
    </div>
  );
}
