// The builder and its preview frame talk by message, as upstream's search-params.ts and forward-scripts.tsx at d2fba50.
import { coerceParam, DEFAULT_PARAMS, type TypesetParams } from './params';

const PARAMS_MESSAGE = 'typeset-params';
const COMMAND_MESSAGE = 'typeset-command';

/** The builder actions the frame's keyboard shortcuts run: R, Shift+R, Cmd/Ctrl+Z, Shift+Cmd/Ctrl+Z or Ctrl+Y, and D. */
export const COMMANDS = ['shuffle', 'reset', 'undo', 'redo', 'toggle-theme'] as const;
export type TypesetCommand = (typeof COMMANDS)[number];

const fromWindow = (event: MessageEvent, source: Window | null | undefined) => event.origin === location.origin && source != null && event.source === source && typeof event.data === 'object' && event.data !== null;

export function sendParams(frame: HTMLIFrameElement, params: TypesetParams) {
  frame.contentWindow?.postMessage({ type: PARAMS_MESSAGE, params }, location.origin);
}

/** The parameters in a message from the builder, or null for any other message. Unknown values fall back to defaults. */
export function receiveParams(event: MessageEvent): TypesetParams | null {
  if (!fromWindow(event, window.parent) || event.data.type !== PARAMS_MESSAGE) return null;
  const params: Record<string, unknown> = event.data.params ?? {};
  return Object.fromEntries(Object.entries(DEFAULT_PARAMS).map(([key, fallback]) => [key, coerceParam(key as keyof TypesetParams, params[key]) ?? fallback])) as TypesetParams;
}

export function sendCommand(command: TypesetCommand) {
  if (window.parent !== window) window.parent.postMessage({ type: COMMAND_MESSAGE, command }, location.origin);
}

/** The command in a message from the preview frame, or null for any other message. */
export function receiveCommand(event: MessageEvent, frame: HTMLIFrameElement | undefined): TypesetCommand | null {
  if (!fromWindow(event, frame?.contentWindow) || event.data.type !== COMMAND_MESSAGE) return null;
  return COMMANDS.includes(event.data.command) ? event.data.command : null;
}

const editable = (target: EventTarget | null) =>
  (target instanceof HTMLElement && target.isContentEditable) || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;

/** The builder command a key press asks for, as upstream's main-menu.tsx, use-history.tsx and use-theme-toggle.tsx bind them. */
export function shortcutCommand(event: KeyboardEvent): TypesetCommand | null {
  if (editable(event.target)) return null;
  const key = event.key.toLowerCase();
  if (event.metaKey || event.ctrlKey) {
    if ((key === 'z' && event.shiftKey) || (key === 'y' && event.ctrlKey)) return 'redo';
    return key === 'z' ? 'undo' : null;
  }
  if (event.altKey) return null;
  if (key === 'r') return event.shiftKey ? 'reset' : 'shuffle';
  return key === 'd' ? 'toggle-theme' : null;
}
