"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomWorld = void 0;
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
class CustomWorld extends cucumber_1.World {
    browser;
    page;
    async launchBrowser() {
        this.browser = await test_1.chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
    }
    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
exports.CustomWorld = CustomWorld;
(0, cucumber_1.setWorldConstructor)(CustomWorld);
