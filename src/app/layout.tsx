import type { Metadata, Viewport } from "next";
import { getEvent } from "@/lib/content";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Una Noche Mexicana · ערב מקסיקני",
  description: "הזמנה אישית לערב מקסיקני — טאקוס, דרינקים וחברים.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Una Noche Mexicana",
    description: "ערב מקסיקני, טאקוס, דרינקים וחברים — מוזמנים!",
    locale: "he_IL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#6a1426",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const { fontTheme } = getEvent();
  return (
    <html lang="he" dir="rtl" data-font={fontTheme} className={fontVariables}>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
