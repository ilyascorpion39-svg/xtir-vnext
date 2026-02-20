import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/data/products";
import ProductCard from "./ProductCard";

const categoryOrder = [
  "Электронные мишенные системы",
  "Попперы и механические мишени",
  "Специальные комплексы",
];

export default function ProductCatalog() {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery]   = useState<string>("");

  const catNameById = useMemo(() => {
    const m = new Map<string, string>();
    PRODUCT_CATEGORIES.forEach((c) => m.set(c.id, c.name));
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const okCat = active === "all" || p.categoryId === active;
      if (!okCat) return false;
      if (!q) return true;
      return `${p.name} ${p.description}`.toLowerCase().includes(q);
    });
  }, [active, query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof PRODUCTS>();
    filtered.forEach((product) => {
      const key = product.category || "Без категории";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(product);
    });
    const entries = Array.from(groups.entries());
    const orderIndex = new Map(categoryOrder.map((cat, idx) => [cat, idx]));
    entries.sort(([a], [b]) => {
      const ia = orderIndex.has(a) ? orderIndex.get(a)! : Number.MAX_SAFE_INTEGER;
      const ib = orderIndex.has(b) ? orderIndex.get(b)! : Number.MAX_SAFE_INTEGER;
      if (ia !== ib) return ia - ib;
      return a.localeCompare(b);
    });
    return entries;
  }, [filtered]);

  return (
    <section id="products" className="section pt-8">
      <div className="section-container">

        {/* Заголовок */}
        <div className="mb-8">
          <p className="kicker">Каталог</p>
          <h1 className="section-title">Продукция XTIR</h1>
          <p className="section-subtitle">
            Электронно-механическое оборудование для стрельбы. {PRODUCTS.length} позиций.
          </p>
        </div>

        {/* Фильтры + поиск */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Категории */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActive("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                active === "all"
                  ? "bg-primary-500 text-dark-900"
                  : "border border-white/15 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              Все
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  active === cat.id
                    ? "bg-primary-500 text-dark-900"
                    : "border border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Поиск */}
          <input
            type="search"
            placeholder="Поиск..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-white/15 bg-dark-800 px-4 py-2 text-sm text-white placeholder-white/35 outline-none focus:border-primary-500/60"
          />
        </div>

        <div className="category-nav">
          {categoryOrder.map((cat) => (
            <a key={cat} href={`#cat-${cat}`} className="cat-link">
              {cat}
            </a>
          ))}
        </div>

        {/* Категории + сетки карточек */}
        {filtered.length > 0 ? (
          <div className="space-y-10">
            {grouped.map(([category, products]) => (
              <section key={category} id={`cat-${category}`}>
                <h2 className="mb-5 text-2xl font-semibold text-white">{category}</h2>
                <motion.div
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      categoryName={catNameById.get(product.categoryId)}
                    />
                  ))}
                </motion.div>
              </section>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-white/40">
            <p className="text-lg">Ничего не найдено</p>
            <button
              onClick={() => { setActive("all"); setQuery(""); }}
              className="mt-4 text-sm text-primary-500 hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}

        {/* Счётчик */}
        {filtered.length > 0 && (
          <p className="mt-8 text-center text-sm text-white/30">
            Показано {filtered.length} из {PRODUCTS.length}
          </p>
        )}
      </div>
      <style>{`
        html { scroll-behavior: smooth; }
        .category-nav {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .cat-link {
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          padding: 8px 14px;
          color: rgba(255, 255, 255, 0.8);
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .cat-link:hover {
          border-color: rgba(255, 255, 255, 0.35);
          background-color: rgba(255, 255, 255, 0.06);
          color: #fff;
        }
      `}</style>
    </section>
  );
}
