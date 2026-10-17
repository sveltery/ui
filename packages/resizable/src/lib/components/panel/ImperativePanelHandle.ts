import { NOOP_FUNCTION } from '../../constants.js';
import type { PanelImperativeHandle } from './types.js';

/** A class, so Svelte state stores it unproxied and a bound `panelRef` keeps calling the methods the panel last set. */
export class ImperativePanelHandle implements PanelImperativeHandle {
  #methods: PanelImperativeHandle = {
    collapse: NOOP_FUNCTION,
    expand: NOOP_FUNCTION,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => false,
    resize: NOOP_FUNCTION
  };

  delegateTo(methods: PanelImperativeHandle) {
    this.#methods = methods;
  }

  collapse = () => this.#methods.collapse();
  expand = () => this.#methods.expand();
  getSize = () => this.#methods.getSize();
  isCollapsed = () => this.#methods.isCollapsed();
  resize = (size: number | string) => this.#methods.resize(size);
}
