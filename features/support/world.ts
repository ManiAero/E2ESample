// Import Cucumber's World and setWorldConstructor to define a custom context
import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, Page, chromium } from '@playwright/test';

//  Create a custom World class to store browser and page per scenario
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
