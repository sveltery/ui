<script lang="ts">
  import { InputOTPRoot, type InputOTPRootProps } from '@sveltery/base/input-otp';
  import { cn } from 'cn';
  let { class: classProp, containerClass, value = $bindable(), ...props }: InputOTPRootProps = $props();
</script>
<InputOTPRoot data-slot="input-otp" containerClass={cn('cn-input-otp flex items-center has-disabled:opacity-50', containerClass)} spellcheck={false} class={cn('cn-input-otp-input disabled:cursor-not-allowed', classProp)} {...props} bind:value />
