import { Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';

let browser: Browser;
let page: Page;

Before(async function () {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    this.browser = browser; // ✅ Store browser instance
    this.page = page; // ✅ Store page instance
});

After(async function () {
    await page.close();
    await browser.close();
});
