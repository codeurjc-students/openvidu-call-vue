// @ts-check
const { test, expect } = require('@playwright/test');
const ROUTE = 'http://127.0.0.1:3000/';
const ROOM_NAME = "Sala-de-prueba";

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

test('room name functionality', async({page, context}) => {
  await page.goto(ROUTE);

  // Put credentials to go to the room name page
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("MY_SECRET");
  await page.getByText("LOGIN").click();

  // Checks generate name fuction  
  // Wait for the value ready in the text field of room name
  const inputElement = await page.getByLabel("Session Name");
  var roomName1 = await inputElement.inputValue();

  await page.getByTestId("generate-name").click();

  var roomName2 = await inputElement.inputValue();
  await expect(roomName1).not.toBe(roomName2);

  // Checks room name validation: room name too short
  await inputElement.fill("short");
  await page.getByText("JOIN").click();
  await expect(page.getByText('Session name is too short!')).toBeVisible();

  // Checks room name validation: room name required
  await inputElement.fill("");
  await page.getByText("JOIN").click();
  await expect(page.getByText("Session name is required")).toBeVisible();

  // And it passes to the next screen
  await inputElement.fill(ROOM_NAME);
  await page.getByText("JOIN").click();
  await page.waitForURL(ROUTE + ROOM_NAME);
  await expect(page.getByText("JOIN SESSION")).toBeVisible();

});

test('options functionality', async({page, context}) => {
  // Grant permisions
  await context.grantPermissions(['camera', 'microphone']);

  // Pass for every 
  await page.goto(ROUTE);

  // Put credentials
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("MY_SECRET");
  await page.getByText("LOGIN").click();

  // Enter room
  await page.getByText("JOIN").click();
  await page.getByLabel('Nickname').fill('Nombre de prueba');

  // Check that each list is selectable and has a number of cameras and microphones
  // This test will only work if there is at least a camera and microphone conected
  // Cameras
  await page.getByRole('textbox').filter({ hasText: 'Video device' }).click();
  var promiseCamerasItems = page.getByRole('listbox').locator('div').allTextContents();
  var cameraItems = await promiseCamerasItems;

  // Filter the items based on their names
  const filteredCameras = cameraItems.filter((item, index) => {
    return cameraItems.indexOf(item) === index && item != '';
  });

  var numberOfCameras = filteredCameras.length;
  await expect(numberOfCameras).toBeGreaterThan(0);
  await page.getByRole('listbox').locator('div').last().click();


  // Microphones
  await page.getByRole('textbox').filter({ hasText: 'Audio device' }).click();
  var promiseMicrophonesItems = page.getByRole('listbox').locator('div').allTextContents();
  var microphonesItems = await promiseMicrophonesItems;
  // Filter the items based on their names
  const filteredMicrophones = microphonesItems.filter((item, index) => {
    return microphonesItems.indexOf(item) === index && item != '' && !cameraItems.includes(item);
  });

  var numberOfMicrophones = filteredMicrophones.length;
  await expect(numberOfMicrophones).toBeGreaterThan(0);
  await page.getByRole('listbox').locator('div').last().click();
});

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
