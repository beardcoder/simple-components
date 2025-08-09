import { useSignal, type Signal } from './useSignal';

/**
 * Reactive media query hook.
 * Returns a Signal<boolean> that updates when the media query changes.
 */
export function useMediaQuery(query: string): Signal<boolean> {
  const initial = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;

  const signal = useSignal<boolean>(initial);

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return signal; // Non-reactive in non-browser envs
  }

  const mql = window.matchMedia(query);
  const handler = (event: MediaQueryListEvent): void => {
    signal.value = event.matches;
  };
  mql.addEventListener('change', handler);

  // Consumers may keep the signal; GC cleans listener with page lifecycle.
  // For explicit cleanup support, consumers can call mql.removeEventListener('change', handler).
  return signal;
}

/**
 * Convenience helper to get the current boolean state once.
 */
export function isMediaQueryMatched(query: string): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(query).matches;
}
