import { type Signal, useSignal } from './useSignal';

export interface LocalStorage<T> extends Signal<T> {
  reset: () => void;
}

export function useLocalStorage<T>(key: string, initial: T): LocalStorage<T> {
  let storedValue: T;
  try {
    const item = localStorage.getItem(key);
    storedValue = item !== null ? (JSON.parse(item) as T) : initial;
  } catch {
    storedValue = initial;
  }

  const signal = useSignal<T>(storedValue);

  signal.subscribe((value: T): void => {
    try {
      if (Object.is(value, initial)) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Ignore storage errors
    }
  });

  const reset = (): void => {
    signal.value = initial;
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage errors
    }
  };

  return Object.assign(signal, { reset });
}
