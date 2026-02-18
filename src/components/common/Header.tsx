import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/site";

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

const navItems = [
  { name: "Главная", href: "/" },
  { name: "Каталог", href: "/products" },
  { name: "Наше фото", href: "/gallery" },
  { name: "Партнёры", href: "/partners" },
  { name: "О компании", href: "/about" },
  { name: "Контакты", href: "/contact" },
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
].filter((s) => !!s.href && s.href !== "#");

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const href = (path: string) => BASE + path;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-dark/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a
            href={href("/")}
            className="flex items-center gap-3 text-white/90 hover:text-white transition"
            aria-label="XTIR"
          >
            <span className="font-display tracking-wide text-lg">XTIR</span>
            <span className="hidden sm:inline text-white/60 text-sm">
              {SITE.tagline}
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={href(item.href)}
                className="text-sm text-white/70 hover:text-white transition"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
            <a
              href={href(SITE.orderCtaHref)}
              className="ml-2 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-dark hover:opacity-90 transition"
            >
              {SITE.orderCtaText}
            </a>
          </div>

          <motion.button
            className="lg:hidden inline-flex items-center justify-center rounded-xl p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
            aria-label="Меню"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden border-t border-white/10 bg-dark/90 backdrop-blur-md"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={href(item.href)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  {item.name}
                </a>
              ))}

              <div className="pt-2 flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/10 transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.icon} />
                    </svg>
                  </a>
                ))}
                <a
                  href={href(SITE.orderCtaHref)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-auto inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-dark hover:opacity-90 transition"
                >
                  {SITE.orderCtaText}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
