import { test } from "../fixtures";

test.describe("Login page", () => {
  test("should login with the correct credentials", async ({ page, loginPage }) => {
    const email = "oliver@example.com";
    const username = "Oliver Smith";
    const password = "welcome";

    await page.goto("http://localhost:3000");
    await loginPage.loginAndVerifyUser({ email, username, password });
  });
});
