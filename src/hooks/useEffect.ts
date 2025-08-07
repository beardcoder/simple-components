import { cleanupSignalSubscriptions, Signal, subscribeToSignals } from './useSignal';

/**
 * Runs effect cleanup safely
 */
function runEffectCleanup(cleanup: (() => void) | undefined): void {
  if (typeof cleanup === 'function') {
    cleanup();
  }
}

/**
 * useEffect hook that runs a callback when any of the provided signals change.
 * The callback can return a cleanup function that will be called before the next run.
 */
export function useEffect(
  callback: () => (() => void) | undefined,
  ...signals: Signal<unknown>[]
): () => void {
  let cleanup: (() => void) | undefined;

  const run = (): void => {
    runEffectCleanup(cleanup);
    cleanup = callback() ?? undefined;
  };

  const unsubscribers = subscribeToSignals(signals, run);

  run();

  return () => {
    runEffectCleanup(cleanup);
    cleanupSignalSubscriptions(unsubscribers);
  };
}
