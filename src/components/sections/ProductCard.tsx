import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import clsx from "clsx";
import { withBase } from "@/site";

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

export default function ProductCard({ product, categoryName }: Props) {
  const img = product.photos?.[0]
    ? withBase(product.photos[0])
    : withBase("/images/placeholder.svg");

  const tone = toneByCategory[product.categoryId] ?? "neutral";
  const meta = toneMeta[tone];

  const shortDesc = product.description.length > 120
    ? product.description.slice(0, 120).trimEnd() + "…"
    : product.description;

  return (
    <motion.a
      href={withBase(`/products/${product.slug}/`)}
      className={clsx(
        "group block h-full overflow-hidden rounded-[18px] backdrop-blur-[8px]",
        "[background:linear-gradient(to_top,rgba(0,0,0,0.65),transparent_60%),linear-gradient(180deg,#0f141a_0%,#0b1016_100%)]",
        "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.05)]",
        "border border-[rgba(255,255,255,0.06)]",
        "[transition:transform_0.25s_ease,box-shadow_0.25s_ease,border-color_0.25s_ease]",
        "hover:-translate-y-[6px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] hover:border-[rgba(0,179,255,0.18)]",
      )}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-dark-900/70">
        <div
          className="absolute inset-0 opacity-70"
          style={{ backgroundImage: `${meta.radial}, ${techLines}` }}
        />
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-90 [transition:transform_0.35s_ease] group-hover:opacity-100 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/85 via-dark-900/35 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-dark-900/80 px-3 py-1 text-xs text-white/85">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: meta.accent, boxShadow: `0 0 18px ${meta.accent}55` }}
          />
          {categoryName ?? product.categoryId}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={clsx("text-xl font-bold text-white transition-colors [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] [letter-spacing:0.02em]", meta.titleHoverClass)}>
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-white/75 line-clamp-2">{shortDesc}</p>
          </div>
          <div className="shrink-0 text-white/35 transition-colors group-hover:text-white/80">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        {product.features?.length > 0 && (
          <ul className="mt-5 space-y-1.5">
            {product.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: meta.accent }} />
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="text-xs text-white/40">Цена по запросу</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-all group-hover:text-white group-hover:translate-x-[1px]">
            Подробнее
          </span>
        </div>
      </div>
    </motion.a>
  );
}
