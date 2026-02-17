import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_NVvpL7-_.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/about.astro.mjs');
const _page1 = () => import('./pages/careers.astro.mjs');
const _page2 = () => import('./pages/certificates.astro.mjs');
const _page3 = () => import('./pages/contact.astro.mjs');
const _page4 = () => import('./pages/docs.astro.mjs');
const _page5 = () => import('./pages/faq.astro.mjs');
const _page6 = () => import('./pages/gallery.astro.mjs');
const _page7 = () => import('./pages/news.astro.mjs');
const _page8 = () => import('./pages/partners/_slug_.astro.mjs');
const _page9 = () => import('./pages/partners.astro.mjs');
const _page10 = () => import('./pages/privacy.astro.mjs');
const _page11 = () => import('./pages/products/_id_.astro.mjs');
const _page12 = () => import('./pages/products.astro.mjs');
const _page13 = () => import('./pages/support.astro.mjs');
const _page14 = () => import('./pages/technologies.astro.mjs');
const _page15 = () => import('./pages/terms.astro.mjs');
const _page16 = () => import('./pages/warranty.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["src/pages/about.astro", _page0],
    ["src/pages/careers.astro", _page1],
    ["src/pages/certificates.astro", _page2],
    ["src/pages/contact.astro", _page3],
    ["src/pages/docs.astro", _page4],
    ["src/pages/faq.astro", _page5],
    ["src/pages/gallery.astro", _page6],
    ["src/pages/news.astro", _page7],
    ["src/pages/partners/[slug].astro", _page8],
    ["src/pages/partners/index.astro", _page9],
    ["src/pages/privacy.astro", _page10],
    ["src/pages/products/[id].astro", _page11],
    ["src/pages/products/index.astro", _page12],
    ["src/pages/support.astro", _page13],
    ["src/pages/technologies.astro", _page14],
    ["src/pages/terms.astro", _page15],
    ["src/pages/warranty.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "dff3d4df-9a14-4c5d-ae31-bc9767897f79"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
