import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist-test',
    emptyOutDir: true,
    lib: {
      entry: './tests/index.ts',
      formats: ['es'],
      fileName: 'suite.test',
    },
  },
});
