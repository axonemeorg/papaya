import { AsyncCallback, DebounceContext } from "@/contexts/DebounceContext";
import { PropsWithChildren, useCallback, useEffect, useRef } from "react";

export const DebounceContextProvider = (props: PropsWithChildren) => {
    // Map of keys to their current timeout and callback references
    const debounceMapRef = useRef<Map<string, { timeoutId: number; callback: AsyncCallback; delay: number }>>(new Map());

    // Set of keys currently in flight (actively running async callbacks)
    const inFlightRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (inFlightRef.current.size > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const registerDebouncedCallback = useCallback((key: string, callback: AsyncCallback, delay: number) => {
        return (...args: any[]) => {
            // If there's an existing timeout, clear it
            if (debounceMapRef.current.has(key)) {
                const { timeoutId } = debounceMapRef.current.get(key)!;
                clearTimeout(timeoutId);
            }

            // Set up a new debounced timeout
            const timeoutId = window.setTimeout(async () => {
                // Remove the timeout from the map once it fires
                debounceMapRef.current.delete(key);

                // Track that this callback is now in-flight
                inFlightRef.current.add(key);

                try {
                    await callback(...args);
                    // On success, remove from in-flight
                    inFlightRef.current.delete(key);
                } catch (error) {
                    // On error, still remove from in-flight
                    inFlightRef.current.delete(key);
                    // Optionally handle/report error here
                    console.error(`Debounced callback [${key}] failed:`, error);
                }
            }, delay);

            // Store the callback and timer
            debounceMapRef.current.set(key, { timeoutId, callback, delay });
        };
    }, []);

    const value: DebounceContext = {
        registerDebouncedCallback,
    };

    return (
        <DebounceContext.Provider value={value}>
            {props.children}
        </DebounceContext.Provider>
    );
};