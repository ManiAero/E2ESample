"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const loginPage_1 = require("../../pageObjects/loginPage");
const dashBoard_1 = require("../../pageObjects/dashBoard");
let loginPage;
let productPage;
// ✅ Given step: Navigate to dashboard
(0, cucumber_1.Given)('I navigate to the product page with username {string} and password {string}', { timeout: 90000 }, async function (username, password) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    loginPage = new loginPage_1.LoginPage(this.page);
    productPage = new dashBoard_1.ProductPage(this.page);
    await loginPage.goTo();
    await loginPage.login(username, password);
    await this.page.waitForSelector('.inventory_list, .error-message-container.error', { timeout: 60000 });
    console.log(`✅ Attempted login as "${username}".`);
});
// ✅ When step: Add products to the cart
(0, cucumber_1.When)('I add the following products to the cart', async function (dataTable) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    const productNames = dataTable.raw().flat();
    for (const product of productNames) {
        await productPage.addProductToCart(product);
    }
});
// ✅ Then step: Navigate to the cart
(0, cucumber_1.Then)('I navigate to the cart', async function () {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    await productPage.navigateToCart();
});
// ✅ Then step: Verify products in the cart
(0, cucumber_1.Then)('I should see the following products in the cart', async function (dataTable) {
    await productPage.navigateToCart(); // ✅ Ensure cart is loaded before checking
    await this.page.waitForSelector('.cart_item', { timeout: 90000 });
    const expectedProducts = dataTable.raw().flat();
    const actualProducts = await productPage.getCartProducts();
    (0, test_1.expect)(actualProducts).toEqual(test_1.expect.arrayContaining(expectedProducts));
});
// ✅ Then step: Verify missing product in the cart
(0, cucumber_1.Then)('I should NOT see {string} in the cart', async function (productName) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    const actualProducts = await productPage.getCartProducts();
    (0, test_1.expect)(actualProducts).not.toContain(productName);
});
// ✅ Then step: Verify error message (FIXED to remove duplicate step!)
(0, cucumber_1.Then)('I should see an error message {string}', async function (expectedMessage) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }
    const actualError = await loginPage.getErrorMessage();
    (0, test_1.expect)(actualError).toContain(expectedMessage);
});
