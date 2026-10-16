import { DEFAULT_PRESET_CONFIG, decodePreset, encodePreset, type PresetCode, type PresetConfig } from 'sveltery/preset';

/** The block the Create page shows until the user picks another, as upstream. */
export const DEFAULT_PREVIEW_ITEM = 'preview-02';

const MESSAGE_TYPE = 'design-system-params';

/** The message the Create page posts to the preview. It carries a preset code, so the first URL and every later message parse the same way. */
export type PreviewMessage = { type: typeof MESSAGE_TYPE; preset: PresetCode };

/** The iframe `src` for the first load. Later configs go through `sendPreviewConfig`, so the frame never reloads. */
export function previewSrc(item: string, config: PresetConfig): string {
  return `/preview/${item}?preset=${encodePreset(config)}`;
}

export function sendPreviewConfig(iframe: HTMLIFrameElement | null, config: PresetConfig): void {
  const message: PreviewMessage = { type: MESSAGE_TYPE, preset: encodePreset(config) };
  iframe?.contentWindow?.postMessage(message, location.origin);
}

/** A missing or unreadable code falls back to the default config, as upstream's `b0`. */
export function parsePreviewParams(params: URLSearchParams): PresetConfig {
  return decodePreset(params.get('preset') ?? '') ?? DEFAULT_PRESET_CONFIG;
}

/** The config in a message from the embedding page, or null for any other message. */
export function parsePreviewMessage(event: MessageEvent): PresetConfig | null {
  if (event.origin !== location.origin || event.source !== window.parent) return null;
  const data: unknown = event.data;
  if (typeof data !== 'object' || data === null) return null;
  const { type, preset } = data as Partial<Record<keyof PreviewMessage, unknown>>;
  return type === MESSAGE_TYPE && typeof preset === 'string' ? decodePreset(preset) : null;
}
