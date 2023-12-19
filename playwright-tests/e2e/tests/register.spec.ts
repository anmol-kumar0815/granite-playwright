import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";

test.describe("Register page", () => {
  test("should register a user", async ({ page }) => {
    const newUserName = faker.person.fullName();
    const newUserEmail = faker.internet.email();
    const newUserPassword = faker.internet.password();
    const login = new LoginPage(page);

    await page.goto("http://localhost:3000");
    await page.getByTestId("login-register-link").click();
    await page.getByTestId("signup-name-field").fill(newUserName);
    await page.getByTestId("signup-email-field").fill(newUserEmail);
    await page.getByTestId("signup-password-field").fill(newUserPassword);
    await page.getByTestId("signup-password-confirmation-field").fill(newUserPassword);
    await page.getByTestId("signup-submit-button").click();

    await login.loginAndVerifyUser({ email: newUserEmail, password: newUserPassword, username: newUserName });
  });
});
