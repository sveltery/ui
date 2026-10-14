export const libraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'];
const names = new RegExp(`\\b(${libraries.join('|')})\\s*[=:]\\s*["']([^"']+)["']`, 'g');

// An icon is named by an <IconPlaceholder> tag or by a flat object literal keyed by library, as in `{ lucide: 'CopyIcon', ... }`.
export const iconNames = source =>
  [...source.matchAll(/<IconPlaceholder\b[^>]*>|\{[^{}]*\}/g)]
    .map(([group]) => ({ group, names: Object.fromEntries([...group.matchAll(names)].map(([, library, name]) => [library, name])) }))
    .filter(({ names }) => Object.keys(names).length);
