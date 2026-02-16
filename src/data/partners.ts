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
};

/**
 * Партнёры XTIR.
 *
 * Важно: сейчас здесь стоит один пример, чтобы было понятно, как заполнять.
 * Как только дадите материалы партнёров (названия, описания, ссылки, логотипы),
 * мы заменим пример на реальные записи.
 */
export const partners: Partner[] = [
  {
    slug: 'example-partner',
    name: 'Партнёр (пример)',
    tagline: 'Шаблон карточки партнёра — заменим на реальные данные.',
    description:
      'Это пример записи партнёра. Дайте материалы партнёров (логотип, описание, ссылки) — я заполню и оформлю красиво, в едином премиум-стиле XTIR.',
    logoSrc: '/images/products/placeholder.svg',
    websiteUrl: '',
    location: '',
    links: [],
    featured: false,
  },
];
