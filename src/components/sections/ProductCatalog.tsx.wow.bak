import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/data/products';
import ProductCard from './ProductCard';

type Category = { id: string; name: string };

type Props = {
  products: Product[];
  categories: Category[];
};

export default function ProductCatalog({ products, categories }: Props) {
  const [active, setActive] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const okCat = active === 'all' ? true : p.category === active;
      if (!okCat) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.shortDescription} ${p.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, active, query]);

  const catNameById = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  return (
    <div>
      <div className="card card-glass p-6 border border-dark-700/60">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActive('all')}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                active === 'all'
                  ? 'bg-primary-500/15 border-primary-500/40 text-white'
                  : 'bg-dark-900/40 border-dark-700 text-gray-300 hover:text-white hover:border-primary-500/30'
              }`}
            >
              Все
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                  active === c.id
                    ? 'bg-primary-500/15 border-primary-500/40 text-white'
                    : 'bg-dark-900/40 border-dark-700 text-gray-300 hover:text-white hover:border-primary-500/30'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-[380px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по каталогу…"
              className="w-full px-4 py-3 rounded-xl bg-dark-900/40 border border-dark-700 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50"
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Найдено: <span className="text-white font-semibold">{filtered.length}</span>
        </div>
      </div>

      <motion.div
        className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
      >
        {filtered.map((p) => (
          <motion.div
            key={p.id}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <ProductCard product={p} categoryName={catNameById.get(p.category)} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
