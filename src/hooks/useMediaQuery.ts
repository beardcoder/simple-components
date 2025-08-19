import { useSignal, type Signal } from './useSignal';
import { hasMatchMedia } from '../utils/environment';

/**
 * Reactive media query hook.
 * Returns a Signal<boolean> that updates when the media query changes.
 */
export function useMediaQuery(query: string): Signal<boolean> {
  const initial = hasMatchMedia() ? window.matchMedia(query).matches : false;

  const signal = useSignal<boolean>(initial);

  if (!hasMatchMedia()) {
    return signal; // Non-reactive in non-browser envs
  }

  const mediaQueryList = window.matchMedia(query);
  const mediaQueryChangeHandler = (event: MediaQueryListEvent): void => {
    signal.value = event.matches;
  };
  mediaQueryList.addEventListener('change', mediaQueryChangeHandler);

  // Consumers may keep the signal; GC cleans listener with page lifecycle.
  // For explicit cleanup support, consumers can call mediaQueryList.removeEventListener('change', mediaQueryChangeHandler).
  return signal;
}

/**
 * Convenience helper to get the current boolean state once.
 */
export function isMediaQueryMatched(query: string): boolean {
  return hasMatchMedia() ? window.matchMedia(query).matches : false;
}
