<script lang="ts">
  // Three selected immutable Alert bodies and genuine Example/icon helpers. See alert-sources.json / MIT notices.
  import { onMount } from 'svelte';
  import { Alert, AlertTitle, AlertDescription } from '@sveltery/ui/alert';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>

{#snippet AlertExample1()}
  <Example title="Basic">
    <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert><AlertTitle>Success! Your changes have been saved.</AlertTitle></Alert>
      <Alert><AlertTitle>Success! Your changes have been saved.</AlertTitle><AlertDescription>This is an alert with title and description.</AlertDescription></Alert>
      <Alert><AlertDescription>This one has a description only. No title. No icon.</AlertDescription></Alert>
    </div>
  </Example>
{/snippet}

{#snippet AlertExample2()}
  <Example title="With Icons">
    <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert><IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        /><AlertTitle>Let&apos;s try one with icon, title and a <!-- svelte-ignore a11y_invalid_attribute -- Preserve the exact immutable original placeholder link. --><a href="#">link</a>.</AlertTitle></Alert>
      <Alert><IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        /><AlertDescription>This one has an icon and a description only. No title. <!-- svelte-ignore a11y_invalid_attribute -- Preserve the exact immutable original placeholder link. --><a href="#">But it has a link</a> and a <!-- svelte-ignore a11y_invalid_attribute -- Preserve the exact immutable original placeholder link. --><a href="#">second link</a>.</AlertDescription></Alert>
      <Alert><IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        /><AlertTitle>Success! Your changes have been saved</AlertTitle><AlertDescription>This is an alert with icon, title and description.</AlertDescription></Alert>
      <Alert><IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        /><AlertTitle>This is a very long alert title that demonstrates how the component handles extended text content and potentially wraps across multiple lines</AlertTitle></Alert>
      <Alert><IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        /><AlertDescription>This is a very long alert description that demonstrates how the component handles extended text content and potentially wraps across multiple lines</AlertDescription></Alert>
      <Alert><IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        /><AlertTitle>This is an extremely long alert title that spans multiple lines to demonstrate how the component handles very lengthy headings while maintaining readability and proper text wrapping behavior</AlertTitle><AlertDescription>This is an equally long description that contains detailed information about the alert. It shows how the component can accommodate extensive content while preserving proper spacing, alignment, and readability across different screen sizes and viewport widths. This helps ensure the user experience remains consistent regardless of the content length.</AlertDescription></Alert>
    </div>
  </Example>
{/snippet}

{#snippet AlertExample3()}
  <Example title="Destructive">
    <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert variant="destructive"><IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        /><AlertTitle>Something went wrong!</AlertTitle><AlertDescription>Your session has expired. Please log in again.</AlertDescription></Alert>
      <Alert variant="destructive"><IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        /><AlertTitle>Unable to process your payment.</AlertTitle><AlertDescription><p>Please verify your <!-- svelte-ignore a11y_invalid_attribute -- Preserve the exact immutable original placeholder link. --><a href="#">billing information</a> and try again.</p><ul class="list-inside list-disc"><li>Check your card details</li><li>Ensure sufficient funds</li><li>Verify billing address</li></ul></AlertDescription></Alert>
    </div>
  </Example>
{/snippet}

<ExampleWrapper class="lg:grid-cols-1" data-alert-gallery="true" data-hydrated={hydrated}>
  {@render AlertExample1()}
  {@render AlertExample2()}
  {@render AlertExample3()}
</ExampleWrapper>
