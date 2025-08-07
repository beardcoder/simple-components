import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePreferredColorScheme } from '../hooks/usePreferredColorScheme';

describe('usePreferredColorScheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return "no-preference" when window is undefined', () => {
    const originalWindow = global.window;
    // @ts-expect-error - Intentionally making window undefined
    delete global.window;

    const result = usePreferredColorScheme();
    expect(result).toBe('no-preference');

    global.window = originalWindow;
  });

  it('should return "no-preference" when matchMedia is not available', () => {
    const originalMatchMedia = window.matchMedia;
    // @ts-expect-error - Intentionally removing matchMedia
    delete window.matchMedia;

    const result = usePreferredColorScheme();
    expect(result).toBe('no-preference');

    window.matchMedia = originalMatchMedia;
  });

  it('should return "dark" when dark mode is preferred', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const result = usePreferredColorScheme();
    expect(result).toBe('dark');
  });

  it('should return "light" when light mode is preferred', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const result = usePreferredColorScheme();
    expect(result).toBe('light');
  });

  it('should return "no-preference" when no preference is set', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: no-preference)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const result = usePreferredColorScheme();
    expect(result).toBe('no-preference');
  });

  it('should return "no-preference" when no media queries match', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const result = usePreferredColorScheme();
    expect(result).toBe('no-preference');
  });

  it('should prioritize dark over light when both match (edge case)', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' || query === '(prefers-color-scheme: light)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const result = usePreferredColorScheme();
    expect(result).toBe('dark');
  });

  it('should use correct media queries', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    usePreferredColorScheme();

    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: light)');
  });
});
