import type { ComponentProps } from 'svelte';
import { createAttachmentKey } from 'svelte/attachments';
import { IconPlaceholder, IconLibraryProvider, iconLibraries, type IconLibraryName, type IconPlaceholderProps, type IconLibraryProviderProps } from '../apps/docs/registry/bases/base/ui/icons/index.js';
import { IconPlaceholder as RootIcon } from '../apps/docs/registry/bases/base/ui/index.js';

const names = { lucide: 'ArrowLeftIcon', tabler: 'IconArrowLeft', hugeicons: 'ArrowLeft01Icon', phosphor: 'ArrowLeftIcon', remixicon: 'RiArrowLeftLine' };
const library: IconLibraryName = iconLibraries[0];
const provider: IconLibraryProviderProps = { library };
const providerComponent: ComponentProps<typeof IconLibraryProvider> = provider;
const attachment = createAttachmentKey();
const icon: IconPlaceholderProps = { ...names, ref: null, class: ['size-5', { active: true }], style: 'color: red', strokeWidth: 7, 'aria-label': 'Previous', onclick: event => { const svg: SVGSVGElement = event.currentTarget; void svg; }, [attachment]: (svg: SVGSVGElement) => { svg.dataset.attached = 'yes'; return () => {}; } };
const iconComponent: ComponentProps<typeof IconPlaceholder> = icon;
const rootComponent: ComponentProps<typeof RootIcon> = icon;
// The source requires each library key; selected empty names remain valid strings.
const emptyNames: IconPlaceholderProps = { ...names, lucide: '' };
// @ts-expect-error the five source-selected names are required
const missingNames: IconPlaceholderProps = { lucide: 'ArrowLeftIcon' };
// @ts-expect-error the resolved provider supports only the five pinned libraries
const unknownLibrary: IconLibraryProviderProps = { library: 'custom' };
// @ts-expect-error Svelte native styles use strings rather than React CSS objects
const objectStyle: IconPlaceholderProps = { ...names, style: { color: 'red' } };
// @ts-expect-error native placeholder does not expose package-only Phosphor weight
const packageExtra: IconPlaceholderProps = { ...names, weight: 'bold' };
void [providerComponent, iconComponent, rootComponent, emptyNames, missingNames, unknownLibrary, objectStyle, packageExtra];
