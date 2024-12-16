import { createContext } from 'react';

export type AsyncCallback = (...args: any[]) => Promise<any>;

export interface DebounceContext {
    registerDebouncedCallback: (key: string, callback: AsyncCallback, delay: number) => (...args: any[]) => void;
}

export const DebounceContext = createContext<DebounceContext>({
    registerDebouncedCallback: () => () => {},
});
