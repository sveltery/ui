<!-- Port of shadcn's apps/v4/app/(app)/(typeset)/components/picker.tsx, option-picker.tsx, font-picker.tsx and lock-button.tsx at d2fba50. -->
<script lang="ts" generics="Value extends string">
  import type { Snippet } from 'svelte';
  import { Menu } from '@sveltery/base/menu';
  import { cn } from 'cn';
  import IconSvg from '$lib/create/IconSvg.svelte';
  import { PICKER_ICONS, type OptionGroup } from '$lib/create/options';
  import PickerOptions from '$lib/create/PickerOptions.svelte';
  import { getBuilder } from './builder.svelte';
  import type { LockableParam } from './params';

  let {
    label,
    param,
    display,
    value,
    groups,
    mobile,
    anchor,
    onselect,
    font = false,
    class: className,
    popupClass,
    icon,
  }: {
    label: string;
    param: LockableParam;
    display: string;
    value: Value;
    groups: OptionGroup<Value>[];
    mobile: boolean;
    /** On phones every menu opens above the customizer card. */
    anchor: HTMLElement | undefined;
    onselect: (value: Value) => void;
    /** Font pickers truncate the font name before the sample, as upstream's font-picker. */
    font?: boolean;
    class?: string;
    popupClass?: string;
    icon: Snippet;
  } = $props();

  const builder = getBuilder();
  const locked = $derived(builder.locks.has(param));
</script>

<div class={cn('group/picker relative', className)}>
  <Menu.Root
    onOpenChange={(open) => {
      if (!open) builder.clearPreview();
    }}
  >
    <Menu.Trigger
      data-slot="picker-trigger"
      class="relative w-36 shrink-0 touch-manipulation rounded-xl p-3 ring-1 ring-foreground/10 select-none hover:bg-muted focus-visible:ring-foreground/50 focus-visible:outline-none disabled:opacity-50 data-popup-open:bg-muted md:w-full md:rounded-lg md:px-2.5 md:py-2"
    >
      <div class={['flex flex-col justify-start text-left', !font && 'min-w-0 pr-8']}>
        <div class="text-xs text-muted-foreground">{label}</div>
        <div class={['line-clamp-1 text-sm font-medium text-foreground', font && 'max-w-[80%] truncate']}>{display}</div>
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
            popupClass,
          )}
          onmouseleave={() => builder.clearPreview()}
        >
          <PickerOptions {value} {groups} {mobile} {onselect} onpreview={(next) => builder.preview({ [param]: next })} />
        </Menu.Popup>
      </Menu.Positioner>
      <!-- Catches clicks over the preview iframe, which would otherwise swallow them and leave the menu open. -->
      <div class="absolute inset-y-0 right-0 left-54 z-40 bg-transparent"></div>
    </Menu.Portal>
  </Menu.Root>
  <button
    type="button"
    title={locked ? 'Unlock' : 'Lock'}
    aria-label={`Lock ${label}`}
    aria-pressed={locked}
    data-locked={locked}
    onclick={() => builder.toggleLock(param)}
    class="absolute top-1/2 right-8 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded opacity-0 ring-foreground/60 transition-opacity outline-none group-focus-within/picker:opacity-100 group-hover/picker:opacity-100 focus:opacity-100 focus-visible:ring-1 data-[locked=true]:opacity-100 max-md:hidden pointer-coarse:hidden"
  >
    <IconSvg icon={locked ? PICKER_ICONS.lock : PICKER_ICONS.unlock} class="size-5 text-foreground" />
  </button>
</div>
