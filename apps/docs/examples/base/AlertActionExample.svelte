<script lang="ts">
  import { Alert, AlertAction, AlertDescription, AlertTitle } from '$registry/bases/base/ui/alert';
  import { Button } from '$registry/bases/base/ui/button';
</script>

<Alert class="max-w-md">
  <AlertTitle>Dark mode is now available</AlertTitle>
  <AlertDescription>Enable it under your profile settings to get started.</AlertDescription>
  <AlertAction>
    <Button size="xs" variant="default">Enable</Button>
  </AlertAction>
</Alert>
