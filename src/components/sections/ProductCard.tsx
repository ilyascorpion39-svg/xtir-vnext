import type { Product } from "@/data/products";
import clsx from "clsx";
import { toWebp, withBase } from "@/site";
import { deriveProductSpecs } from "@/utils/productSpecs";

type Props = {
  product: Product;
  categoryName?: string;
};

type Tone = "cold" | "warm" | "neutral";

const toneByCategory: Record<string, Tone> = {
  electronic: "cold",
  polygon:    "cold",
  moving:     "warm",
  lifters:    "warm",
  rotators:   "warm",
  combo:      "warm",
  ceiling:    "neutral",
  suspended:  "neutral",
};

const toneMeta: Record<Tone, {
  accent: string;
  borderHoverClass: string;
  titleHoverClass: string;
  radial: string;
}> = {
  cold: {
    accent: "#00d4ff",
    borderHoverClass: "hover:border-[#00d4ff]/40",
    titleHoverClass: "group-hover:text-[#00d4ff]",
    radial: "radial-gradient(90% 70% at 100% 0%, rgba(0,212,255,0.24) 0%, rgba(0,212,255,0) 60%)",
  },
  warm: {
    accent: "#ff6b35",
    borderHoverClass: "hover:border-orange-500/45",
    titleHoverClass: "group-hover:text-orange-400",
    radial: "radial-gradient(85% 70% at 0% 100%, rgba(255,107,53,0.22) 0%, rgba(255,107,53,0) 60%)",
  },
  neutral: {
    accent: "#00B3FF",
    borderHoverClass: "hover:border-primary-500/40",
    titleHoverClass: "group-hover:text-primary-300",
    radial: "radial-gradient(90% 70% at 100% 100%, rgba(0,179,255,0.18) 0%, rgba(0,179,255,0) 60%)",
  },
};

const techLines =
  "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 10px)";

const excerpt = (text: string, max = 120) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/[,.!?;:\s]+$/g, "")}…`;
};

export default function ProductCard({ product, categoryName }: Props) {
  const img = product.photos?.[0]
    ? withBase(product.photos[0])
    : withBase("/images/placeholder.svg");
  const webpImg = toWebp(img);

  const tone = toneByCategory[product.categoryId] ?? "neutral";
  const meta = toneMeta[tone];

  const shortDesc = excerpt(product.description, 132);
  const specPreview = deriveProductSpecs(product, 2);
  const featurePreview = product.features.slice(0, 2);

  return (
    <a
      href={withBase(`/products/${product.slug}/`)}
      className={clsx(
        "group xtir-card xtir-card--hover flex h-full flex-col overflow-hidden",
        meta.borderHoverClass,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-dark-900/70">
        <div
          className="absolute inset-0 opacity-70"
          style={{ backgroundImage: `${meta.radial}, ${techLines}` }}
        />
        <picture>
          <source srcSet={webpImg} type="image/webp" />
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1536px) 22vw, (min-width: 1280px) 30vw, (min-width: 768px) 45vw, 95vw"
            className="absolute inset-0 h-full w-full object-cover opacity-90 [transition:transform_0.35s_ease] group-hover:opacity-100 group-hover:scale-[1.04]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/85 via-dark-900/35 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-dark-900/80 px-3 py-1 text-xs text-white/85">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: meta.accent, boxShadow: `0 0 18px ${meta.accent}55` }}
          />
          {categoryName ?? product.categoryId}
        </div>
      </div>
      <div className="flex h-full flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={clsx("text-[1.16rem] font-bold leading-tight text-white transition-colors [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] [letter-spacing:0.01em]", meta.titleHoverClass)}>
              {product.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/78">{shortDesc}</p>
          </div>
          <div className="shrink-0 text-white/35 transition-colors group-hover:text-white/80">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        {specPreview.length > 0 ? (
          <div className="mt-5">
            <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-white/45">Ключевые характеристики</div>
            <dl className="grid gap-2 text-sm">
            {specPreview.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-1.5">
                <dt className="text-white/58">{s.label}</dt>
                <dd className="text-right text-white/88">{s.value}</dd>
              </div>
            ))}
            </dl>
          </div>
        ) : featurePreview.length > 0 ? (
          <ul className="mt-5 space-y-1.5">
            {featurePreview.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: meta.accent }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className="text-xs text-white/45">Цена по запросу</span>
          <span className="xtir-btn xtir-btn--secondary min-h-0 px-3 py-1.5 text-xs">
            Подробнее
          </span>
        </div>
      </div>
    </a>
  );
}
