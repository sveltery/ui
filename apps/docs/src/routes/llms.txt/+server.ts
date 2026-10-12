import { nav, pages } from '$lib/docs/content.server';
import { site } from '$lib/site';

export const prerender = true;

export function GET() {
  const sections = nav.map((section) => {
    const links = pages.filter((p) => p.href === section.href || section.pages.includes(p));
    return [`## ${section.title}`, '', ...links.map((p) => `- [${p.title}](${site.url}${p.href})${p.description ? `: ${p.description}` : ''}`)].join('\n');
  });
  const body = [`# ${site.name}`, '', `> ${site.description}`, '', ...sections.flatMap((section) => [section, ''])].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
