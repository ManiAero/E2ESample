import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pageObjects/loginPage';
import { ProductPage } from '../../pageObjects/dashBoard';

let loginPage: LoginPage;
let productPage: ProductPage;

// ✅ Given step: Navigate to dashboard


Given('I navigate to the product page with username {string} and password {string}', { timeout: 90000 }, async function (username: string, password: string) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }

    loginPage = new LoginPage(this.page);
    productPage = new ProductPage(this.page);

    await loginPage.goTo();
    await loginPage.login(username, password);
    await this.page.waitForSelector('.inventory_list, .error-message-container.error', { timeout: 60000 });

    console.log(`✅ Attempted login as "${username}".`);
});



// ✅ When step: Add products to the cart
When('I add the following products to the cart', async function (dataTable) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }

    const productNames: string[] = dataTable.raw().flat();
    for (const product of productNames) {
        await productPage.addProductToCart(product);
    }
});

// ✅ Then step: Navigate to the cart
Then('I navigate to the cart', async function () {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }

    await productPage.navigateToCart();
});

// ✅ Then step: Verify products in the cart

Then('I should see the following products in the cart', async function (dataTable) {
    await productPage.navigateToCart();  // ✅ Ensure cart is loaded before checking
    await this.page.waitForSelector('.cart_item', { timeout: 90000 });

    const expectedProducts = dataTable.raw().flat();
    const actualProducts = await productPage.getCartProducts();

    expect(actualProducts).toEqual(expect.arrayContaining(expectedProducts));
});


// ✅ Then step: Verify missing product in the cart
Then('I should NOT see {string} in the cart', async function (productName: string) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }

    const actualProducts = await productPage.getCartProducts();
    expect(actualProducts).not.toContain(productName);
});

// ✅ Then step: Verify error message (FIXED to remove duplicate step!)
Then('I should see an error message {string}', async function (expectedMessage) {
    if (!this.page) {
        throw new Error("❌ Page instance not initialized.");
    }

    const actualError = await loginPage.getErrorMessage();
    expect(actualError).toContain(expectedMessage);
});
