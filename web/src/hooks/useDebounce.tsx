import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook to debounce a function.
 *
 * @param fn - The function to debounce.
 * @param delay - The delay in milliseconds for the debounce.
 * @returns A debounced version of the input function.
 */
function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    const timeoutRef = useRef<number | undefined>();
    const savedCallback = useRef<T>(fn);

    // Update the savedCallback whenever the function changes
    useEffect(() => {
        savedCallback.current = fn;
    }, [fn]);

    const debouncedFunction = useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current !== undefined) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            savedCallback.current(...args);
        }, delay);
    }, [delay]);

    // Cleanup the timeout on component unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current !== undefined) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedFunction as T;
}

export default useDebounce;
