import { test } from "../fixtures";
import { STORAGE_STATE } from "../../playwright.config";

test.describe("Login page", () => {
  test("should login with the correct credentials", async ({ page, loginPage }) => {
    const email = "oliver@example.com";
    const username = "Oliver Smith";
    const password = "welcome";

    await page.goto("/");
    await loginPage.loginAndVerifyUser({ email, username, password });
    await page.context().storageState({ path: STORAGE_STATE });
  });
});
