<script lang="ts">
  import { OTPField as Primitive, type OTPFieldInputProps } from '@sveltery/base/otp-field';
  import { cn } from 'cn';
  let { class: classProp, ...props }: OTPFieldInputProps = $props();
</script>
<Primitive.Input data-slot="input-otp-slot" {...props} class={cn('cn-input-otp-slot relative flex items-center justify-center text-center focus:z-10 disabled:cursor-not-allowed', classProp)} />
