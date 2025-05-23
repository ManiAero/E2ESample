import { Page } from '@playwright/test';

// Define the LoginPage class to handle login-related actions
export class LoginPage {
    public page: Page;

    // Constructor initializes the class with a specific Page instance
    constructor(page: Page) {
        this.page = page;
    }

    async goTo() {
        await this.page.goto('https://www.saucedemo.com/', { timeout: 60000 }); 
        await this.page.waitForSelector('#login-button', { timeout: 30000 }); 
    }

    async login(username: string, password: string) {
        await this.page.fill('#user-name', username); 
        await this.page.fill('#password', password);  
        await this.page.click('#login-button');       
        await this.page.waitForSelector('.inventory_list, [data-test="error"]', { timeout: 50000 });
    }

    //  Get the error message shown on failed login attempts
    async getErrorMessage(): Promise<string> {
        try {
            // Try to find the error message element (timeout: 15 seconds)
            const errorElement = await this.page.waitForSelector('.error-message-container.error h3[data-test="error"]', {
                timeout: 15000
            });

            // If element not found, warn and return default message
            if (!errorElement) {
                console.warn(" No error message found in UI.");
                return "No error message displayed";
            }

            // Extract the text from the error element
            const errorText = await errorElement.textContent();

            // Log and return the cleaned error message
            console.log(` Error encountered: "${errorText?.trim()}"`);
            return errorText?.trim() || "No error message displayed";

        } catch (error) {
            console.warn(" Error message retrieval failed.");
            return "No error message displayed";
        }
    }
}
