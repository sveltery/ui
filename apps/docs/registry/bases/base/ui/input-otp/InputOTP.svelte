<script lang="ts">
  import { OTPInput, type OTPInputProps } from '@sveltery/input-otp';
  import { cn } from 'cn';
  let { class: classProp, containerClass, value = $bindable(), ref = $bindable(null), ...props }: OTPInputProps = $props();
</script>
<OTPInput data-slot="input-otp" containerClass={cn('cn-input-otp flex items-center has-disabled:opacity-50', containerClass)} spellcheck={false} class={cn('cn-input-otp-input disabled:cursor-not-allowed', classProp)} {...props} bind:value bind:ref />
