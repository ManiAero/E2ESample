"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
class LoginPage {
    page;
    constructor(page) {
        this.page = page;
    }
    // ✅ Navigate to the login page
    async goTo() {
        await this.page.goto('https://www.saucedemo.com/', { timeout: 60000 });
        await this.page.waitForSelector('#login-button', { timeout: 30000 });
    }
    // ✅ Perform login with proper validation
    async login(username, password) {
        await this.page.fill('#user-name', username);
        await this.page.fill('#password', password);
        await this.page.click('#login-button');
        await this.page.waitForSelector('.inventory_list, [data-test="error"]', { timeout: 50000 });
    }
    // ✅ Extract error message from UI after failed login
    async getErrorMessage() {
        await this.page.waitForSelector('[data-test="error"]', { timeout: 30000 });
        return this.page.textContent('[data-test="error"]');
    }
}
exports.LoginPage = LoginPage;
