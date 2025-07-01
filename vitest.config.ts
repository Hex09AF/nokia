import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  test: {
    css: true,
    globals: true,
    projects: [
      {
        test: {
          include: ['src/tests/unit/**/*.{test,spec}.ts'],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        test: {
          css: true,
          include: ['src/tests/browser/**/*.{test,spec}.tsx'],
          name: 'browser',
          browser: {
            provider: 'playwright',
            enabled: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        test: {
          include: ['src/tests/hook/**/*.{test,spec}.tsx'],
          name: 'hooks',
          environment: 'jsdom',
        },
      },
    ],
  },
});
