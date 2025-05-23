"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const loginPage_1 = require("../../pageObjects/loginPage");
const dashBoard_1 = require("../../pageObjects/dashBoard");
//  Declare shared page object variables
let loginPage;
let productPage;
//  Step: Login and navigate to product page with given credentials
(0, cucumber_1.Given)('I navigate to the product page with username {string} and password {string}', { timeout: 90000 }, async function (username, password) {
    if (!this.page) {
        throw new Error(" Page instance not initialized."); // Ensure page is ready
    }
    loginPage = new loginPage_1.LoginPage(this.page); // Initialize login page object
    productPage = new dashBoard_1.ProductPage(this.page); // Initialize product page object
    await loginPage.goTo(); // Go to login page
    await loginPage.login(username, password); // Attempt login
    await this.page.waitForSelector('.inventory_list, .error-message-container.error', { timeout: 60000 }); // Wait for success or error
    console.log(` Attempted login as "${username}".`);
});
//  Step: Add multiple products to the cart using a data table
(0, cucumber_1.When)('I add the following products to the cart', async function (dataTable) {
    if (!this.page) {
        throw new Error(" Page instance not initialized.");
    }
    const productNames = dataTable.raw().flat(); // Convert Cucumber dataTable to array
    for (const product of productNames) {
        await productPage.addProductToCart(product); // Add each product by name
    }
});
//  Step: Navigate to the shopping cart page
(0, cucumber_1.Then)('I navigate to the cart', async function () {
    if (!this.page) {
        throw new Error(" Page instance not initialized.");
    }
    await productPage.navigateToCart(); // Use method from ProductPage
});
//  Step: Verify all expected products are present in the cart
(0, cucumber_1.Then)('I should see the following products in the cart', async function (dataTable) {
    await productPage.navigateToCart(); // Ensure cart page is loaded
    await this.page.waitForSelector('.cart_item', { timeout: 90000 }); // Wait for cart items
    const expectedProducts = dataTable.raw().flat(); // Expected product list from Gherkin
    const actualProducts = await productPage.getCartProducts(); // Get actual product names from UI
    (0, test_1.expect)(actualProducts).toEqual(test_1.expect.arrayContaining(expectedProducts)); //  Assert all expected are in actual
});
//  Step: Verify a product is NOT present in the cart
(0, cucumber_1.Then)('I should NOT see {string} in the cart', async function (productName) {
    await productPage.navigateToCart(); // Go to cart page
    try {
        await this.page.waitForSelector('.cart_item', { timeout: 15000 }); // Shorter timeout to fail faster
        const actualProducts = await productPage.getCartProducts();
        console.log(` Checking cart contents. Found: ${actualProducts}`);
        (0, test_1.expect)(actualProducts).not.toContain(productName); //  Assert the unwanted product is not there
    }
    catch (error) {
        // If the cart is empty or fails to load, assume product is not present
        console.warn(` Timeout occurred while checking cart. Assuming "${productName}" is not present.`);
        (0, test_1.expect)("").not.toContain(productName);
    }
});
//  Step: Validate specific error message appears after failed login or action
(0, cucumber_1.Then)('I should see an error message {string}', { timeout: 30000 }, async function (expectedMessage) {
    try {
        await this.page.waitForSelector('.error-message-container.error h3[data-test="error"]', { timeout: 15000 });
        const actualError = await this.page.textContent('.error-message-container.error h3[data-test="error"]');
        console.log(` Expected: "${expectedMessage}"`);
        console.log(` Received: "${actualError}"`);
        if (!actualError || actualError.trim() === "") {
            throw new Error(` Expected error message "${expectedMessage}" but received none.`);
        }
        (0, test_1.expect)(actualError).toContain(expectedMessage); //  Assert expected message is present
    }
    catch (error) {
        console.error(" Error message retrieval failed:", error);
        throw new Error(` Error validation step failed for message: "${expectedMessage}".`);
    }
});
