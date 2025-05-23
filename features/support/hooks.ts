import { Before, After, AfterStep } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';

// Node.js modules for file system operations
import fs from 'fs';
import path from 'path';

// Declare browser and page globally so they're accessible in hooks
let browser: Browser;
let page: Page;

//  Before each scenario: launch the browser and create a new page
Before(async function () {
    browser = await chromium.launch({ headless: false }); 
    page = await browser.newPage();                        

    this.browser = browser; 
    this.page = page;
});

//  After each step: capture and attach a screenshot to the Cucumber report
AfterStep(async function (step) {
    if (this.page) {
        const screenshot = await this.page.screenshot();     
        this.attach(screenshot, 'image/png');                
        console.log("📸 Screenshot attached to Cucumber report.");
    }
});

//  After each scenario: if it fails, save a screenshot to disk
After(async function (scenario) {
    if (scenario.result?.status === 'FAILED') { 
        const scenarioName = scenario.pickle.name.replace(/\s+/g, '_'); 
        const dir = path.join('reports', 'screenshots'); 
        const filePath = path.join(dir, `${scenarioName}_FAILED.png`);

        fs.mkdirSync(dir, { recursive: true }); 

        if (this.page) {
            await this.page.screenshot({ path: filePath }); 
            console.log(`📸 Screenshot saved for failed scenario: ${filePath}`);
        }
    }

    //  Clean up: close the page and browser
    await this.page?.close();
    await this.browser?.close();
});
