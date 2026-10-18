import { createContext, untrack } from 'svelte';
import type { ReactElement } from '../react.js';
import type { Box, Getter } from '../state/hooks.svelte.js';
import { Cell, type Props as CellProps } from './Cell.js';

/** A registered Cell, shaped like the React element upstream's selectors read (`cells[i].props`). */
export type CellEntry = ReactElement<CellProps>;

type CellRegistry = {
  add(entry: CellEntry): void;
  replace(prev: CellEntry, next: CellEntry): void;
  remove(entry: CellEntry): void;
};

const [getCellRegistry, setCellRegistry, hasCellRegistry] = createContext<CellRegistry>();

/**
 * Called by a graphical item at initialisation, in place of upstream's `findAllByType(children, Cell)`.
 * The Cells rendered below it register here in declaration order.
 */
export function provideCellReader(): Box<ReadonlyArray<CellEntry>> {
  let cells = $state.raw<ReadonlyArray<CellEntry>>([]);
  setCellRegistry({
    add: (entry) => {
      cells = [...cells, entry];
    },
    replace: (prev, next) => {
      cells = cells.map((cell) => (cell === prev ? next : cell));
    },
    remove: (entry) => {
      cells = cells.filter((cell) => cell !== entry);
    },
  });
  return {
    get current() {
      return cells;
    },
  };
}

/** Called by Cell at initialisation. $effect.pre runs during initialisation, parent first, so registration follows declaration order. */
export function registerCell(props: Getter<CellProps>): void {
  if (!hasCellRegistry()) return;
  const registry = getCellRegistry();
  let entry: CellEntry | null = null;
  $effect.pre(() => {
    const next: CellEntry = { type: Cell, props: props(), key: null };
    untrack(() => {
      if (entry === null) registry.add(next);
      else registry.replace(entry, next);
      entry = next;
    });
  });
  $effect.pre(() => () => {
    if (entry !== null) {
      registry.remove(entry);
      entry = null;
    }
  });
}
