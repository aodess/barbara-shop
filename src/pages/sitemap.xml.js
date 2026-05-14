import content from '../data/content.json';
import { LOCALES, FALLBACK_LOCALE } from '../lib/i18n.js';

export async function GET() {
  const siteUrl = (content.seo.siteUrl || '').replace(/\/$/, '');
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = LOCALES.map(lang => {
    const alternates = LOCALES.map(l =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl}/${l}/"/>`
    ).join('\n');
    return `  <url>
    <loc>${siteUrl}/${lang}/</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/${FALLBACK_LOCALE}/"/>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  }).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
