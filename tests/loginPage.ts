import { test, Page } from '@playwright/test';

test("End to End test", async ({ page }) => {  // Corrected async function signature

    await page.goto("https://www.saucedemo.com/");

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // const actualError = await page.getErrorMessage();
    // expect(actualError).toContain(expectedMessage);

    const products = page.locator('.inventory_list');
    const productName = "Sauce Labs Bolt T-Shirt";

    const count = await products.count();

    for (let i=0; i<count;  ++i){

       if(await products.nth(i).locator("a").textContent() === productName )
       {
        await products.nth(i).locator("text=Add to cart").click();
        break;
       }

    }


});
