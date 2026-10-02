<script lang="ts">
  // Pinned shadcn Input/Nova; MIT notices and hashes: tests/reference/input-sources.json.
  import { Input as InputPrimitive } from '@sveltery/base/input';
  import type { InputProps as PrimitiveInputProps } from '@sveltery/base/input';
  import { clsx } from 'clsx';
  import { classes } from '../shared/classes.js';
  import type { InputProps } from './types.js';
  let { class: classProp, type, ref = $bindable(), ...props }: InputProps = $props();
  // Native Svelte attributes permit null; the primitive's narrower declarations
  // omit null for style/disabled, but its native host forwards those values unchanged.
  const nativeProps = $derived(props as PrimitiveInputProps);
  // This wrapper always uses the primitive's native input host; render is not public.
  function setRef(node: HTMLElement | null | undefined) { ref = node as HTMLInputElement | null | undefined; }
</script>
<InputPrimitive {type} data-slot="input" class={classes('cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50', clsx(classProp))} {...nativeProps} bind:ref={() => ref, setRef} />
