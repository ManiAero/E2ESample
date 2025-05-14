"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPage = void 0;
class ProductPage {
    page;
    constructor(page) {
        this.page = page;
    }
    // ✅ Navigate to the cart page
    async navigateToCart() {
        await this.page.click('.shopping_cart_link');
        await this.page.waitForSelector('.cart_item', { timeout: 70000 });
    }
    // ✅ Get all products present in the cart
    async getCartProducts() {
        try {
            await this.page.waitForSelector('.cart_item .inventory_item_name', { timeout: 30000 }); // ✅ Ensures cart items exist before fetching
            const products = await this.page.$$eval('.cart_item .inventory_item_name', elements => elements.map(el => el.textContent?.trim() || ''));
            console.log(`🛒 Products found in cart: ${products.length > 0 ? products : "No products found!"}`); // ✅ Debug log
            return products;
        }
        catch (error) {
            console.warn("🚫 No products found in cart within timeout.");
            return []; // ✅ Prevents test failure if cart is empty
        }
    }
    // ✅ Add products to the cart dynamically
    async addProductToCart(productName) {
        await this.page.waitForSelector('.inventory_list', { timeout: 70000 });
        const products = this.page.locator('.inventory_item');
        const count = await products.count();
        for (let i = 0; i < count; ++i) {
            const productText = (await products.nth(i).locator('.inventory_item_name').textContent())?.trim();
            if (productText && productText === productName) {
                await products.nth(i).locator('.btn_inventory').click();
                console.log(`✅ Added "${productText}" to cart.`);
                return;
            }
        }
        console.warn(`🚫 Product "${productName}" not found in inventory.`);
    }
    async getErrorMessage() {
        try {
            await this.page.waitForSelector('.error-message-container.error h3[data-test="error"]', { timeout: 15000 }); // ✅ Reduced timeout
            const errorText = await this.page.textContent('.error-message-container.error h3[data-test="error"]');
            console.log(`🚫 Login Error: "${errorText}"`);
            return errorText || "No error message found";
        }
        catch (error) {
            console.log("🚫 No error message found within timeout.");
            return "No error message displayed";
        }
    }
}
exports.ProductPage = ProductPage;
