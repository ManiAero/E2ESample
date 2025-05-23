"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
// Node.js modules for file system operations
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Declare browser and page globally so they're accessible in hooks
let browser;
let page;
//  Before each scenario: launch the browser and create a new page
(0, cucumber_1.Before)(async function () {
    browser = await test_1.chromium.launch({ headless: false }); // Launch the browser (headless: false = UI visible)
    page = await browser.newPage(); // Open a new browser tab (page)
    this.browser = browser; // Store in Cucumber's World context
    this.page = page;
});
//  After each step: capture and attach a screenshot to the Cucumber report
(0, cucumber_1.AfterStep)(async function (step) {
    if (this.page) {
        const screenshot = await this.page.screenshot(); // Take a screenshot
        this.attach(screenshot, 'image/png'); // Attach it to the Cucumber report
        console.log("📸 Screenshot attached to Cucumber report.");
    }
});
//  After each scenario: if it fails, save a screenshot to disk
(0, cucumber_1.After)(async function (scenario) {
    if (scenario.result?.status === 'FAILED') { // Check if the scenario failed
        const scenarioName = scenario.pickle.name.replace(/\s+/g, '_'); // Format scenario name for file name
        const dir = path_1.default.join('reports', 'screenshots'); // Define directory for saving screenshots
        const filePath = path_1.default.join(dir, `${scenarioName}_FAILED.png`);
        fs_1.default.mkdirSync(dir, { recursive: true }); // Ensure the directory exists
        if (this.page) {
            await this.page.screenshot({ path: filePath }); // Save screenshot to file
            console.log(`📸 Screenshot saved for failed scenario: ${filePath}`);
        }
    }
    //  Clean up: close the page and browser
    await this.page?.close();
    await this.browser?.close();
});
