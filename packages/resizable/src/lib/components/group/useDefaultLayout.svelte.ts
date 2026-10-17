import { getStorageKey } from './auto-save/getStorageKey.js';
import type { Layout, LayoutStorage, OnGroupLayoutChange, OnGroupLayoutChanged } from './types.js';

/**
 * Saves and restores group layouts between page loads.
 * It can be configured to store values using `localStorage`, `sessionStorage`, cookies, or any other persistence layer that makes sense for your application.
 *
 * ⚠️ Call it while a component initializes.
 */
export function useDefaultLayout({
  debounceSaveMs = 100,
  panelIds,
  storage = localStorage,
  ...rest
}: {
  /**
   * Debounce save operation by the specified number of milliseconds; defaults to 100ms
   *
   * @deprecated Use the {@link onLayoutChanged} callback instead; it does not require debouncing
   */
  debounceSaveMs?: number;

  /**
   * For Groups that contain conditionally-rendered Panels, this prop can be used to save and restore multiple layouts.
   *
   * ℹ️ This prevents layout shift for server-rendered apps.
   *
   * ⚠️ Panel ids must match the Panels rendered within the Group during mount or the initial layout will be incorrect.
   */
  panelIds?: string[] | undefined;

  /**
   * Storage implementation; supports localStorage, sessionStorage, and custom implementations
   * Refer to documentation site for example integrations.
   *
   */
  storage?: LayoutStorage;
} & (
  | {
      /**
       * Group id; must be unique in order for layouts to be saved separately.
       * @deprecated Use the {@link id} param instead
       */
      groupId: string;
    }
  | {
      /**
       * Uniquely identifies a specific group/layout.
       */
      id: string;
    }
)) {
  const hasPanelIds = panelIds !== undefined;
  const id = 'id' in rest ? rest.id : rest.groupId;

  const readStorageKey = getStorageKey(id, panelIds ?? []);

  const defaultLayoutString = storage.getItem(readStorageKey);

  const defaultLayout = defaultLayoutString ? (JSON.parse(defaultLayoutString) as Layout) : undefined;

  let timeout: ReturnType<typeof setTimeout> | null = null;

  const clearPendingTimeout = () => {
    if (timeout) {
      const pending = timeout;
      timeout = null;

      clearTimeout(pending);
    }
  };

  $effect(() => clearPendingTimeout);

  const onLayoutChanged: NonNullable<OnGroupLayoutChanged> = (layout: Layout) => {
    clearPendingTimeout();

    let writeStorageKey: string;
    if (hasPanelIds) {
      writeStorageKey = getStorageKey(id, Object.keys(layout));
    } else {
      writeStorageKey = getStorageKey(id, []);
    }

    try {
      storage.setItem(writeStorageKey, JSON.stringify(layout));
    } catch (error) {
      console.error(error);
    }
  };

  const onLayoutChange: NonNullable<OnGroupLayoutChange> = (layout: Layout) => {
    clearPendingTimeout();

    if (debounceSaveMs === 0) {
      onLayoutChanged(layout);
    } else {
      timeout = setTimeout(() => {
        onLayoutChanged(layout);
      }, debounceSaveMs);
    }
  };

  return {
    /**
     * Pass this value to `Group` as the `defaultLayout` prop.
     */
    defaultLayout,

    /**
     * Attach this callback on the `Group` as the `onLayoutChange` prop.
     *
     * @deprecated Use the {@link onLayoutChanged} prop instead.
     */
    onLayoutChange,

    /**
     * Attach this callback on the `Group` as the `onLayoutChanged` prop.
     */
    onLayoutChanged
  };
}
