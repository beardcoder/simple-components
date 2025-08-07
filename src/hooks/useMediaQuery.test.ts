import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMediaQuery } from '../hooks/useMediaQuery';

describe('useMediaQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false when window is undefined', () => {
    const originalWindow = global.window;
    // @ts-expect-error - Intentionally making window undefined
    delete global.window;

    const result = useMediaQuery('(min-width: 768px)');
    expect(result).toBe(false);

    global.window = originalWindow;
  });

  it('should return false when matchMedia is not available', () => {
    const originalMatchMedia = window.matchMedia;
    // @ts-expect-error - Intentionally removing matchMedia
    delete window.matchMedia;

    const result = useMediaQuery('(min-width: 768px)');
    expect(result).toBe(false);

    window.matchMedia = originalMatchMedia;
  });

  it('should return initial matches value when media query matches', () => {
    const mockMql = {
      matches: true,
      media: '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(mockMql);

    const result = useMediaQuery('(min-width: 768px)');
    expect(result).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('should return false when media query does not match', () => {
    const mockMql = {
      matches: false,
      media: '(min-width: 1200px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(mockMql);

    const result = useMediaQuery('(min-width: 1200px)');
    expect(result).toBe(false);
  });

  it('should register event listener for media query changes', () => {
    const mockMql = {
      matches: false,
      media: '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(mockMql);

    useMediaQuery('(min-width: 768px)');

    expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle common media queries', () => {
    const testCases = [
      { query: '(min-width: 768px)', expected: true },
      { query: '(max-width: 767px)', expected: false },
      { query: '(orientation: portrait)', expected: true },
      { query: '(prefers-color-scheme: dark)', expected: false },
    ];

    testCases.forEach(({ query, expected }) => {
      const mockMql = {
        matches: expected,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      window.matchMedia = vi.fn().mockReturnValue(mockMql);

      const result = useMediaQuery(query);
      expect(result).toBe(expected);
    });
  });

  it('should work with complex media queries', () => {
    const complexQuery = '(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)';
    const mockMql = {
      matches: true,
      media: complexQuery,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(mockMql);

    const result = useMediaQuery(complexQuery);
    expect(result).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith(complexQuery);
  });
});
