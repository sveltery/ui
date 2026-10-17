<script lang="ts">
  import { cn } from 'cn';
  import type { IconNode } from 'lucide';
  import type { SVGAttributes } from 'svelte/elements';

  // lucide-react's Icon: the default attributes, then the lucide classes, then the caller's props in place.
  let { icon, iconName, class: className, ...rest }: SVGAttributes<SVGSVGElement> & { icon: IconNode; iconName: string } = $props();
  const [, defaults, children = []] = $derived(icon);
</script>

<svg {...{ ...defaults, class: cn('lucide', `lucide-${iconName}`, className), ...rest }}
  >{#each children as [tag, attrs], i (i)}<svelte:element this={tag} {...attrs} />{/each}</svg
>
