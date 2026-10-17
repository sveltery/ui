<script lang="ts">
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
  import { Alert, AlertDescription, AlertTitle } from '$registry/bases/base/ui/alert';
</script>

<Alert variant="destructive" class="max-w-md">
  <CircleAlertIcon />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>
    Your payment could not be processed. Please check your payment method and try again.
  </AlertDescription>
</Alert>
