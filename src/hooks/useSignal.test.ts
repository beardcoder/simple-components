import { describe, it, expect, vi } from 'vitest';
import { useSignal } from './useSignal';

describe('signal system', () => {
  describe('useSignal', () => {
    it('should create a signal with initial value', () => {
      const signal = useSignal(42);
      expect(signal.value).toBe(42);
    });

    it('should update signal value', () => {
      const signal = useSignal('hello');
      signal.value = 'world';
      expect(signal.value).toBe('world');
    });

    it('should notify subscribers when value changes', () => {
      const signal = useSignal(0);
      const subscriber = vi.fn();

      signal.subscribe(subscriber);
      signal.value = 1;

      expect(subscriber).toHaveBeenCalledWith(1);
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not notify subscribers when value stays the same', () => {
      const signal = useSignal(42);
      const subscriber = vi.fn();

      signal.subscribe(subscriber);
      signal.value = 42; // Same value

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should handle multiple subscribers', () => {
      const signal = useSignal('initial');
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();

      signal.subscribe(subscriber1);
      signal.subscribe(subscriber2);
      signal.value = 'updated';

      expect(subscriber1).toHaveBeenCalledWith('updated');
      expect(subscriber2).toHaveBeenCalledWith('updated');
    });

    it('should allow unsubscribing', () => {
      const signal = useSignal(0);
      const subscriber = vi.fn();

      const unsubscribe = signal.subscribe(subscriber);
      signal.value = 1;
      expect(subscriber).toHaveBeenCalledTimes(1);

      unsubscribe();
      signal.value = 2;
      expect(subscriber).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should handle objects and arrays', () => {
      const signal = useSignal({ count: 0 });
      const subscriber = vi.fn();

      signal.subscribe(subscriber);
      signal.value = { count: 1 };

      expect(subscriber).toHaveBeenCalledWith({ count: 1 });
    });

    it('should detect reference changes for objects', () => {
      const obj = { count: 0 };
      const signal = useSignal(obj);
      const subscriber = vi.fn();

      signal.subscribe(subscriber);
      signal.value = obj; // Same reference

      expect(subscriber).not.toHaveBeenCalled();
    });
  });
});
