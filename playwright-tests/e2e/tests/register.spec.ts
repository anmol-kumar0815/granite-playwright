import { test } from "../fixtures";
import { faker } from "@faker-js/faker";

test.describe("Register page", () => {
  test("should register a user", async ({ page, loginPage }) => {
    const newUserName = faker.person.fullName();
    const newUserEmail = faker.internet.email();
    const newUserPassword = faker.internet.password();

    await page.goto("http://localhost:3000");
    await page.getByTestId("login-register-link").click();
    await page.getByTestId("signup-name-field").fill(newUserName);
    await page.getByTestId("signup-email-field").fill(newUserEmail);
    await page.getByTestId("signup-password-field").fill(newUserPassword);
    await page.getByTestId("signup-password-confirmation-field").fill(newUserPassword);
    await page.getByTestId("signup-submit-button").click();

    await loginPage.loginAndVerifyUser({ email: newUserEmail, password: newUserPassword, username: newUserName });
  });
});
