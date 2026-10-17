// Adapted from shadcn-ui/ui d2fba50e; MIT: apps/docs/registry/THIRD_PARTY_NOTICES.md.
import type { GrammarState } from 'shiki/core';
import { escapeHtml, loadHighlighter, type Highlighter } from './highlighter.js';

type Done = { highlighter: Highlighter | null; text: string; lines: string[]; state?: GrammarState };

/**
 * Highlights `code` and returns one HTML string per line in `lines`, for `{@html}` in a `CodeBlockLine`. Pass
 * getters so the result follows the current values.
 */
export function useHighlightedCode(code: () => string, language: () => string) {
  let loaded = $state.raw<{ language: string; highlighter: Highlighter | null } | null>(null);

  $effect(() => {
    const current = language();
    let cancelled = false;
    loadHighlighter(current)
      .then((highlighter) => {
        if (!cancelled) loaded = { language: current, highlighter };
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  });

  // The complete lines, highlighted. While the code streams, only the new lines are tokenized, starting from the
  // grammar state of the last one. It is a cache, so it is not reactive.
  let done: Done = { highlighter: null, text: '', lines: [] };

  const lines = $derived.by(() => {
    const value = code();
    // A trailing newline would render as an extra empty line.
    const text = value.endsWith('\n') ? value.slice(0, -1) : value;
    const highlighter = loaded?.language === language() ? loaded.highlighter : null;
    if (!highlighter) return text.split('\n').map(escapeHtml);

    if (done.highlighter !== highlighter || !text.startsWith(done.text)) done = { highlighter, text: '', lines: [] };
    const end = text.lastIndexOf('\n') + 1;
    if (end > done.text.length) {
      const result = highlighter.highlight(text.slice(done.text.length, end - 1), done.state);
      done = { highlighter, text: text.slice(0, end), lines: [...done.lines, ...result.lines], state: result.state };
    }

    // The last line is still being written, so it is tokenized on every change.
    return [...done.lines, highlighter.highlight(text.slice(end), done.state).lines[0] ?? ''];
  });

  return {
    get lines() {
      return lines;
    },
  };
}
