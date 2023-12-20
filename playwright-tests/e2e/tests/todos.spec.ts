import { faker } from '@faker-js/faker';
import { test } from "../fixtures";
import { expect } from '@playwright/test';
import LoginPage from '../poms/login';

test.describe("Todo page", () => {
  let newTodo: string;

  test.beforeEach(() => {
    newTodo = faker.word.words({ count: 5 });
  });

  test("should add a new todo with creator as the assignee", async ({ page, todoPage }) => {
    await page.goto("/");
    await todoPage.createTodoAndVerify({ newTodo });
  })

  test("should be able to mark a task as completed", async ({
    page,
    loginPage,
    todoPage,
  }) => {
    await page.goto("/");
    await todoPage.createTodoAndVerify({ newTodo });
    await todoPage.markTodoAsCompletedAndVerify({ newTodo });
  });

  test("should be able to delete a completed todo", async ({
    page,
    todoPage,
  }) => {
    await page.goto("/");
    await todoPage.createTodoAndVerify({ newTodo });
    await todoPage.markTodoAsCompletedAndVerify({ newTodo });
    const completedTaskInDashboard = page
      .getByTestId("tasks-completed-table")
      .getByRole("row", { name: newTodo });

    await completedTaskInDashboard
      .getByTestId("completed-task-delete-link")
      .click();

    await expect(completedTaskInDashboard).toBeHidden();
    await expect(
      page
        .getByTestId("tasks-pending-table")
        .getByRole("row", { name: newTodo })
    ).toBeHidden();
  });

  test.describe("Starring tasks feature", () => {
    test.describe.configure({ mode: "serial" });

    test("should be able to star a pending todo", async ({ page, todoPage }) => {
      page.goto("/");
      await todoPage.createTodoAndVerify({ newTodo });
      await todoPage.starTodoAndVerify({ newTodo });
    });
  });

  test("should be able to un-star a pending todo", async ({
    page,
    todoPage,
  }) => {
    page.goto("/");
    await todoPage.createTodoAndVerify({ newTodo });
    await todoPage.starTodoAndVerify({ newTodo });
    const starIcon = page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: newTodo })
      .getByTestId("pending-task-star-or-unstar-link");
    await starIcon.click();
    await expect(starIcon).toHaveClass(/ri-star-line/);
  });

  test("should create a new todo with a different user as the assignee", async ({
    page,
    browser,
    todoPage,
  }) => {
    await page.goto("/");
    await todoPage.createTodoAndVerify({ newTodo, userName: "Sam Smith" });

    // Creating a new browser context and a page in the browser without restoring the session
    const newUserContext = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const newUserPage = await newUserContext.newPage();

    // Initializing the login POM here because the fixture is configured to use the default page context
    const loginPage = new LoginPage(newUserPage);

    await newUserPage.goto("/");
    await loginPage.loginAndVerifyUser({
      email: "sam@example.com",
      password: "welcome",
      username: "Sam Smith",
    });
    await expect(
      newUserPage
        .getByTestId("tasks-pending-table")
        .getByRole("row", { name: newTodo })
    ).toBeVisible();

    await newUserPage.close();
    await newUserContext.close();
  });
});
