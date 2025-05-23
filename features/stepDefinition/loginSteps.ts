import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pageObjects/loginPage';

// Declare loginPage variable so it can be reused across steps
let loginPage: LoginPage;

Given('I launch the browser', async function () {
    loginPage = new LoginPage(this.page); 
});

When('I navigate to the login page', async function () {
    if (!this.page) {
        throw new Error(" Page instance not initialized."); 
    }
    await loginPage.goTo(); 
});

When('I login with username {string} and password {string}', async function (username: string, password: string) {
    if (!this.page) {
        throw new Error(" Page instance not initialized."); 
    }
    await loginPage.login(username, password); 
});

Then('I should be logged in successfully', async function () {
    if (!this.page) {
        throw new Error(" Page instance not initialized."); 
    }
    const pageTitle = await this.page.title();           
    expect(pageTitle).toBe("Swag Labs");                
});
