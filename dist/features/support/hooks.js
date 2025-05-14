"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
let browser;
let page;
(0, cucumber_1.Before)(async function () {
    browser = await test_1.chromium.launch({ headless: false });
    page = await browser.newPage();
    this.browser = browser; // ✅ Store browser instance
    this.page = page; // ✅ Store page instance
});
(0, cucumber_1.After)(async function () {
    await page.close();
    await browser.close();
});
