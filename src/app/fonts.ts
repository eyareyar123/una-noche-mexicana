import {
  Assistant,
  Bellefair,
  David_Libre,
  Frank_Ruhl_Libre,
  Fraunces,
  Heebo,
  Noto_Sans_Hebrew,
  Noto_Serif_Hebrew,
  Rubik,
  Suez_One,
} from "next/font/google";

/*
 * All fonts are self-hosted by next/font. `preload: false` means the browser
 * only downloads the files of the pairing that is actually in use.
 */

const assistant = Assistant({ variable: "--font-assistant", subsets: ["hebrew", "latin"], display: "swap", preload: false });
const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: false,
});
const bellefair = Bellefair({ variable: "--font-bellefair", subsets: ["hebrew", "latin"], weight: "400", display: "swap", preload: false });
const heebo = Heebo({ variable: "--font-heebo", subsets: ["hebrew", "latin"], display: "swap", preload: false });
const david = David_Libre({
  variable: "--font-david",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});
const rubik = Rubik({ variable: "--font-rubik", subsets: ["hebrew", "latin"], display: "swap", preload: false });
const suez = Suez_One({ variable: "--font-suez", subsets: ["hebrew", "latin"], weight: "400", display: "swap", preload: false });
const notoSerif = Noto_Serif_Hebrew({ variable: "--font-noto-serif", subsets: ["hebrew", "latin"], display: "swap", preload: false });
const notoSans = Noto_Sans_Hebrew({ variable: "--font-noto-sans", subsets: ["hebrew", "latin"], display: "swap", preload: false });

/** Latin display face, used only for the Spanish accents. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

export const fontVariables = [assistant, frank, bellefair, heebo, david, rubik, suez, notoSerif, notoSans, fraunces]
  .map((f) => f.variable)
  .join(" ");
