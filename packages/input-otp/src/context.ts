import { createContext } from 'svelte';
import type { RenderProps } from './types.js';

export const [getOTPInputContext, setOTPInputContext] = createContext<RenderProps>();
