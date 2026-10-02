// The pinned design-system hook's resolved iconLibrary value is supplied by an app-only React context.
import { createContext, createElement, useContext, type ReactNode } from 'react';
import type { IconLibraryName } from './config';
const Context = createContext<IconLibraryName>('lucide');
export function IconLibraryProvider({ library, children }: { library: IconLibraryName; children?: ReactNode }) { return createElement(Context.Provider, { value: library }, children); }
export function useDesignSystemSearchParams() { return [{ iconLibrary: useContext(Context) }] as const; }
