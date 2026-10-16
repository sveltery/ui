<!-- Port of the radio group and radio item in shadcn's apps/v4/app/(app)/(create)/components/picker.tsx at af983e8. -->
<script lang="ts" generics="Value extends string">
  import { Menu } from '@sveltery/base/menu';
  import IconSvg from './IconSvg.svelte';
  import { PICKER_ICONS, type OptionGroup } from './options';

  let {
    value,
    groups,
    mobile,
    onselect,
    onpreview,
  }: {
    value: Value;
    groups: OptionGroup<Value>[];
    mobile: boolean;
    onselect: (value: Value) => void;
    /** Shows a hovered or focused option in the preview. Phones have no hover, so they skip it. */
    onpreview?: (value: Value) => void;
  } = $props();

  const preview = (option: Value) => {
    if (!mobile) onpreview?.(option);
  };
</script>

<Menu.RadioGroup {value} onValueChange={(next) => onselect(next as Value)}>
  {#each groups as group, index (index)}
    {#if index > 0}
      <Menu.Separator class="-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700" />
    {/if}
    <Menu.Group>
      {#if group.label}
        <Menu.GroupLabel class="px-2 py-1.5 text-xs font-medium text-neutral-400">{group.label}</Menu.GroupLabel>
      {/if}
      {#each group.options as option (option.value)}
        <Menu.RadioItem
          value={option.value}
          disabled={option.disabled}
          closeOnClick={mobile}
          onmousemove={() => preview(option.value)}
          onfocus={() => preview(option.value)}
          class="relative flex cursor-default items-center gap-2 rounded-lg py-1.5 pr-8 pl-2 text-sm font-medium outline-hidden select-none **:text-neutral-100 focus:bg-neutral-600 focus:text-neutral-100 data-disabled:pointer-events-none data-disabled:opacity-50 dark:focus:bg-neutral-700/80 pointer-coarse:gap-3 pointer-coarse:py-2.5 pointer-coarse:pl-3 pointer-coarse:text-base"
        >
          <span class="pointer-events-none absolute right-2 flex items-center justify-center">
            <Menu.RadioItemIndicator>
              <IconSvg icon={PICKER_ICONS.check} class="size-4 pointer-coarse:size-5" />
            </Menu.RadioItemIndicator>
          </span>
          {option.label}
        </Menu.RadioItem>
      {/each}
    </Menu.Group>
  {/each}
</Menu.RadioGroup>
