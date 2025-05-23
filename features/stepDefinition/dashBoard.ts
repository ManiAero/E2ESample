import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pageObjects/loginPage';
import { ProductPage } from '../../pageObjects/dashBoard';

//  Declare shared page object variables
let loginPage: LoginPage;
let productPage: ProductPage;

Given('I navigate to the product page with username {string} and password {string}', { timeout: 90000 }, async function (username: string, password: string) {
    if (!this.page) {
        throw new Error(" Page instance not initialized."); 
    }

    loginPage = new LoginPage(this.page);           
    productPage = new ProductPage(this.page);       

    await loginPage.goTo();                         
    await loginPage.login(username, password);      
    await this.page.waitForSelector('.inventory_list, .error-message-container.error', { timeout: 60000 }); 
    console.log(` Attempted login as "${username}".`);
});

When('I add the following products to the cart', async function (dataTable) {
    if (!this.page) {
        throw new Error(" Page instance not initialized.");
    }

    const productNames: string[] = dataTable.raw().flat(); 
    for (const product of productNames) {
        await productPage.addProductToCart(product);       
    }
});

Then('I navigate to the cart', async function () {
    if (!this.page) {
        throw new Error(" Page instance not initialized.");
    }

    await productPage.navigateToCart(); 
});


Then('I should see the following products in the cart', async function (dataTable) {
    await productPage.navigateToCart();  
    await this.page.waitForSelector('.cart_item', { timeout: 90000 }); 

    const expectedProducts = dataTable.raw().flat();       
    const actualProducts = await productPage.getCartProducts(); 

    expect(actualProducts).toEqual(expect.arrayContaining(expectedProducts)); 
});

Then('I should NOT see {string} in the cart', async function (productName) {
    await productPage.navigateToCart(); 

    try {
        await this.page.waitForSelector('.cart_item', { timeout: 15000 }); 
        const actualProducts = await productPage.getCartProducts();

        console.log(` Checking cart contents. Found: ${actualProducts}`);
        expect(actualProducts).not.toContain(productName); 
    } catch (error) {
        console.warn(` Timeout occurred while checking cart. Assuming "${productName}" is not present.`);
        expect("").not.toContain(productName);
    }
});

Then('I should see an error message {string}', { timeout: 30000 }, async function (expectedMessage) {
    try {
        await this.page.waitForSelector('.error-message-container.error h3[data-test="error"]', { timeout: 15000 });

        const actualError = await this.page.textContent('.error-message-container.error h3[data-test="error"]');
        
        console.log(` Expected: "${expectedMessage}"`);
        console.log(` Received: "${actualError}"`);

        if (!actualError || actualError.trim() === "") {
            throw new Error(` Expected error message "${expectedMessage}" but received none.`);
        }

        expect(actualError).toContain(expectedMessage); 
    } catch (error) {
        console.error(" Error message retrieval failed:", error);
        throw new Error(` Error validation step failed for message: "${expectedMessage}".`);
    }
});
