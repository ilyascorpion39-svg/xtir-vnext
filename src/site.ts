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

	// Важно: по требованию проекта весь контент (фото/доки/видео)
	// должен быть доступен прямо на сайте, без внешних облаков и без обязательной загрузки.
	// Для посетителей это оформлено как "Галерея".
  partnersHubUrl: string;
	galleryUrl: string;
};

export const SITE: SiteConfig = {
  name: 'XTIR',
  tagline: 'Точность технологий',
  description:
    'Разработка и производство электронно‑механического оборудования для стрельбы. Современные решения для профессиональной подготовки.',
  locale: 'ru-RU',

  websiteUrl: 'https://x-tir.ru',

  contactEmail: 'info@xtir.ru',
  phonePrimary: '+7 (915) 425-00-95',
  phoneSecondary: '+7 (916) 296-24-69',

  telegramChannelUrl: 'https://t.me/xtirofficial',
  vkChannelUrl: 'https://vk.com/xtirofficial',
  youtubeChannelUrl: 'https://www.youtube.com/@XTIRofficial',
  rutubeChannelUrl: 'https://rutube.ru/channel/61475514/',

  orderCtaText: 'Заказать',
  orderCtaHref: '/contact',

  partnersHubUrl: '/partners',
	galleryUrl: '/gallery',
};
