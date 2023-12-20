import { faker } from '@faker-js/faker';
import { test } from "../fixtures";
import { expect } from '@playwright/test';

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
    await page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: newTodo })
      .getByRole("checkbox")
      .click();
    const completedTaskInDashboard = page
      .getByTestId("tasks-completed-table")
      .getByRole("row", { name: newTodo });
    await completedTaskInDashboard.scrollIntoViewIfNeeded();
    await expect(completedTaskInDashboard).toBeVisible();
  });
});
