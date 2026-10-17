<script lang="ts">
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import InfoIcon from '@lucide/svelte/icons/info';
  import { Alert, AlertDescription, AlertTitle } from '$registry/bases/base/ui/alert';
</script>

<div class="grid w-full max-w-md items-start gap-4">
  <Alert>
    <CircleCheckIcon />
    <AlertTitle>Payment successful</AlertTitle>
    <AlertDescription>
      Your payment of $29.99 has been processed. A receipt has been sent to your email address.
    </AlertDescription>
  </Alert>
  <Alert>
    <InfoIcon />
    <AlertTitle>New feature available</AlertTitle>
    <AlertDescription>
      We've added dark mode support. You can enable it in your account settings.
    </AlertDescription>
  </Alert>
</div>
