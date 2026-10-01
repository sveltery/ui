<script lang="ts">
  // Native shadcn Textarea/Nova contract; see tests/reference/textarea-sources.json.
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { classes } from '../dialog/classes.js';
  let { class: classProp, ref = $bindable(null), defaultValue, defaultvalue, value = $bindable(defaultValue ?? defaultvalue), ...props }: Omit<HTMLTextareaAttributes, 'children'> & { ref?: HTMLTextAreaElement | null } = $props();
  // HTML parsing strips one initial newline; React's native textarea SSR compensates.
  // Apply that compensation only to serialized binding values, preserving client edits.
  function nativeValue() {
    return typeof window === 'undefined' && String(value ?? '').startsWith('\n') ? `\n${value}` : value;
  }
</script>
<textarea data-slot="textarea" {...props} class={classes('cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', classProp)} defaultValue={defaultValue ?? defaultvalue} bind:this={ref} bind:value={nativeValue, (next) => { value = next; }}></textarea>
