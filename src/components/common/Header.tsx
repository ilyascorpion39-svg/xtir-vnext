import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/site";

// Читаем base из мета-тега, который Astro вставляет автоматически
// На GitHub Pages это будет "/xtir-vnext", локально — ""
const getBase = () => {
  if (typeof document === "undefined") return "";
  const base = document.querySelector('base')?.getAttribute('href') ?? "";
  return base.replace(/\/$/, "");
};

const makeHref = (path: string) => {
  const base = getBase();
  return base + path;
};

const navItems = [
  { name: 'Главная', href: '/' },
  { name: 'Продукты', href: '/products' },
  { name: 'Технологии', href: '/technologies' },
  { name: 'Галерея', href: '/gallery' },
  { name: 'Партнёры', href: '/partners' },
  { name: 'О компании', href: '/about' },
  { name: 'Поддержка', href: '/support' },
  { name: 'Контакты', href: '/contact' },
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
  const [base, setBase] = useState("");

  useEffect(() => {
    setBase(getBase());

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const href = (path: string) => base + path;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-dark-900/95 backdrop-blur-lg shadow-lg shadow-primary-500/10"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={href("/")} className="flex items-center gap-3">
            <img
              src={`${base}/images/logo.png`}
              srcSet={`${base}/images/logo.png 1x, ${base}/images/xtir-logo@2x.png 2x`}
              width={140}
              height={48}
              alt="XTIR"
              decoding="async"
              className="h-12 w-auto"
            />
            <div className="leading-tight">
              <div className="text-xs text-white/55">Точность технологий</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={href(item.href)}
                className="text-gray-300 hover:text-primary-500 font-medium transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          {/* Actions (social + CTA) */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center hover:border-primary-500 hover:bg-dark-700 transition-all group"
                  aria-label={s.name}
                  title={s.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={s.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>

            <motion.a
              href={href("/contact")}
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Заказать
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1.5 group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-dark-900/98 backdrop-blur-xl border-t border-primary-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="section-container py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={href(item.href)}
                  className="block py-3 text-lg text-gray-300 hover:text-primary-500 transition-colors border-b border-dark-700 last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
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
                      className="w-11 h-11 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center hover:border-primary-500 hover:bg-dark-700 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={s.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
                <a href={href("/contact")} className="block w-full btn btn-primary text-center">
                  Заказать
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
