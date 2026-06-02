/** A debounced function, with a `cancel()` to drop any pending invocation. */
export interface DebouncedFunction<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  /** Cancel a pending invocation, if one is scheduled. */
  cancel: () => void;
}

/**
 * Delay the execution of a function until a specified period of inactivity has passed since its last call.
 * It's very useful for scenarios when it's better to limit the number of times the function is called.
 * E.g. think of search input which fetches data from API. It's enough display search results after user has stopped entering characters for some time.
 * Or when listening to window "resize" event, waiting until user has completed dragging the window.
 * @param callback The function to execute after the delay.
 * @param delay The delay in milliseconds.
 * @returns A debounced version of the callback, with a `cancel()` method to drop any pending invocation.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<T>): void => {
    // Clear the existing timer if the function is called again within the delay
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timer to execute the callback
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      callback(...args);
    }, delay);
  };

  debounced.cancel = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}
