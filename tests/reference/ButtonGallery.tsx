import { Button } from './button';
const variants = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const;
const sizes = ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const;
export function ButtonGallery() {
  return <section data-gallery data-hydrated="true" className="flex flex-wrap gap-3">
    {variants.flatMap(variant => sizes.map(size => <Button key={`${variant}-${size}`} data-testid={`${variant}-${size}`} variant={variant} size={size} aria-label={`${variant} ${size}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M12 4v16" /></svg>{!size.startsWith('icon') && 'Action'}
    </Button>))}
    <Button data-testid="disabled-style" disabled>Disabled</Button>
    <Button data-testid="invalid-style" aria-invalid>Invalid</Button>
    <Button data-testid="expanded-style" variant="outline" aria-expanded>Expanded</Button>
    <Button data-testid="override-style" className="h-12 rounded-none px-6">Override</Button>
    <Button data-testid="icon-start-style"><svg data-icon="inline-start" aria-hidden="true" viewBox="0 0 24 24" />Start</Button>
  </section>;
}
