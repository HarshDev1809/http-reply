import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  esbuildOptions(options) {
    options.platform = 'node';
  }
});
