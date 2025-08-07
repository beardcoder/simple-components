import { useMediaQuery } from './useMediaQuery';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- is used for type inference
const COLOR_SCHEMES = ['dark', 'light', 'no-preference'] as const;
export type ColorScheme = (typeof COLOR_SCHEMES)[number];

const queries: Record<ColorScheme, string> = {
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  'no-preference': '(prefers-color-scheme: no-preference)',
};

export function usePreferredColorScheme(): ColorScheme {
  if (
    typeof window === 'undefined' ||
		typeof window.matchMedia !== 'function'
  ) {
    return 'no-preference';
  }
  if (useMediaQuery(queries.dark)) {
    return 'dark';
  }
  if (useMediaQuery(queries.light)) {
    return 'light';
  }
  return 'no-preference';
}
