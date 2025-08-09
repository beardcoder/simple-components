import { describe, it, expect, vi } from 'vitest';
import { useSignal, subscribeToSignals, cleanupSignalSubscriptions, type Signal } from './useSignal';

describe('signal helpers', () => {
  it('subscribeToSignals subscribes to multiple signals and returns unsubscribers', () => {
    const a = useSignal(1);
    const b = useSignal(2);
    const cb = vi.fn();

    const unsubscribers = subscribeToSignals([a as Signal<unknown>, b as Signal<unknown>], cb);
    expect(unsubscribers).toHaveLength(2);

    a.value = 10;
    b.value = 20;
    expect(cb).toHaveBeenCalledTimes(2);

    cleanupSignalSubscriptions(unsubscribers);

    a.value = 11;
    b.value = 21;
    expect(cb).toHaveBeenCalledTimes(2); // no more calls
  });
});
