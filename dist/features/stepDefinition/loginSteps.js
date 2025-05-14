"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const loginPage_1 = require("../../pageObjects/loginPage");
let loginPage;
// ✅ Launch the browser
(0, cucumber_1.Given)('I launch the browser', async function () {
    loginPage = new loginPage_1.LoginPage(this.page); // ✅ Ensure Playwright page instance exists
});
// ✅ Navigate to login page
(0, cucumber_1.When)('I navigate to the login page', async function () {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    await loginPage.goTo();
});
// ✅ Login step (handles both valid & invalid credentials)
(0, cucumber_1.When)('I login with username {string} and password {string}', async function (username, password) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    await loginPage.login(username, password);
});
// ✅ Validate successful login by checking page title
(0, cucumber_1.Then)('I should be logged in successfully', async function () {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    const pageTitle = await this.page.title();
    (0, test_1.expect)(pageTitle).toBe("Swag Labs"); // ✅ Ensure page title matches logged-in dashboard
});
// 🚫 **Removed duplicate step definition** for error message validation!  
