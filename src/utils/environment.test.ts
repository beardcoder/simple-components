import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isBrowser, hasMatchMedia, hasTurbo } from './environment';

describe('environment utilities', () => {
  describe('isBrowser', () => {
    it('returns true when window is defined', () => {
      expect(isBrowser()).toBe(true);
    });

    it('returns false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally setting window to undefined for testing
      delete global.window;
      
      expect(isBrowser()).toBe(false);
      
      global.window = originalWindow;
    });
  });

  describe('hasMatchMedia', () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('returns true when window and matchMedia are available', () => {
      window.matchMedia = vi.fn();
      expect(hasMatchMedia()).toBe(true);
    });

    it('returns false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally setting window to undefined for testing
      delete global.window;
      
      expect(hasMatchMedia()).toBe(false);
      
      global.window = originalWindow;
    });

    it('returns false when matchMedia is not a function', () => {
      // @ts-expect-error - Intentionally setting matchMedia to non-function for testing
      window.matchMedia = undefined;
      expect(hasMatchMedia()).toBe(false);
    });

    it('returns false when matchMedia is not available', () => {
      const { ...windowWithoutMatchMedia } = window;
      global.window = windowWithoutMatchMedia as Window & typeof globalThis;
      
      expect(hasMatchMedia()).toBe(false);
      
      global.window = window;
    });
  });

  describe('hasTurbo', () => {
    let originalTurbo: unknown;

    beforeEach(() => {
      originalTurbo = (window as { Turbo?: unknown }).Turbo;
    });

    afterEach(() => {
      if (originalTurbo === undefined) {
        delete (window as { Turbo?: unknown }).Turbo;
      } else {
        (window as { Turbo?: unknown }).Turbo = originalTurbo;
      }
    });

    it('returns true when window and Turbo object are available', () => {
      (window as { Turbo?: unknown }).Turbo = { navigator: {} };
      expect(hasTurbo()).toBe(true);
    });

    it('returns false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally setting window to undefined for testing
      delete global.window;
      
      expect(hasTurbo()).toBe(false);
      
      global.window = originalWindow;
    });

    it('returns false when Turbo is not available', () => {
      delete (window as { Turbo?: unknown }).Turbo;
      expect(hasTurbo()).toBe(false);
    });

    it('returns false when Turbo is not an object', () => {
      (window as { Turbo?: unknown }).Turbo = 'not an object';
      expect(hasTurbo()).toBe(false);
    });

    it('returns false when Turbo is null', () => {
      (window as { Turbo?: unknown }).Turbo = null;
      expect(hasTurbo()).toBe(false);
    });

    it('returns false when Turbo is a function', () => {
      (window as { Turbo?: unknown }).Turbo = () => {};
      expect(hasTurbo()).toBe(false);
    });

    it('returns true when Turbo is an empty object', () => {
      (window as { Turbo?: unknown }).Turbo = {};
      expect(hasTurbo()).toBe(true);
    });
  });
});