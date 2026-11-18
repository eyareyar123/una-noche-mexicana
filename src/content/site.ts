/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  EVERYTHING GUESTS SEE IS EDITED HERE.                            ║
 * ║  Change a value, save, then rebuild (`npm run build`) and         ║
 * ║  re-upload the `out` folder. While `npm run dev` is running,      ║
 * ║  changes appear instantly at http://localhost:3000.               ║
 * ║                                                                    ║
 * ║  ⚠ This file is published with the site — never put private       ║
 * ║    kitchen notes here. Those live in private/kitchen-notes.md.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
import type { FontThemeId } from "@/lib/font-themes";

export const site = {
  title: "Una Noche Mexicana",
  subtitle: "ערב מקסיקני, טאקוס, דרינקים וחברים",

  /** "YYYY-MM-DD", or null to show "ייקבע בקרוב". */
  date: "2026-11-20" as string | null,
  /** "HH:MM", or null. */
  time: "20:00" as string | null,
  endTime: null as string | null,

  locationName: "בCrib של שפם",
  /** Also used for the Waze / Google Maps buttons. */
  address: 'האר"י 20',
  /** Free text; line breaks are kept. */
  additionalInfo: "קוד כניסה - 1948\nקומה 2",

  /** Optional photo inside the arch on desktop: put a file in /public and write e.g. "/photos/hero.jpg". */
  heroImage: null as string | null,

  /**
   * Your WhatsApp number in international format, digits only
   * (e.g. Israeli 050-123-4567 → "972501234567").
   * Leave empty and guests choose who to send the RSVP to in WhatsApp.
   */
  hostWhatsApp: "972506417326",

  /** false = the RSVP form is replaced by a "registration closed" note. */
  rsvpOpen: true,

  /** "classic" | "chef" | "modern" | "editorial" | "cantina" | "noto" — see README. */
  fontTheme: "cantina" as FontThemeId,
};

export type MenuDish = {
  name: string;
  /** Short, appetizing — no ingredient lists. */
  description?: string;
  /** "/sketches/<name>.svg" (built-in drawings) or a file you put in /public, e.g. "/photos/fish.jpg". */
  image?: string;
  vegan?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
  glutenFree?: boolean;
  /** false hides the dish from guests (it stays here for later). */
  visible?: boolean;
};

export type MenuCategory = {
  name: string;
  /** Decorative Spanish label shown above the name. */
  accent?: string;
  visible?: boolean;
  dishes: MenuDish[];
};

/** Order here = order on the page. */
export const menu: MenuCategory[] = [
  {
    name: "לפתוח את הערב",
    accent: "Para empezar",
    dishes: [
      {
        name: "נאצ'וס וסלסה רוחה",
        description: "פריך, חם, ומוגש ישר לשולחן",
        image: "/sketches/nachos.svg",
        vegan: true,
        vegetarian: true,
      },
    ],
  },
  {
    name: "סלטים לשולחן",
    accent: "Ensaladas",
    dishes: [
      { name: "סלט תירס מקסיקני", description: "בהשראת דוכני הרחוב של מקסיקו", image: "/sketches/corn.svg", vegetarian: true },
      { name: "פיקו דה גאיו", description: "קצוץ טרי, חד ומרענן", image: "/sketches/pico.svg", vegan: true, vegetarian: true },
      { name: "סלט כרוב, מנגו ונענע", description: "פריך, מתקתק ורענן", image: "/sketches/cabbage.svg", vegan: true, vegetarian: true },
    ],
  },
  {
    name: "הטאקוס",
    accent: "Los Tacos",
    dishes: [
      { name: "טאקוס דג בטמפורה", description: "פריך מבחוץ, עסיסי מבפנים", image: "/sketches/fish.svg" },
      { name: "טאקוס אסאדו בבישול ארוך", description: "רך, עשיר ועמוק בטעמים", image: "/sketches/asado.svg" },
    ],
  },
  {
    name: "לצד הטאקוס",
    accent: "Para acompañar",
    dishes: [
      { name: "אבוקדו", description: "מלח, שמן זית", image: "/sketches/avocado.svg", vegan: true, vegetarian: true, visible: false },
      { name: "איולי צ'יפוטלה", description: "עשן עדין וחריפות נעימה", image: "/sketches/aioli.svg", vegetarian: true, spicy: true, visible: false },
    ],
  },
];
