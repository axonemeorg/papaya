import { useCallback, useRef } from 'react';

type AsyncFunction<Args extends any[], R> = (...args: Args) => Promise<R>;

interface PendingCall<R> {
    resolve: (value: R | PromiseLike<R>) => void;
    reject: (reason?: any) => void;
}

export function useDebounce<Args extends any[], R>(
    fn: AsyncFunction<Args, R>,
    delay: number
): (...args: Args) => Promise<R> {
    const timerIdRef = useRef<number | undefined>(undefined);
    const pendingRef = useRef<PendingCall<R> | null>(null);
    const argsRef = useRef<Args | null>(null);

    const debouncedFn = useCallback(
        (...args: Args) => {
            // Clear previous timer if any
            if (timerIdRef.current !== undefined) {
                window.clearTimeout(timerIdRef.current);
            }

            // Create a new promise that will be resolved/rejected after `fn` is called
            const promise = new Promise<R>((resolve, reject) => {
                pendingRef.current = { resolve, reject };
            });

            // Store the latest arguments
            argsRef.current = args;

            // Set up a new timer
            timerIdRef.current = window.setTimeout(async () => {
                timerIdRef.current = undefined;
                const currentPending = pendingRef.current;
                pendingRef.current = null;

                if (!currentPending) {
                    // No pending call, nothing to do
                    return;
                }

                try {
                    // Call the async function with the last arguments
                    const result = await fn(...(argsRef.current as Args));
                    currentPending.resolve(result);
                } catch (error) {
                    currentPending.reject(error);
                }
            }, delay);

            // Return the promise so the caller can `.then(...)` if they want
            return promise;
        },
        [fn, delay]
    );

    return debouncedFn;
}
