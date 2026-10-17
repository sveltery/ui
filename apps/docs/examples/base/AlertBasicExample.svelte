<script lang="ts">
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import { Alert, AlertDescription, AlertTitle } from '$registry/bases/base/ui/alert';
</script>

<Alert class="max-w-md">
  <CircleCheckIcon />
  <AlertTitle>Account updated successfully</AlertTitle>
  <AlertDescription>
    Your profile information has been saved. Changes will be reflected immediately.
  </AlertDescription>
</Alert>
