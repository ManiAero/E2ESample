"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
// Define the LoginPage class to handle login-related actions
class LoginPage {
    // Hold a reference to the current Playwright Page
    page;
    // Constructor initializes the class with a specific Page instance
    constructor(page) {
        this.page = page;
    }
    // ✅ Navigate to the login page (saucedemo)
    async goTo() {
        await this.page.goto('https://www.saucedemo.com/', { timeout: 60000 }); // Navigate to login URL
        await this.page.waitForSelector('#login-button', { timeout: 30000 }); // Wait for the login button to be visible
    }
    // ✅ Perform login using given username and password
    async login(username, password) {
        await this.page.fill('#user-name', username); // Fill in the username field
        await this.page.fill('#password', password); // Fill in the password field
        await this.page.click('#login-button'); // Click the login button
        // Wait for either inventory page OR error message after login attempt
        await this.page.waitForSelector('.inventory_list, [data-test="error"]', { timeout: 50000 });
    }
    // ✅ Get the error message shown on failed login attempts
    async getErrorMessage() {
        try {
            // Try to find the error message element (timeout: 15 seconds)
            const errorElement = await this.page.waitForSelector('.error-message-container.error h3[data-test="error"]', {
                timeout: 15000
            });
            // If element not found, warn and return default message
            if (!errorElement) {
                console.warn("🚫 No error message found in UI.");
                return "No error message displayed";
            }
            // Extract the text from the error element
            const errorText = await errorElement.textContent();
            // Log and return the cleaned error message
            console.log(`🚫 Error encountered: "${errorText?.trim()}"`);
            return errorText?.trim() || "No error message displayed";
        }
        catch (error) {
            // Catch errors like timeout or selector not found
            console.warn("🚫 Error message retrieval failed.");
            return "No error message displayed";
        }
    }
}
exports.LoginPage = LoginPage;
