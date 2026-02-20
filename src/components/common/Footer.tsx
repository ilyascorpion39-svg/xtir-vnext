import { motion } from "framer-motion";
import { SITE, withBase } from "@/site";

const footerLinks = {
  company: [
    { name: "О компании", href: "/about" },
    { name: "Технологии", href: "/technologies" },
    { name: "Партнёры", href: "/partners" },
    { name: "Карьера", href: "/careers" },
  ],
  products: [
    { name: "Электронные мишени", href: "/products#electronic" },
    { name: "Подъемники", href: "/products#lifters" },
    { name: "Движущиеся цели", href: "/products#moving" },
    { name: "Мишенные системы", href: "/products" },
  ],
  support: [
    { name: "Документация", href: "/docs" },
    { name: "Галерея", href: "/gallery" },
    { name: "FAQ", href: "/faq" },
    { name: "Поддержка", href: "/support" },
    { name: "Гарантия", href: "/warranty" },
  ],
  legal: [
    { name: "Политика конфиденциальности", href: "/privacy" },
    { name: "Условия использования", href: "/terms" },
    { name: "Сертификаты", href: "/certificates" },
  ],
};

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

const categoryNames: Record<string, string> = {
  company: "Компания",
  products: "Продукция",
  support: "Поддержка",
  legal: "Правовая информация",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-white/10">
      {/* Main Footer */}
      <div className="xtir-container py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <a href={withBase("/")} className="inline-flex items-center gap-3 mb-6 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 rounded-lg">
                <img
                  src={withBase("/images/logo.png")}
                  srcSet={`${withBase("/images/logo.png")} 1x, ${withBase("/images/xtir-logo@2x.png")} 2x`}
                  width={140}
                  height={48}
                  alt="XTIR"
                  decoding="async"
                  className="h-10 w-auto"
                />
                <span className="text-xs text-white/60">Точность технологий</span>
              </a>

              <p className="xtir-lead mb-6 max-w-sm">
                Разработка и производство электронно-механического оборудования
                для стрельбы. Современные технологии для профессиональной подготовки.
              </p>

              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a href={withBase("/contact")} className="hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 rounded-sm">
                    info@xtir.ru
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <a href="tel:+79154250095" className="hover:text-white transition-colors block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 rounded-sm">
                      +7 (915) 425-00-95
                    </a>
                    <a href="tel:+79162962469" className="hover:text-white transition-colors block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 rounded-sm">
                      +7 (916) 296-24-69
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-white font-semibold mb-4 text-base">
                {categoryNames[category]}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={withBase(link.href)}
                      className="text-white/65 hover:text-white transition-colors text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 rounded-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl xtir-card flex items-center justify-center hover:border-primary-400 hover:bg-white/10 transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
                  aria-label={social.name}
                  title={social.name}
                >
                  <svg
                    className="w-5 h-5 text-white/70 group-hover:text-primary-300 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>

            <div className="text-sm text-white/55 text-center md:text-right">
              <p>© {currentYear} XTIR. Все права защищены.</p>
              <p className="mt-1">Работаем без выходных</p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
