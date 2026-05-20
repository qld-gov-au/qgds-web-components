/**
 * Delay the execution of a function until a specified period of inactivity has passed since its last call.
 * It's very useful for scenarios when it's better to limit the number of times the function is called.
 * E.g. think of search input which fetches data from API. It's enough display search results after user has stopped entering characters for some time.
 * Or when listening to window "resize" event, waiting until user has completed dragging the window.
 * @param callback The function to execute after the delay.
 * @param delay The delay in milliseconds.
 * @returns A debounced version of the callback.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    // Clear the existing timer if the function is called again within the delay
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timer to execute the callback
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
