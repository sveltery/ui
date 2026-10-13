<script lang="ts">
  import { OTPField as Primitive, type OTPFieldRootProps } from '@sveltery/base/otp-field';
  import { cn } from 'cn';
  let { class: classProp, value = $bindable(), ...props }: OTPFieldRootProps = $props();
</script>
<Primitive.Root data-slot="input-otp" spellcheck={false} {...props} class={cn('cn-input-otp flex items-center has-disabled:opacity-50', classProp)} bind:value />
