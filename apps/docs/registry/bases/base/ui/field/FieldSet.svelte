<script lang="ts">
  import type { HTMLFieldsetAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLFieldsetAttributes = $props();
</script>
<fieldset data-slot="field-set" {...props} class={cn('cn-field-set flex flex-col', classProp)}>
  {@render children?.()}
</fieldset>
