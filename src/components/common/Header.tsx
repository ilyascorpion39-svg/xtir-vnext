import { useState, useEffect } from "react";
import { SITE, withBase } from "@/site";

const navItems = [
  { name: "Главная", href: "/" },
  { name: "Мишенные установки", href: "/products/" },
  { name: "Партнёры", href: "/partners/reb-zont/" },
  { name: "Наше фото", href: "/gallery/" },
  { name: "Документы", href: "/docs/" },
  { name: "О компании", href: "/about/" },
  { name: "Контакты", href: "/contact/" },
];

const socialLinks = [
  {
    name: "Telegram",
    href: SITE.telegramChannelUrl,
    icon: "M13 18.9c-.5.2-1 .1-1.4-.2l-3-2.9-1.7 1.3c-.2.2-.5.2-.7.1-.2-.1-.3-.3-.3-.6V14l7.4-6.8c.2-.1.1-.4-.2-.3L5.5 12 2 10.7c-.4-.1-.6-.4-.6-.8 0-.3.2-.6.6-.8l15.6-6c.3-.1.7 0 .9.3.1.2.1.5 0 .8l-3 14.8c-.1.4-.4.7-.8.8-.1.1-.4.1-.7.1z",
  },
  {
    name: "VK",
    href: SITE.vkChannelUrl,
    icon: "M20.8 7.6c.1-.4 0-.6-.6-.6h-2c-.5 0-.7.2-.9.5 0 0-1 2.5-2.5 4.1-.5.5-.7.6-.9.6-.1 0-.3-.1-.3-.5V7.6c0-.5-.1-.6-.5-.6h-3.1c-.3 0-.5.2-.5.4 0 .4.7.5.8 1.6v2.4c0 .5-.1.6-.3.6-.7 0-2.3-2.5-3.3-5.4-.2-.5-.4-.7-.9-.7h-2c-.6 0-.7.2-.7.5 0 .5.7 3.2 3.2 6.7 1.7 2.4 4 3.7 6.2 3.7 1.3 0 1.4-.2 1.4-.7v-1.6c0-.5.1-.6.5-.6.3 0 .8.1 1.9 1.2 1.3 1.3 1.5 1.9 2.2 1.9h2c.6 0 .9-.2.7-.7-.2-.5-.9-1.2-1.8-2.1-.5-.6-1.2-1.2-1.4-1.5-.3-.4-.2-.5 0-.9 0 0 2.4-3.4 2.6-4.5z",
  },
  {
    name: "YouTube",
    href: SITE.youtubeChannelUrl,
    icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    name: "RuTube",
    href: SITE.rutubeChannelUrl,
    icon: "M8.4 6.7A2 2 0 0 0 6 8.6v6.8a2 2 0 0 0 3 1.7l6.2-3.4a2 2 0 0 0 0-3.4L9 7a2 2 0 0 0-.6-.3z",
  },
].filter((s) => !!s.href);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const mobileMenuId = "xtir-mobile-menu";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const normalize = (value: string) => {
      const cut = value.split("#")[0].split("?")[0];
      const trimmed = cut.replace(/\/+$/, "");
      return trimmed === "" ? "/" : trimmed;
    };
    setCurrentPath(normalize(window.location.pathname));
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-dark-900/90 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.24)]"
          : "bg-dark-900/70 backdrop-blur-lg"
      }`}
    >
      <nav className="xtir-container" aria-label="Основная навигация">
        <div className="flex items-center justify-between h-[74px] md:h-20 gap-4">
          {/* Logo */}
          <a
            href={withBase("/")}
            className="flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 rounded-lg"
          >
            <img
              src={withBase("/images/logo.png")}
              srcSet={`${withBase("/images/logo.png")} 1x, ${withBase("/images/xtir-logo@2x.png")} 2x`}
              width={140}
              height={48}
              alt="XTIR"
              fetchPriority="high"
              decoding="async"
              className="h-12 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-7 xl:gap-8">
            {navItems.map((item) =>
              (() => {
                const href = withBase(item.href);
                const normalizedHref = href.replace(/\/+$/, "") || "/";
                const isActive =
                  currentPath === normalizedHref ||
                  (normalizedHref !== "/" &&
                    currentPath.startsWith(`${normalizedHref}/`));

                return (
                  <a
                    key={item.name}
                    href={href}
                    className={`inline-flex h-20 items-center whitespace-nowrap text-[0.91rem] font-semibold leading-none transition-colors relative group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 rounded-sm ${
                      isActive ? "text-white" : "text-white/80 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                    <span className="absolute bottom-[10px] left-0 h-0.5 w-0 bg-primary-300 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                );
              })(),
            )}
          </div>

          {/* Actions (social + CTA) */}
          <div className="hidden lg:flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl xtir-card xtir-card--hover flex items-center justify-center hover:border-primary-400 transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
                  aria-label={s.name}
                  title={s.name}
                >
                  <svg
                    className="w-5 h-5 text-white/70 group-hover:text-primary-300 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
            <a
              href={withBase("/contact/")}
              className="ml-2 hidden xl:inline-flex xtir-btn xtir-btn--secondary min-h-[40px] px-4 py-2 text-[0.84rem]"
            >
              Обсудить проект
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-11 h-11 flex flex-col items-center justify-center space-y-1.5 group rounded-lg border border-white/10 bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Открыть меню"
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>
        </div>
      </nav>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[3px] overflow-hidden transition-opacity ${
          isScrolled ? "opacity-75" : "opacity-62"
        }`}
      >
        <span
          className="block h-full w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(237,241,251,0.7) 0%, rgba(237,241,251,0.74) 28%, rgba(121,152,220,0.68) 50%, rgba(170,84,94,0.66) 76%, rgba(170,84,94,0.62) 100%)",
          }}
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id={mobileMenuId}
          className="lg:hidden absolute top-full left-0 right-0 bg-dark-900/97 backdrop-blur-xl border-t border-white/12"
        >
          <nav className="xtir-container py-5 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={withBase(item.href)}
                className="block py-3 text-base text-white/82 hover:text-white transition-colors border-b border-white/10 last:border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 rounded-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="w-11 h-11 rounded-xl xtir-card xtir-card--hover flex items-center justify-center hover:border-primary-400 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 text-white/80"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d={s.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
