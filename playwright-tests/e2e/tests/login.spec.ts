import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";

test.describe("Login page", () => {
  test("should login with the correct credentials", async ({ page }) => {
    const email = "oliver@example.com";
    const username = "Oliver Smith";
    const password = "welcome";
    const login = new LoginPage(page);

    await page.goto("http://localhost:3000");
    await login.loginAndVerifyUser({ email, username, password });
  });
});
