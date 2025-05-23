"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPage = void 0;
// Define a class to encapsulate interactions with the product-related functionality
class ProductPage {
    // Hold a reference to the current browser page
    page;
    // Constructor initializes the class with the current Page instance
    constructor(page) {
        this.page = page;
    }
    // ✅ Navigate to the shopping cart page
    async navigateToCart() {
        await this.page.click('.shopping_cart_link'); // Click the cart icon
        await this.page.waitForSelector('.cart_item', { timeout: 70000 }); // Wait until at least one cart item is loaded
    }
    // ✅ Get a list of all product names currently in the cart
    async getCartProducts() {
        try {
            // Wait for cart items to appear (timeout after 30 seconds)
            await this.page.waitForSelector('.cart_item .inventory_item_name', { timeout: 30000 });
            // Extract the text content (product names) from all matched elements
            const products = await this.page.$$eval('.cart_item .inventory_item_name', elements => elements.map(el => el.textContent?.trim() || ''));
            // Log the found products for debugging
            console.log(`🛒 Products found in cart: ${products.length > 0 ? products : "No products found!"}`);
            return products;
        }
        catch (error) {
            // If products are not found within timeout, log and return an empty array
            console.warn("🚫 No products found in cart within timeout.");
            return [];
        }
    }
    // ✅ Add a product to the cart by name (used in dynamic tests)
    async addProductToCart(productName) {
        // Wait for the inventory list to load
        await this.page.waitForSelector('.inventory_list', { timeout: 70000 });
        // Select all product containers on the page
        const products = this.page.locator('.inventory_item');
        const count = await products.count(); // Get the total number of products
        // Loop through each product
        for (let i = 0; i < count; ++i) {
            // Get the name of the current product
            const productText = (await products.nth(i).locator('.inventory_item_name').textContent())?.trim();
            // If the name matches the one we're looking for
            if (productText && productText === productName) {
                // Click the "Add to cart" button for that product
                await products.nth(i).locator('.btn_inventory').click();
                // Log a success message
                console.log(`✅ Added "${productText}" to cart.`);
                return;
            }
        }
        // If no matching product is found, log a warning
        console.warn(`🚫 Product "${productName}" not found in inventory.`);
    }
    // ✅ Get the error message displayed (used mainly for login failures or invalid operations)
    async getErrorMessage() {
        try {
            // Wait for the error message to appear (shorter timeout)
            await this.page.waitForSelector('.error-message-container.error h3[data-test="error"]', { timeout: 15000 });
            // Extract the text content of the error message
            const errorText = await this.page.textContent('.error-message-container.error h3[data-test="error"]');
            // Log the error message
            console.log(`🚫 Login Error: "${errorText}"`);
            return errorText || "No error message found";
        }
        catch (error) {
            // If no error message is found in time, log it
            console.log("🚫 No error message found within timeout.");
            return "No error message displayed";
        }
    }
}
exports.ProductPage = ProductPage;
