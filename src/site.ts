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

type MaybeString = string | undefined;

const trimOrFallback = (value: MaybeString, fallback: string): string => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
};

const trimOptional = (value: MaybeString): string | undefined => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
};

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

export const BASE_URL = (import.meta.env.BASE_URL ?? "/") as string;

const WEBSITE_URL = stripTrailingSlash(
  trimOrFallback(import.meta.env.PUBLIC_SITE_URL, "https://x-tir.ru"),
);
const TELEGRAM_URL = trimOrFallback(
  import.meta.env.PUBLIC_TELEGRAM_CHANNEL_URL ?? import.meta.env.PUBLIC_TELEGRAM,
  "https://t.me/xtirofficial",
);
const VK_URL = trimOrFallback(
  import.meta.env.PUBLIC_VK_CHANNEL_URL ?? import.meta.env.PUBLIC_VK,
  "https://vk.com/xtirofficial",
);
const YOUTUBE_URL = trimOrFallback(
  import.meta.env.PUBLIC_YOUTUBE_CHANNEL_URL ?? import.meta.env.PUBLIC_YOUTUBE,
  "https://youtube.com/@XTIRofficial",
);
const RUTUBE_URL = trimOrFallback(
  import.meta.env.PUBLIC_RUTUBE_CHANNEL_URL,
  "https://rutube.ru/channel/61475514/",
);

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

export function toWebp(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return path.replace(/\.(png|jpe?g)$/i, ".webp");
}

export const SITE: SiteConfig = {
  name: "XTIR",
  tagline: "Точность технологий",
  description: trimOrFallback(
    import.meta.env.PUBLIC_SITE_DESCRIPTION,
    "Разработка и производство электронно-механического оборудования для стрельбы. Современные решения для профессиональной подготовки.",
  ),
  locale: "ru-RU",

  websiteUrl: WEBSITE_URL,
  contactEmail: trimOrFallback(import.meta.env.PUBLIC_CONTACT_EMAIL, "info@xtir.ru"),
  phonePrimary: trimOrFallback(import.meta.env.PUBLIC_CONTACT_PHONE_1, "+7 (915) 425-00-95"),
  phoneSecondary: trimOptional(import.meta.env.PUBLIC_CONTACT_PHONE_2) ?? "+7 (916) 296-24-69",

  telegramChannelUrl: TELEGRAM_URL,
  vkChannelUrl: VK_URL,
  youtubeChannelUrl: YOUTUBE_URL,
  rutubeChannelUrl: RUTUBE_URL,

  orderCtaText: "Обсудить проект",
  orderCtaHref: "/contact/",

  partnersHubUrl: "/partners/",
  galleryUrl: "/gallery/",
};

