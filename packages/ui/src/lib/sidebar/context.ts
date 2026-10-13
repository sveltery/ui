import { createContext } from 'svelte';

export type SidebarContextValue = {
  readonly state: 'expanded' | 'collapsed';
  readonly open: boolean;
  setOpen: (open: boolean) => void;
  readonly openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  readonly isMobile: boolean;
  toggleSidebar: () => void;
};

export const [useSidebar, setSidebarContext] = createContext<SidebarContextValue>();
