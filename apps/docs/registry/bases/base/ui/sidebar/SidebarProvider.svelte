<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { cn } from 'cn';
  import { setSidebarContext } from './context.js';
  import { SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME, SIDEBAR_KEYBOARD_SHORTCUT, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from './constants.js';
  import type { SidebarProviderProps } from './types.js';
  let { defaultOpen = true, open = $bindable(defaultOpen), onOpenChange, children, class: classProp, style, ...props }: SidebarProviderProps = $props();
  const mobile = new MediaQuery('max-width: 767px');
  let openMobile = $state(false);

  function setOpen(value: boolean) {
    open = value;
    onOpenChange?.(value);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }

  function toggleSidebar() {
    if (mobile.current) openMobile = !openMobile;
    else setOpen(!open);
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleSidebar();
    }
  }

  setSidebarContext({
    get state() { return open ? 'expanded' : 'collapsed'; },
    get open() { return open; },
    setOpen,
    get openMobile() { return openMobile; },
    setOpenMobile: value => (openMobile = value),
    get isMobile() { return mobile.current; },
    toggleSidebar,
  });
</script>
<svelte:window {onkeydown} />
<div data-slot="sidebar-wrapper" {...props} style="--sidebar-width: {SIDEBAR_WIDTH}; --sidebar-width-icon: {SIDEBAR_WIDTH_ICON};{style ? ` ${style}` : ''}" class={cn('group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar', classProp)}>
  {@render children?.()}
</div>
