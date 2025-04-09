import { defineConfig } from 'tsup';

export default defineConfig({
  name: '@octas/core',
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  clean: true,
  splitting: true,
});
