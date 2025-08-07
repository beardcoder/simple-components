import { useSignal } from './useSignal';

export function useMediaQuery(query: string): boolean {
  if (
    typeof window === 'undefined' ||
		typeof window.matchMedia !== 'function'
  ) {
    return false;
  }
  const mql = window.matchMedia(query);
  const signal = useSignal(mql.matches);

  const handler = (event: MediaQueryListEvent): void => {
    signal.value = event.matches;
  };

  mql.addEventListener('change', handler);

  // Optionally, return a cleanup function if needed
  // return () => mql.removeEventListener('change', handler)

  return signal.value;
}
