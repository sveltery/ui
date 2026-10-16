<!-- Port of shadcn's apps/v4/app/(app)/(create)/components/picker.tsx and lock-button.tsx at af983e8. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Menu } from '@sveltery/base/menu';
  import { cn } from 'cn';
  import type { DesignField } from './config';
  import { getDesigner } from './designer.svelte';
  import IconSvg from './IconSvg.svelte';
  import { PICKER_ICONS } from './options';

  let {
    label,
    display,
    field,
    mobile,
    anchor,
    disabled = false,
    class: className,
    icon,
    children,
  }: {
    label: string;
    display: string;
    /** The field the lock button holds still during Shuffle. */
    field: DesignField;
    mobile: boolean;
    /** On phones every menu opens above the customizer card. */
    anchor: HTMLElement | undefined;
    disabled?: boolean;
    class?: string;
    icon: Snippet;
    children: Snippet;
  } = $props();

  const designer = getDesigner();
  const locked = $derived(designer.locks.has(field));
</script>

<div class="group/picker relative">
  <Menu.Root
    onOpenChange={(open) => {
      if (!open) designer.clearPreview();
    }}
  >
    <Menu.Trigger
      data-slot="picker-trigger"
      {disabled}
      class="relative w-36 shrink-0 touch-manipulation rounded-xl p-3 ring-1 ring-foreground/10 select-none hover:bg-muted focus-visible:ring-foreground/50 focus-visible:outline-none disabled:opacity-50 data-popup-open:bg-muted md:w-full md:rounded-lg md:px-2.5 md:py-2"
    >
      <div class="flex flex-col justify-start text-left">
        <div class="text-xs text-muted-foreground">{label}</div>
        <div class="line-clamp-1 max-w-[80%] truncate text-sm font-medium text-foreground">{display}</div>
      </div>
      <div class="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base text-foreground select-none md:right-2.5">
        {@render icon()}
      </div>
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner class="isolate z-50 outline-none" anchor={mobile ? anchor : undefined} side={mobile ? 'top' : 'right'} align={mobile ? 'center' : 'start'} sideOffset={20}>
        <Menu.Popup
          class={cn(
            'cn-menu-target no-scrollbar z-50 max-h-(--available-height) w-[calc(var(--available-width)-(--spacing(6)))] min-w-32 origin-(--transform-origin) translate-y-2 overflow-x-hidden overflow-y-auto rounded-xl border-0 bg-neutral-950/80 p-1.5 text-neutral-100 ring-1 ring-neutral-950/80 backdrop-blur-xl outline-none data-closed:overflow-hidden md:w-52 dark:bg-neutral-800/90 dark:ring-neutral-700/50',
            className,
          )}
          onmouseleave={() => designer.clearPreview()}
        >
          {@render children()}
        </Menu.Popup>
      </Menu.Positioner>
      <!-- Catches clicks over the preview iframe, which would otherwise swallow them and leave the menu open. -->
      <div class="absolute inset-y-0 right-0 left-62 z-40 bg-transparent"></div>
    </Menu.Portal>
  </Menu.Root>
  <button
    type="button"
    title={locked ? 'Unlock' : 'Lock'}
    aria-label={`Lock ${label}`}
    aria-pressed={locked}
    data-locked={locked}
    onclick={() => designer.toggleLock(field)}
    class="absolute top-1/2 right-8 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded opacity-0 ring-foreground/60 transition-opacity outline-none group-focus-within/picker:opacity-100 group-hover/picker:opacity-100 focus:opacity-100 focus-visible:ring-1 data-[locked=true]:opacity-100 pointer-coarse:hidden"
  >
    <IconSvg icon={locked ? PICKER_ICONS.lock : PICKER_ICONS.unlock} class="size-5 text-foreground" />
  </button>
</div>
