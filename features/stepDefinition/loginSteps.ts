import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pageObjects/loginPage';

let loginPage: LoginPage;

// ✅ Launch the browser
Given('I launch the browser', async function () {
    loginPage = new LoginPage(this.page); // ✅ Ensure Playwright page instance exists
});

// ✅ Navigate to login page
When('I navigate to the login page', async function () {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    await loginPage.goTo();
});

// ✅ Login step (handles both valid & invalid credentials)
When('I login with username {string} and password {string}', async function (username: string, password: string) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    await loginPage.login(username, password);
});

// ✅ Validate successful login by checking page title
Then('I should be logged in successfully', async function () {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    const pageTitle = await this.page.title();
    expect(pageTitle).toBe("Swag Labs"); // ✅ Ensure page title matches logged-in dashboard
});

// 🚫 **Removed duplicate step definition** for error message validation!  
