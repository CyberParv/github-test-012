import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    reporters: ['default'],
    // Allow selecting via --project
    projects: [
      {
        name: 'unit',
        test: {
          include: ['tests/unit/**/*.test.ts']
        }
      },
      {
        name: 'integration',
        test: {
          include: ['tests/integration/**/*.test.ts'],
          testTimeout: 30_000
        }
      }
    ]
  }
});
