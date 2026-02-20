export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  locale: string;

  websiteUrl: string;
  contactEmail: string;
  phonePrimary: string;
  phoneSecondary?: string;

  telegramChannelUrl: string;
  vkChannelUrl: string;
  youtubeChannelUrl: string;
  rutubeChannelUrl: string;

  orderCtaText: string;
  orderCtaHref: string;

  partnersHubUrl: string;
  galleryUrl: string;
};

export const BASE_URL = (import.meta.env.BASE_URL ?? "/") as string;

export function withBase(path: string): string {
  if (!path) return BASE_URL;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:") ||
    path.startsWith("#")
  ) {
    return path;
  }

  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}${normalized}`;
}

export const SITE: SiteConfig = {
  name: "XTIR",
  tagline: "Точность технологий",
  description:
    "Разработка и производство электронно-механического оборудования для стрельбы. Современные решения для профессиональной подготовки.",
  locale: "ru-RU",

  websiteUrl: "https://x-tir.ru",
  contactEmail: "info@xtir.ru",
  phonePrimary: "+7 (915) 425-00-95",
  phoneSecondary: "+7 (916) 296-24-69",

  telegramChannelUrl: "https://t.me/xtirofficial",
  vkChannelUrl: "https://vk.com/xtirofficial",
  youtubeChannelUrl: "https://youtube.com/@XTIRofficial",
  rutubeChannelUrl: "https://rutube.ru/channel/61475514/",

  orderCtaText: "Обсудить проект",
  orderCtaHref: "/contact/",

  partnersHubUrl: "/partners",
  galleryUrl: "/gallery",
};

