<script lang="ts">
  import { Toaster as Sonner, type ToasterProps } from 'svelte-sonner';
  import { IconPlaceholder } from '../icons/index.js';
  let { ...props }: ToasterProps = $props();
</script>

{#snippet successIcon()}
  <IconPlaceholder lucide="CircleCheckIcon" tabler="IconCircleCheck" hugeicons="CheckmarkCircle02Icon" phosphor="CheckCircleIcon" remixicon="RiCheckboxCircleLine" class="size-4" />
{/snippet}
{#snippet infoIcon()}
  <IconPlaceholder lucide="InfoIcon" tabler="IconInfoCircle" hugeicons="InformationCircleIcon" phosphor="InfoIcon" remixicon="RiInformationLine" class="size-4" />
{/snippet}
{#snippet warningIcon()}
  <IconPlaceholder lucide="TriangleAlertIcon" tabler="IconAlertTriangle" hugeicons="Alert02Icon" phosphor="WarningIcon" remixicon="RiErrorWarningLine" class="size-4" />
{/snippet}
{#snippet errorIcon()}
  <IconPlaceholder lucide="OctagonXIcon" tabler="IconAlertOctagon" hugeicons="MultiplicationSignCircleIcon" phosphor="XCircleIcon" remixicon="RiCloseCircleLine" class="size-4" />
{/snippet}
{#snippet loadingIcon()}
  <IconPlaceholder lucide="Loader2Icon" tabler="IconLoader" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoaderLine" class="size-4 animate-spin" />
{/snippet}

<Sonner
  theme="system"
  class="toaster group"
  {successIcon}
  {infoIcon}
  {warningIcon}
  {errorIcon}
  {loadingIcon}
  style="--normal-bg: var(--popover); --normal-text: var(--popover-foreground); --normal-border: var(--border); --border-radius: var(--radius);"
  toastOptions={{ classes: { toast: 'cn-toast' } }}
  {...props}
/>
