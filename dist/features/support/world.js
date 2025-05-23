"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomWorld = void 0;
// Import Cucumber's World and setWorldConstructor to define a custom context
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
//  Create a custom World class to store browser and page per scenario
class CustomWorld extends cucumber_1.World {
    // Declare the browser and page as properties available in each scenario context
    browser;
    page;
    //  Launch a browser and open a new page (usually called in a hook or step)
    async launchBrowser() {
        this.browser = await test_1.chromium.launch({ headless: false }); // Launch Chromium browser (with UI)
        this.page = await this.browser.newPage(); // Open a new browser tab
    }
    //  Gracefully close the browser (usually called in After hook)
    async closeBrowser() {
        if (this.browser) {
            await this.browser.close(); // Close the browser if it's running
        }
    }
}
exports.CustomWorld = CustomWorld;
//  Tell Cucumber to use this custom World for all scenarios
(0, cucumber_1.setWorldConstructor)(CustomWorld);
