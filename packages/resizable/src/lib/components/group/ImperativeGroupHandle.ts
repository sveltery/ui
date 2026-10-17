import { IDENTITY_FUNCTION } from '../../constants.js';
import type { GroupImperativeHandle, Layout } from './types.js';

/** A class, so Svelte state stores it unproxied and a bound `groupRef` keeps calling the methods the group last set. */
export class ImperativeGroupHandle implements GroupImperativeHandle {
  #methods: GroupImperativeHandle = {
    getLayout: () => ({}),
    setLayout: IDENTITY_FUNCTION
  };

  delegateTo(methods: GroupImperativeHandle) {
    this.#methods = methods;
  }

  getLayout = () => this.#methods.getLayout();
  setLayout = (layout: Layout) => this.#methods.setLayout(layout);
}
