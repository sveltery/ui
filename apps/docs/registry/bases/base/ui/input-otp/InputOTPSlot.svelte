<script lang="ts">
  import { getOTPInputContext } from '@sveltery/input-otp';
  import { cn } from 'cn';
  import type { InputOTPSlotProps } from './index.js';
  let { index, class: classProp, ...props }: InputOTPSlotProps = $props();
  const context = getOTPInputContext();
  const slot = $derived(context.slots[index]);
</script>
<div data-slot="input-otp-slot" data-active={slot?.isActive} {...props} class={cn('cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10', classProp)}>{slot?.char}{#if slot?.hasFakeCaret}<div class="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center"><div class="cn-input-otp-caret-line"></div></div>{/if}</div>
