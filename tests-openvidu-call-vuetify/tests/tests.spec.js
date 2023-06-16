// @ts-check
const { test, expect } = require('@playwright/test');
const ROUTE = 'http://127.0.0.1:3000/';
const ROOM_NAME = "Sala-de-prueba";

// test.before(async ({ context }) => {
//     // Runs before each test and signs in each page.
//     await context.grantPermissions(['camera', 'microphone']);
//   });

test('end-to-end', async ({ context }) => {
    await context.grantPermissions(['camera', 'microphone']);

    const pageOne = await context.newPage();
    await pageOne.goto(ROUTE);

    // Put credentials
    await pageOne.getByLabel("Username").fill("admin");
    await pageOne.getByLabel("Password").fill("MY_SECRET");
    await pageOne.getByText("LOGIN").click();

    // Enter room
    await pageOne.getByLabel("Session Name").fill(ROOM_NAME);
    await pageOne.getByText("JOIN").click();

    // Enter call
    await pageOne.waitForURL(ROUTE + ROOM_NAME);
    await pageOne.getByText("JOIN SESSION").click();

    // Duplicate screen and join call
    const pageTwo = await context.newPage();
    await pageTwo.goto(ROUTE + ROOM_NAME); // Because we already log in the other user will not need to check credentials
    await pageTwo.getByText("JOIN SESSION").click();

    // Check number of subscribers when user 2 has been loaded waiting for a preventive time
    await pageOne.waitForTimeout(5000);
    var numberOfSubscribers = await pageOne.evaluate(() => {
      const subscriberElements = document.querySelectorAll('.OT_root.OT_subscriber');
      return subscriberElements.length;
    });
    await expect(numberOfSubscribers).toBe(1);

    // Disconect second user
    await pageTwo.getByTestId("leave-session-button").click();

    // Wait time and check
    await pageOne.waitForTimeout(5000);
    var numberOfSubscribers = await pageOne.evaluate(() => {
      const subscriberElements = document.querySelectorAll('.OT_root.OT_subscriber');
      return subscriberElements.length;
    });
    await expect(numberOfSubscribers).toBe(0);

    // User two checks to exit the user session and check that is in the login page
    await pageTwo.getByTestId("logout-button").click();
    await pageOne.getByText("LOGIN");

});

test('login text fields check', async({page, context}) => {
    await page.goto(ROUTE);
    // Check login button is not active
    await expect(page.getByText("LOGIN")).toBeDisabled();

    // Check with only one the same button does not work
    await page.getByLabel("Username").fill("admin");
    await expect(page.getByText("LOGIN")).toBeDisabled();

    await page.getByLabel("Username").fill("");
    await page.getByLabel("Password").fill("MY_SECRET");
    await expect(page.getByText("LOGIN")).toBeDisabled();

    // Checks wrong credentials
    await expect(page.getByText('Authentication failed. Try again.')).not.toBeVisible();
    await page.getByLabel("Username").fill("adminWrong");
    await page.getByLabel("Password").fill("MY_SECRET");
    await page.getByText("LOGIN").click();

    await expect(page.getByText('Authentication failed. Try again.')).toBeVisible();

    // Put correct credentials
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password").fill("MY_SECRET");
    await page.getByText("LOGIN").click();

    // And it passes to the Join screen
    await expect(page.getByText("JOIN")).toBeVisible();

});
