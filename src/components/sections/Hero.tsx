export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* subtle tech grid + vignette */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.55]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 -120px 160px rgba(0,0,0,0.55)" }}
      />

      <div className="section-container">
        <div className="pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="mx-auto max-w-4xl">
            {/* status line */}
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-primary-400 shadow-[0_0_18px_rgba(0,179,255,0.35)]" />
              <span className="font-mono text-xs tracking-widest text-white/70">
                XTIR / PLATFORM • STATUS: ACTIVE
              </span>
            </div>

            {/* accent line */}
            <div className="mb-6 h-px w-full max-w-[520px] bg-gradient-accent opacity-70 animate-slide-in" />

            <h1 className="text-shadow animate-fade-in-up">
              <span className="block text-white/95">
                Электронно-механические решения
              </span>
              <span className="mt-2 block bg-gradient-accent bg-clip-text text-transparent">
                для современной стрельбы
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/65 md:text-xl animate-fade-in-up animate-delay-100">
              Разработка и производство оборудования XTIR: надёжность, контроль,
              точность. Всё в одном стиле, без лишнего шума.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-in-up animate-delay-200">
              <a href="/contact" className="btn btn-primary">
                Запросить материалы{" "}
                <span className="ml-1 inline-block text-primary-200">→</span>
              </a>
              <a href="/products" className="btn btn-secondary">
                Смотреть решения
              </a>
            </div>

            {/* quick points */}
            <div className="mt-10 grid gap-3 sm:grid-cols-3 animate-fade-in-up animate-delay-300">
              <div className="card card-hover card-tech">
                <div className="text-sm text-white/70">Форм-фактор</div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Компактно
                </div>
              </div>
              <div className="card card-hover card-tech">
                <div className="text-sm text-white/70">Интеграция</div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Гибко
                </div>
              </div>
              <div className="card card-hover card-tech">
                <div className="text-sm text-white/70">Управление</div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Точно
                </div>
              </div>
            </div>

            <div className="mt-10 divider" />
            <p className="mt-4 text-sm text-white/45">
              Официальный сайт: <span className="text-white/70">x-tir.ru</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
