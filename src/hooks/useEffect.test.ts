import { describe, it, expect, vi } from 'vitest';
import { useSignal } from './useSignal';
import { useEffect } from './useEffect';

describe('useEffect', () => {
  it('runs effect immediately and on signal changes', () => {
    const a = useSignal(1);
    const b = useSignal(2);
    const effect = vi.fn();

    useEffect(effect, a, b);

    expect(effect).toHaveBeenCalledTimes(1);

    a.value = 3;
    b.value = 4;

    // Two more calls
    expect(effect).toHaveBeenCalledTimes(3);
  });

  it('calls cleanup before next run and on dispose', () => {
    const s = useSignal(0);
    const cleanup = vi.fn();
    const effect = vi.fn(() => cleanup);

    const dispose = useEffect(effect, s);

    expect(effect).toHaveBeenCalledTimes(1);
    s.value = 1;
    expect(cleanup).toHaveBeenCalledTimes(1);

    dispose();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it('handles undefined cleanup gracefully', () => {
    const s = useSignal(0);
    const effect = vi.fn(() => undefined);

    const dispose = useEffect(effect, s);
    expect(effect).toHaveBeenCalledTimes(1);
    s.value = 1;
    expect(effect).toHaveBeenCalledTimes(2);
    expect(() => dispose()).not.toThrow();
  });
});
