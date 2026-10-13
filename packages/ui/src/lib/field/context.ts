import { getContext, setContext } from 'svelte';

const key = Symbol('field');

/** Marks the parts inside a Field, so a label or description outside one renders a plain element, as upstream allows. */
export const setInField = () => setContext(key, true);
export const inField = () => getContext<boolean | undefined>(key) === true;
