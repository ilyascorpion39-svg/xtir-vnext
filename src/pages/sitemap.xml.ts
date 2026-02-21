import type { APIRoute } from "astro";
import { SITE } from "@/site";
import { PRODUCTS } from "@/data/products";
import { partners } from "@/data/partners";

const staticRoutes = [
  "/",
  "/products/",
  "/docs/",
  "/gallery/",
  "/partners/",
  "/about/",
  "/contact/",
  "/faq/",
  "/news/",
  "/support/",
  "/technologies/",
  "/terms/",
  "/privacy/",
  "/warranty/",
  "/certificates/",
  "/careers/",
];

const productRoutes = PRODUCTS.map((p) => `/products/${p.slug}/`);

const partnerRoutes = [
  "/partners/reb-zont/",
  ...partners
    .map((p) => p.slug)
    .filter((slug) => slug && slug !== "reb-zont")
    .map((slug) => `/partners/${slug}/`),
];

const SITE_ORIGIN = (import.meta.env.SITE as string | undefined) ?? SITE.websiteUrl;
const toUrl = (path: string) => new URL(path, SITE_ORIGIN).toString();

const urls = [...staticRoutes, ...productRoutes, ...partnerRoutes].map(toUrl);

const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n") +
  `\n</urlset>\n`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
