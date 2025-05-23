import { Page } from '@playwright/test';

// Define a class to encapsulate interactions with the product-related functionality
export class ProductPage {
    // Hold a reference to the current browser page
    public page: Page;

    // Constructor initializes the class with the current Page instance
    constructor(page: Page) {
        this.page = page;
    }

    //  Navigate to the shopping cart page
    async navigateToCart() {
        await this.page.click('.shopping_cart_link'); 
        await this.page.waitForSelector('.cart_item', { timeout: 70000 }); 
    }

    //  Get a list of all product names currently in the cart
    async getCartProducts(): Promise<string[]> {
        try {
            await this.page.waitForSelector('.cart_item .inventory_item_name', { timeout: 30000 });
            const products = await this.page.$$eval('.cart_item .inventory_item_name', elements =>
                elements.map(el => el.textContent?.trim() || '')
            );
            console.log(`🛒 Products found in cart: ${products.length > 0 ? products : "No products found!"}`);

            return products;
        } catch (error) {
            console.warn(" No products found in cart within timeout.");
            return [];
        }
    }

    async addProductToCart(productName: string) {
        await this.page.waitForSelector('.inventory_list', { timeout: 70000 });

        const products = this.page.locator('.inventory_item');
        const count = await products.count(); 

        // Loop through each product
        for (let i = 0; i < count; ++i) {
            // Get the name of the current product
            const productText = (await products.nth(i).locator('.inventory_item_name').textContent())?.trim();

            // If the name matches the one we're looking for
            if (productText && productText === productName) {
                // Click the "Add to cart" button for that product
                await products.nth(i).locator('.btn_inventory').click();

                // Log a success message
                console.log(` Added "${productText}" to cart.`);
                return;
            }
        }

        // If no matching product is found, log a warning
        console.warn(` Product "${productName}" not found in inventory.`);
    }

    async getErrorMessage(): Promise<string> {
        try {
            await this.page.waitForSelector('.error-message-container.error h3[data-test="error"]', { timeout: 15000 });

            const errorText = await this.page.textContent('.error-message-container.error h3[data-test="error"]');

            console.log(` Login Error: "${errorText}"`);

            return errorText || "No error message found";
        } catch (error) {
            console.log(" No error message found within timeout.");
            return "No error message displayed";
        }
    }
}
