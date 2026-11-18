import { Star8 } from "./icons";

/** Thin rule — star — thin rule. */
export function Ornament({ className = "", tone = "text-terracotta" }: { className?: string; tone?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${tone} ${className}`} aria-hidden>
      <span className="h-px w-10 bg-current opacity-40 sm:w-16" />
      <span className="size-1.5 rotate-45 bg-current opacity-60" />
      <Star8 size={16} />
      <span className="size-1.5 rotate-45 bg-current opacity-60" />
      <span className="h-px w-10 bg-current opacity-40 sm:w-16" />
    </div>
  );
}

/**
 * A garland of small cut-paper flags strung across the top of the hero.
 * Deliberately restrained: muted tones, low height.
 */
export function Garland({ className = "" }: { className?: string }) {
  const colors = ["#b9d443", "#3fa7a0", "#f4ecdf", "#c0603a", "#1d4f91", "#e8b394", "#5f8f5a", "#f4ecdf"];
  const count = 22;
  const w = 1200;
  const step = w / count;
  return (
    <svg
      viewBox={`0 0 ${w} 64`}
      preserveAspectRatio="none"
      className={`h-10 w-full sm:h-14 ${className}`}
      aria-hidden
    >
      <path d={`M0 8 Q ${w / 2} 34 ${w} 8`} fill="none" stroke="#f4ecdf" strokeOpacity=".35" strokeWidth="1" />
      {Array.from({ length: count }).map((_, i) => {
        const x = i * step + step / 2;
        const t = x / w;
        const y = 8 + 4 * 26 * t * (1 - t); // follow the curve
        const fw = step * 0.62;
        const fh = 26;
        const c = colors[i % colors.length];
        return (
          <g key={i} transform={`translate(${x - fw / 2} ${y})`} opacity={0.82}>
            <path
              d={`M0 0 H${fw} V${fh - 6} L${fw * 0.75} ${fh} L${fw / 2} ${fh - 6} L${fw * 0.25} ${fh} L0 ${fh - 6} Z`}
              fill={c}
              fillOpacity={c === "#f4ecdf" ? 0.55 : 0.75}
            />
            {/* cut-outs */}
            <circle cx={fw / 2} cy={9} r={2.6} fill="#6a1426" opacity=".55" />
            <path d={`M${fw / 2 - 5} 16 L${fw / 2} 12 L${fw / 2 + 5} 16 L${fw / 2} 20 Z`} fill="#6a1426" opacity=".4" />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Arch-shaped editorial frame. Shows the hero photo if one is configured,
 * otherwise a geometric composition in the palette.
 */
export function HeroArch({ image, className = "" }: { image: string | null; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* offset outline arch */}
      <div
        className="absolute inset-0 translate-x-3 translate-y-3 border border-lime/60"
        style={{ borderRadius: "var(--radius-arch)" }}
        aria-hidden
      />
      <div
        className="relative h-full w-full overflow-hidden bg-burgundy-deep shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]"
        style={{ borderRadius: "var(--radius-arch)" }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" fetchPriority="high" />
        ) : (
          <ArchArt />
        )}
      </div>
    </div>
  );
}

function ArchArt() {
  return (
    <svg viewBox="0 0 300 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14365f" />
          <stop offset="0.38" stopColor="#8b2338" />
          <stop offset="0.72" stopColor="#c0603a" />
          <stop offset="1" stopColor="#e8b394" />
        </linearGradient>
        <pattern id="tiles" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#f4ecdf" />
          <path d="M15 3 L18 12 L27 15 L18 18 L15 27 L12 18 L3 15 L12 12 Z" fill="#1d4f91" fillOpacity=".12" stroke="#1d4f91" strokeWidth="1" />
          <circle cx="15" cy="15" r="2.2" fill="#3fa7a0" />
          <path d="M0 0h5L0 5ZM30 0h-5l5 5ZM0 30h5l-5-5ZM30 30h-5l5-5Z" fill="#1d4f91" />
        </pattern>
      </defs>
      <rect width="300" height="400" fill="url(#sky)" />
      {/* setting sun */}
      <circle cx="150" cy="232" r="78" fill="#f4ecdf" opacity=".92" />
      <circle cx="150" cy="232" r="96" fill="none" stroke="#f4ecdf" strokeOpacity=".35" />
      <circle cx="150" cy="232" r="116" fill="none" stroke="#f4ecdf" strokeOpacity=".18" />
      {/* agave silhouettes, abstract */}
      <g fill="#1f6f5c">
        <path d="M40 300 C 60 250, 70 230, 72 205 C 78 240, 82 268, 86 300 Z" />
        <path d="M58 300 C 52 262, 30 240, 14 232 C 40 250, 60 270, 70 300 Z" />
        <path d="M70 300 C 92 262, 112 246, 130 240 C 108 258, 92 276, 84 300 Z" />
        <path d="M222 300 C 230 260, 236 240, 238 214 C 246 246, 248 270, 250 300 Z" />
        <path d="M236 300 C 258 268, 276 254, 292 250 C 270 266, 256 282, 252 300 Z" />
        <path d="M232 300 C 222 270, 204 256, 186 252 C 206 266, 220 282, 226 300 Z" />
      </g>
      {/* tiled floor */}
      <rect y="296" width="300" height="104" fill="url(#tiles)" />
      <rect y="296" width="300" height="3" fill="#14365f" opacity=".9" />
      {/* small stars */}
      <g fill="#f4ecdf" opacity=".85">
        <path d="M60 70 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2Z" />
        <path d="M232 104 l1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5 4.5 -1.5Z" />
        <path d="M196 54 l1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2 3.6 -1.2Z" />
      </g>
    </svg>
  );
}

/** Talavera tile strip — cobalt and turquoise on cream. */
export function TalaveraBand({ className = "" }: { className?: string }) {
  return (
    <svg className={`block h-6 w-full ${className}`} aria-hidden>
      <defs>
        <pattern id="talavera-band" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#f4ecdf" />
          <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" fill="#1d4f91" />
          <circle cx="12" cy="12" r="2" fill="#f4ecdf" />
          <path d="M0 0h4L0 4ZM24 0h-4l4 4ZM0 24h4l-4-4ZM24 24h-4l4-4Z" fill="#3fa7a0" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#talavera-band)" />
    </svg>
  );
}

/** Low desert horizon: dusk sky, setting sun, mesas and agaves. */
export function DesertBand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 90" preserveAspectRatio="xMidYMax slice" className={`block h-24 w-full ${className}`} aria-hidden>
      <defs>
        <linearGradient id="desert-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a1426" stopOpacity="0" />
          <stop offset="1" stopColor="#c0603a" stopOpacity=".55" />
        </linearGradient>
      </defs>
      <rect width="400" height="90" fill="url(#desert-sky)" />
      <circle cx="270" cy="70" r="30" fill="#e8b394" opacity=".9" />
      <path d="M0 70 L40 70 L48 52 L92 52 L100 70 L230 70 L240 58 L268 58 L276 70 L400 70 V90 H0Z" fill="#14365f" opacity=".85" />
      <path d="M0 78 Q 100 66 200 76 T 400 74 V90 H0Z" fill="#1f6f5c" />
      <g fill="#154d40">
        <path d="M60 82 C 64 70, 66 64, 67 56 C 70 66, 71 74, 72 82 Z" />
        <path d="M66 82 C 62 72, 54 66, 46 64 C 56 70, 62 76, 64 82 Z" />
        <path d="M70 82 C 76 72, 84 67, 92 65 C 84 71, 77 77, 74 82 Z" />
        <path d="M330 84 C 333 74, 335 68, 336 61 C 339 70, 340 77, 341 84 Z" />
        <path d="M335 84 C 331 75, 324 70, 317 69 C 326 74, 331 79, 333 84 Z" />
        <path d="M339 84 C 344 75, 351 71, 358 70 C 351 75, 345 80, 343 84 Z" />
      </g>
      <g fill="#f4ecdf" opacity=".7">
        <circle cx="40" cy="20" r="1.2" /><circle cx="150" cy="12" r="1" /><circle cx="360" cy="24" r="1.3" />
      </g>
    </svg>
  );
}
