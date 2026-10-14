<script lang="ts">
  import { Toast } from '@sveltery/base/toast';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  import type { ToastClassNames, ToastData, ToastPosition } from './types.js';
  let { position, richColors, closeButton, closeButtonAriaLabel, classNames }: { position: ToastPosition; richColors: boolean; closeButton: boolean; closeButtonAriaLabel: string; classNames: ToastClassNames | undefined } = $props();
  const manager = Toast.getToastManager();

  const vertical = $derived(position.startsWith('top') ? 'top' : 'bottom');
  const swipeDirection = $derived.by(() => {
    const [, side] = position.split('-');
    return [vertical === 'top' ? 'up' : 'down', ...(side === 'center' ? ['left', 'right'] : [side])] as ('up' | 'down' | 'left' | 'right')[];
  });
  const placement = {
    top: '[--dir:1] top-0 origin-top after:bottom-full',
    bottom: '[--dir:-1] bottom-0 origin-bottom after:top-full'
  };

  const rich: Record<string, string> = {
    success: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400',
    info: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400',
    warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400',
    error: 'border-destructive/30 bg-[color:color-mix(in_oklab,var(--destructive)_10%,var(--popover))] text-destructive'
  };

  const part = (key: keyof ToastClassNames, own: ToastClassNames | undefined, ...base: string[]) => cn(base, classNames?.[key], own?.[key]);
</script>
{#each manager.toasts as toast (toast.id)}
  {const data = (toast.data ?? {}) as ToastData}
  {const own = data.classNames}
  {const custom = data.custom}
  {const tinted = (data.richColors ?? richColors) && toast.type !== undefined && toast.type in rich}
  {const dismissible = !custom && toast.type !== 'loading' && (data.closeButton ?? closeButton)}
  <Toast.Root
    {toast}
    {swipeDirection}
    data-slot="toast"
    data-rich-colors={tinted ? '' : undefined}
    class={cn(
      'group/toast pointer-events-auto absolute right-0 z-[calc(1000-var(--toast-index))] w-full will-change-transform outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
      placement[vertical],
      !custom && 'cn-toast border bg-popover text-popover-foreground shadow-lg focus-visible:border-ring',
      tinted && rich[toast.type!],
      '[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--dir)*(var(--toast-offset-y)+var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]',
      'h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+var(--dir)*(var(--toast-index)*var(--peek)+var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]',
      "after:absolute after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
      'data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
      'data-limited:opacity-0 data-starting-style:[transform:translateY(calc(var(--dir)*-150%))]',
      '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(calc(var(--dir)*-150%))]',
      'data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
      'data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
      'data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
      'data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
      'data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
      'data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
      'data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
      'data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
      part('toast', own),
      data.className
    )}
  >
    <Toast.Content data-slot="toast-content" class={part('content', own, 'h-full transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100', custom ? '' : 'flex items-center gap-3 overflow-hidden p-4')}>
      {#if custom}
        {@render custom(toast.id)}
      {:else}
        {#if toast.type === 'success'}
          <IconPlaceholder lucide="CircleCheckIcon" tabler="IconCircleCheck" hugeicons="CheckmarkCircle02Icon" phosphor="CheckCircleIcon" remixicon="RiCheckboxCircleLine" data-slot="toast-icon" aria-hidden="true" class={part('icon', own, 'size-4 shrink-0')} />
        {:else if toast.type === 'info'}
          <IconPlaceholder lucide="InfoIcon" tabler="IconInfoCircle" hugeicons="InformationCircleIcon" phosphor="InfoIcon" remixicon="RiInformationLine" data-slot="toast-icon" aria-hidden="true" class={part('icon', own, 'size-4 shrink-0')} />
        {:else if toast.type === 'warning'}
          <IconPlaceholder lucide="TriangleAlertIcon" tabler="IconAlertTriangle" hugeicons="Alert02Icon" phosphor="WarningIcon" remixicon="RiErrorWarningLine" data-slot="toast-icon" aria-hidden="true" class={part('icon', own, 'size-4 shrink-0')} />
        {:else if toast.type === 'error'}
          <IconPlaceholder lucide="OctagonXIcon" tabler="IconAlertOctagon" hugeicons="MultiplicationSignCircleIcon" phosphor="XCircleIcon" remixicon="RiCloseCircleLine" data-slot="toast-icon" aria-hidden="true" class={part('icon', own, 'size-4 shrink-0')} />
        {:else if toast.type === 'loading'}
          <IconPlaceholder lucide="Loader2Icon" tabler="IconLoader" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoaderLine" data-slot="toast-icon" aria-hidden="true" class={part('icon', own, 'size-4 shrink-0 animate-spin')} />
        {/if}
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <Toast.Title data-slot="toast-title" class={part('title', own, 'text-sm font-medium')} />
          <Toast.Description data-slot="toast-description" class={part('description', own, 'text-sm', tinted ? 'text-inherit opacity-80' : 'text-muted-foreground')} />
        </div>
        <Toast.Action data-slot="toast-action" class={cn(buttonVariants({ variant: 'outline', size: 'sm', class: 'shrink-0' }), classNames?.actionButton, own?.actionButton)} />
      {/if}
    </Toast.Content>
    {#if dismissible}
      <Toast.Close data-slot="toast-close" aria-label={closeButtonAriaLabel} class={part('closeButton', own, 'absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full border bg-popover text-popover-foreground opacity-0 transition-opacity outline-none hover:bg-muted focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 group-hover/toast:opacity-100 group-data-expanded/toast:opacity-100')}>
        <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" aria-hidden="true" class="size-3" />
      </Toast.Close>
    {/if}
  </Toast.Root>
{/each}
