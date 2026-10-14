import { navCategories } from '#blocks/registry';
import { pages } from '$lib/docs/content.server';
import { site } from '$lib/site';

export const prerender = true;

export function GET() {
  const urls = ['/', ...pages.map((p) => p.href), '/blocks', ...navCategories.map(({ slug }) => `/blocks/${slug}`)].map((href) => `  <url><loc>${site.url}${href}</loc></url>`);
  const body = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n');
  return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
