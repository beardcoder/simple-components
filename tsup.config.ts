import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  minify: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2019',
  splitting: false,
  skipNodeModulesBundle: true,
});
