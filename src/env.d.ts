import "../.astro/types.d.ts";

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_SITE_DESCRIPTION?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_CONTACT_PHONE_1?: string;
  readonly PUBLIC_CONTACT_PHONE_2?: string;
  readonly PUBLIC_TELEGRAM?: string;
  readonly PUBLIC_VK?: string;
  readonly PUBLIC_YOUTUBE?: string;
  readonly PUBLIC_TELEGRAM_CHANNEL_URL?: string;
  readonly PUBLIC_VK_CHANNEL_URL?: string;
  readonly PUBLIC_YOUTUBE_CHANNEL_URL?: string;
  readonly PUBLIC_RUTUBE_CHANNEL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
