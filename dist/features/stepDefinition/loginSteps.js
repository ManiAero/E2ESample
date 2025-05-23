"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const loginPage_1 = require("../../pageObjects/loginPage");
// Declare loginPage variable so it can be reused across steps
let loginPage;
//  Step 1: Launch the browser and create LoginPage instance
(0, cucumber_1.Given)('I launch the browser', async function () {
    loginPage = new loginPage_1.LoginPage(this.page); // Use the shared page from CustomWorld
});
//  Step 2: Navigate to the login page
(0, cucumber_1.When)('I navigate to the login page', async function () {
    if (!this.page) {
        throw new Error(" Page instance not initialized."); // Guard clause for safety
    }
    await loginPage.goTo(); // Call method from LoginPage to load the login screen
});
//  Step 3: Perform login with dynamic credentials
(0, cucumber_1.When)('I login with username {string} and password {string}', async function (username, password) {
    if (!this.page) {
        throw new Error(" Page instance not initialized."); // Ensure page is available
    }
    await loginPage.login(username, password); // Call login with provided credentials
});
//  Step 4: Validate successful login by checking the page title
(0, cucumber_1.Then)('I should be logged in successfully', async function () {
    if (!this.page) {
        throw new Error(" Page instance not initialized."); // Ensure page is available
    }
    const pageTitle = await this.page.title(); // Get the current page title
    (0, test_1.expect)(pageTitle).toBe("Swag Labs"); // Assert it matches expected title
});
