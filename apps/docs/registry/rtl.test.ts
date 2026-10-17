// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readRegistryInput } from './read';
import { renderSource, rtlSource } from './rtl';
import { analyzeSource } from './source';
import { parseStyleSheet } from './styles';

const input = readRegistryInput(new URL('../../../', import.meta.url).pathname, 'https://ui.sveltery.dev');
const render = (path: string, rtl: boolean) => renderSource(analyzeSource(path, input.sources[path]!), parseStyleSheet(input.styles.nova, 'nova'), 'nova', rtl);

describe('renderSource', () => {
  it('maps the classes a style inlines, as upstream builds ui-rtl from the styled ui', () => {
    expect(render('accordion/AccordionTrigger.svelte', false)).toContain(' text-left ');
    const rtl = render('accordion/AccordionTrigger.svelte', true);
    expect(rtl).toContain(' text-start ');
    expect(rtl).toContain('**:data-[slot=accordion-trigger-icon]:ms-auto');
    expect(rtl).not.toContain('text-left');
  });

  it('maps the class of merged props, which a style inlines', () => {
    expect(render('sidebar/SidebarMenuAction.svelte', false)).toMatch(/\bright-1\b/);
    const rtl = render('sidebar/SidebarMenuAction.svelte', true);
    expect(rtl).toMatch(/\bend-1\b/);
    expect(rtl).not.toMatch(/\bright-1\b/);
  });

  it('flips the icons marked cn-rtl-flip', () => {
    expect(render('breadcrumb/BreadcrumbSeparator.svelte', false)).toContain('class="cn-rtl-flip"');
    expect(render('breadcrumb/BreadcrumbSeparator.svelte', true)).toContain('class="rtl:rotate-180"');
  });
});

describe('rtlSource', () => {
  // It parses every component once per style, which a loaded CI runner takes longer than the default 5 s for.
  it('hands Tailwind every class the RTL render adds', { timeout: 30_000 }, async () => {
    const source = rtlSource(input.sources, input.styles);
    const classes = source.slice('@source inline("'.length, -'");\n'.length).split(' ');
    expect(classes).toEqual(expect.arrayContaining(['text-start', 'rtl:rotate-180', '*:data-slot:rounded-e-none', '[&>[data-slot]~[data-slot]]:border-s-0']));
    await expect(source, 'run `vitest -u`').toMatchFileSnapshot('./styles/rtl.css');
  });
});
