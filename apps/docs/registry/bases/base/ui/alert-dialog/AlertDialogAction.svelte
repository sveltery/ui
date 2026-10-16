<script lang="ts">
  import { cn } from 'cn';
  import { Button, type ButtonProps } from '../button/index.js';
  let { children, class: classProp, ...props }: ButtonProps = $props();
</script>
<Button data-slot="alert-dialog-action" {children} {...props} class={cn('cn-alert-dialog-action', classProp)} />
