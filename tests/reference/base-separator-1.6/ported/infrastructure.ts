// MUI testing infrastructure substitution; not a component assertion or behavior shim.
import { act } from 'react';
import { tick } from 'svelte';
export async function flushMicrotasks() { await act(async () => {}); await tick(); }
export function randomStringValue() { return Math.random().toString(36).slice(2); }
export const screen = {
  getByRole(role: string) { const node = document.querySelector(`[role="${role}"]`); if (!node) throw new Error(`Missing role ${role}`); return node; },
  queryByTestId(id: string) { return document.querySelector(`[data-testid="${id}"]`); },
  getByTestId(id: string) {
    const node = document.querySelector(`[data-testid="${id}"]`);
    if (!node) throw new Error(`Missing test id ${id}`);
    return node;
  },
};
