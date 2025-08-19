/**
 * Environment detection utilities
 */

/**
 * Check if we're running in a browser environment
 */
export const isBrowser = (): boolean => 
  typeof window !== 'undefined';

/**
 * Check if the browser supports matchMedia API
 */
export const hasMatchMedia = (): boolean => 
  isBrowser() && typeof window.matchMedia === 'function';

/**
 * Check if Turbo is available in the current environment
 */
export const hasTurbo = (): boolean => 
  isBrowser() && 
  'Turbo' in window && 
  typeof (window as { Turbo?: { navigator?: object } }).Turbo === 'object' &&
  (window as { Turbo?: { navigator?: object } }).Turbo !== null;