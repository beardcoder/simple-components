
type SignalSubscriber<T> = (value: T) => void;

export interface Signal<T> {
  value: T;
  subscribe(fn: SignalSubscriber<T>): () => void;
}

export function useSignal<T>(initial: T): Signal<T> {
  let _value = initial;
  const subscribers = new Set<SignalSubscriber<T>>();
  return {
    subscribe(fn: SignalSubscriber<T>) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    get value(): T {
      return _value;
    },
    set value(next) {
      if (!Object.is(_value, next)) {
        _value = next;
        subscribers.forEach((fn) => fn(_value));
      }
    },
  };
}

/**
 * Sets up signal subscriptions for an effect
 */
export function subscribeToSignals(
  signals: Signal<unknown>[],
  callback: () => void,
): (() => void)[] {
  return signals.map((sig) => sig.subscribe(callback));
}

/**
 * Cleans up all signal subscriptions
 */
export function cleanupSignalSubscriptions(unsubscribers: (() => void)[]): void {
  unsubscribers.forEach((unsub) => unsub());
}
