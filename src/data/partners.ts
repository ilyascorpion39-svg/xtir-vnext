export type PartnerLink = {
  label: string;
  url: string;
};

export type Partner = {
  /** Уникальный slug для URL: /partners/<slug> */
  slug: string;
  /** Название партнёра */
  name: string;
  /** Коротко (1 строка) */
  tagline: string;
  /** Развёрнутое описание (пара абзацев) */
  description: string;
  /** Логотип (путь внутри /public) */
  logoSrc?: string;
  /** Основной сайт партнёра */
  websiteUrl?: string;
  /** География / город (по желанию) */
  location?: string;
  /** Дополнительные ссылки (каталог, соцсети, сайт партнёра и т.д.) */
  links?: PartnerLink[];
  /** Отмечаем ключевых партнёров (можно вывести наверх списка) */
  featured?: boolean;
  /** Кастомный путь, если страница партнёра сделана отдельным шаблоном */
  pageHref?: string;
};

export const partners: Partner[] = [
  {
    slug: "reb-zont",
    pageHref: "/partners/reb-zont/",
    name: "РЭБ ЗОНТ",
    tagline: "Системы РЭБ для защиты техники и личного состава от БПЛА.",
    description:
      "Российский производитель комплексов радиоэлектронной борьбы. Оборудование применяется в мобильных и стационарных сценариях защиты от БПЛА и прошло профильные испытания.",
    logoSrc: "/images/logo.png",
    location: "Россия",
    links: [
      {
        label: "Каталог продукции",
        url: "/xtir-archive/Партнеры/каталог (2).pdf",
      },
      {
        label: "Итоговый протокол испытаний",
        url: "/xtir-archive/Партнеры/РЭБ_ЗОНТ_ИТОГОВЫЙ_ПРОТОКОЛ_НИИИ_РЭБ_г_ВОРОНЕЖ.pdf",
      },
      {
        label: "Сертификат соответствия",
        url: "/xtir-archive/Партнеры/Сертификат_соответствия_РЭБ_ЗОНТ.pdf",
      },
    ],
    featured: true,
  },
];
