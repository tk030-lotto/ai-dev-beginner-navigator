import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist-test',
    emptyOutDir: true,
    lib: {
      entry: './tests/core.test.ts',
      formats: ['es'],
      fileName: 'core.test',
    },
  },
});
