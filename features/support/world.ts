import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, Page, chromium } from '@playwright/test';

export class CustomWorld extends World {
    browser!: Browser;
    page!: Page;

    async launchBrowser() {
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

setWorldConstructor(CustomWorld);
