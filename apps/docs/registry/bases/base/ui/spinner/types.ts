import type { SVGAttributes } from 'svelte/elements';

type SvgProps = Omit<SVGAttributes<SVGSVGElement>, 'children'>;

/** The SVG attributes without `null`, which the icon libraries' components do not accept. */
export type SpinnerProps = { [Key in keyof SvgProps]?: Exclude<SvgProps[Key], null> };
