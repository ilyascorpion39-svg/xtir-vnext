import { motion } from 'framer-motion';
import type { Product } from '@/data/products';
import clsx from 'clsx';

type Props = {
  product: Product;
  categoryName?: string;
};

type Tone = 'cold' | 'warm' | 'neutral';

const toneByCategory: Record<string, Tone> = {
  // Холодный техно-акцент (электроника / системы)
  electronic: 'cold',
  systems: 'cold',

  // Тёплый «металл и механика»
  moving: 'warm',
  lifters: 'warm',
  turners: 'warm',
  lift_turn: 'warm',
  ceiling_wall: 'warm',
  hanging: 'warm',

  // Нейтральный графит
  accessories: 'neutral',
  misc: 'neutral',
  texts: 'neutral',
};

const toneMeta: Record<
  Tone,
  {
    accent: string; // HEX
    borderHoverClass: string;
    titleHoverClass: string;
    chipShadow: string;
    radial: string;
  }
> = {
  cold: {
    accent: '#00d4ff',
    borderHoverClass: 'hover:border-[#00d4ff]/40',
    titleHoverClass: 'group-hover:text-[#00d4ff]',
    chipShadow: '0 0 16px rgba(0,212,255,0.22)',
    radial:
      'radial-gradient(90% 70% at 100% 0%, rgba(0,212,255,0.24) 0%, rgba(0,212,255,0) 60%)',
  },
  warm: {
    accent: '#ff6b35',
    borderHoverClass: 'hover:border-secondary-500/45',
    titleHoverClass: 'group-hover:text-secondary-400',
    chipShadow: '0 0 16px rgba(255,107,53,0.20)',
    radial:
      'radial-gradient(85% 70% at 0% 100%, rgba(255,107,53,0.22) 0%, rgba(255,107,53,0) 60%)',
  },
  neutral: {
    accent: '#00ff41',
    borderHoverClass: 'hover:border-primary-500/40',
    titleHoverClass: 'group-hover:text-primary-400',
    chipShadow: '0 0 16px rgba(0,255,65,0.18)',
    radial:
      'radial-gradient(90% 70% at 100% 100%, rgba(0,255,65,0.18) 0%, rgba(0,255,65,0) 60%)',
  },
};

function getTone(categoryId: string | undefined): Tone {
  if (!categoryId) return 'neutral';
  return toneByCategory[categoryId] ?? 'neutral';
}

export default function ProductCard({ product, categoryName }: Props) {
  const img = product.images?.[0] ?? '/images/products/placeholder.svg';
  const tone = getTone(product.category);
  const meta = toneMeta[tone];

  // Едва заметные «технические» диагональные линии — строго, без UI/киберпанка
  const techLines =
    'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 10px)';

  return (
    <motion.a
      href={`/products/${product.id}`}
      className={clsx(
        'group block h-full overflow-hidden rounded-2xl',
        'bg-white/5 backdrop-blur-md',
        'border border-dark-700/60',
        'transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/45',
        meta.borderHoverClass
      )}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
    >
      <div className="relative aspect-[16/9] bg-dark-900/70 overflow-hidden">
        {/* Фоновая «характерная» подсветка категории */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `${meta.radial}, ${techLines}`,
          }}
        />

        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-[1.03]"
        />

        {/* Премиум-затемнение снизу под текст */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/85 via-dark-900/35 to-transparent" />

        {/* Микро-акцент в углу (ощущение инженерной точности) */}
        <div
          className="absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: meta.accent }}
        />

        <div
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-dark-900/80 border border-dark-700 px-3 py-1 text-xs text-gray-200"
          style={{ boxShadow: meta.chipShadow }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: meta.accent,
              boxShadow: `0 0 18px ${meta.accent}55`,
            }}
          />
          {categoryName ?? 'Категория'}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className={clsx(
                'text-xl font-bold text-white transition-colors',
                meta.titleHoverClass
              )}
            >
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-gray-400 line-clamp-2">
              {product.shortDescription}
            </p>
          </div>
          <div className="shrink-0 text-gray-500 group-hover:text-white/90 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {!!product.features?.length && (
          <ul className="mt-5 space-y-1.5">
            {product.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <span
                  className="mt-1 inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: meta.accent, opacity: 0.75 }}
                />
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="text-xs text-gray-500">
            {product.price ? `Цена: ${product.price}` : 'Цена по запросу'}
          </span>
          <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">
            Подробнее
          </span>
        </div>
      </div>
    </motion.a>
  );
}
