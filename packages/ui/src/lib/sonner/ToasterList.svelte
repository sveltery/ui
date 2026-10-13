<script lang="ts">
  import { Toast } from '@sveltery/base/toast';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  const manager = Toast.getToastManager();
</script>
{#each manager.toasts as toast (toast.id)}
  <Toast.Root
    {toast}
    data-slot="toast"
    class={cn(
      'cn-toast group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      '[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]',
      'h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]',
      "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
      'data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
      'data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]',
      '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]',
      'data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
      'data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
      'data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
      'data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
      'data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
      'data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
      'data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
      'data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]'
    )}
  >
    <Toast.Content data-slot="toast-content" class="flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100">
      {#if toast.type === 'success'}
        <IconPlaceholder lucide="CircleCheckIcon" tabler="IconCircleCheck" hugeicons="CheckmarkCircle02Icon" phosphor="CheckCircleIcon" remixicon="RiCheckboxCircleLine" data-slot="toast-icon" aria-hidden="true" class="size-4 shrink-0" />
      {:else if toast.type === 'info'}
        <IconPlaceholder lucide="InfoIcon" tabler="IconInfoCircle" hugeicons="InformationCircleIcon" phosphor="InfoIcon" remixicon="RiInformationLine" data-slot="toast-icon" aria-hidden="true" class="size-4 shrink-0" />
      {:else if toast.type === 'warning'}
        <IconPlaceholder lucide="TriangleAlertIcon" tabler="IconAlertTriangle" hugeicons="Alert02Icon" phosphor="WarningIcon" remixicon="RiErrorWarningLine" data-slot="toast-icon" aria-hidden="true" class="size-4 shrink-0" />
      {:else if toast.type === 'error'}
        <IconPlaceholder lucide="OctagonXIcon" tabler="IconAlertOctagon" hugeicons="MultiplicationSignCircleIcon" phosphor="XCircleIcon" remixicon="RiCloseCircleLine" data-slot="toast-icon" aria-hidden="true" class="size-4 shrink-0" />
      {:else if toast.type === 'loading'}
        <IconPlaceholder lucide="Loader2Icon" tabler="IconLoader" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoaderLine" data-slot="toast-icon" aria-hidden="true" class="size-4 shrink-0 animate-spin" />
      {/if}
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <Toast.Title data-slot="toast-title" class="text-sm font-medium" />
        <Toast.Description data-slot="toast-description" class="text-sm text-muted-foreground" />
      </div>
      <Toast.Action data-slot="toast-action" class={buttonVariants({ variant: 'outline', size: 'sm', class: 'shrink-0' })} />
    </Toast.Content>
  </Toast.Root>
{/each}
