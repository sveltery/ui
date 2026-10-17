import { createContext } from 'svelte';
import type { GroupContextType } from './types.js';

export const [getGroupContext, setGroupContext, hasGroupContext] = createContext<GroupContextType>();
