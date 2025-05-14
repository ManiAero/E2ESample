import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false, // ✅ Enables headed mode (UI visible)
    browserName: 'chromium', // Options: 'chromium', 'firefox', 'webkit'
    viewport: { width: 1280, height: 720 }, // Set viewport size
    screenshot: 'on', // Capture screenshots on failure
    video: 'retain-on-failure', // Store video recordings for failed tests
    trace: 'on', // Enable trace viewer for debugging
     // Global timeout for tests
  },
});
