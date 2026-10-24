import type { HTMLAttributes } from 'svelte/elements';
export { default as InputOTP } from './InputOTP.svelte';
export { default as InputOTPGroup } from './InputOTPGroup.svelte';
export { default as InputOTPSlot } from './InputOTPSlot.svelte';
export { default as InputOTPSeparator } from './InputOTPSeparator.svelte';
export type { InputOTPRootProps as InputOTPProps } from '@sveltery/base/input-otp';
export type InputOTPSlotProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { index: number };
