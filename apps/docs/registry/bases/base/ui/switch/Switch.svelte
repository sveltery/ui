<script lang="ts">
  import { Switch as Primitive } from '@sveltery/base/switch';
  import { cn } from 'cn';
  import type { SwitchProps } from './types.js';
  let { checked = $bindable(), class: classProp, size = 'default', host, ...props }: SwitchProps = $props();
</script>
<Primitive.Root bind:checked {...props} host={{ ...host, 'data-slot': 'switch', 'data-size': size }} class={cn('cn-switch peer group/switch relative inline-flex items-center transition-all outline-none [&>input]:-inset-x-3! [&>input]:-inset-y-2! [&>input]:size-auto! data-disabled:cursor-not-allowed data-disabled:opacity-50', classProp)}>
  <Primitive.Thumb data-slot="switch-thumb" class="cn-switch-thumb pointer-events-none block ring-0 transition-transform" />
</Primitive.Root>
