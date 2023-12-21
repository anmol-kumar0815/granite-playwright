import { test } from "../fixtures";
import { expect } from '@playwright/test';
import { faker } from "@faker-js/faker";
import LoginPage from '../poms/login';
import { TodoPage } from "../poms/todos";

test.describe("Todo details page", () => {
  let newTodo: string;
  let commentByCreator: string;
  let commentByAssignee: string;

  test.beforeEach(() => {
    newTodo = faker.word.words({ count: 5 });
    commentByCreator = faker.lorem.sentence();
    commentByAssignee = faker.lorem.sentence();
  });

  test.afterEach(async ({ page, todoPage }) => {
    await page.getByTestId("tasks-pending-table")
      .getByRole("row", { name: new RegExp(newTodo, "i") })
      .getByRole("cell", { name: new RegExp(newTodo, "i") })
      .click();
    await todoPage.deleteTodoAndVerify({ todoName: newTodo });
  });

  test("should be able to add a new comment as a creator of a task", async ({ browser, page, todoPage }) => {
    await test.step("Step 1: Navigate to home page", async () => {
      await page.goto("/");
    });

    await test.step("Step 2: Create a todo and verify it", async () => {
      await todoPage.createTodoAndVerify({ newTodo, userName: "Sam Smith" });
    });

    await test.step("Step 3: Navigate to todo details page and add a comment as creator", async () => {
      await page.getByTestId("tasks-pending-table")
        .getByRole("row", { name: new RegExp(newTodo, "i") })
        .getByRole("cell", { name: new RegExp(newTodo, "i") })
        .click();

      await todoPage.addCommentAndVerify({ comment: commentByCreator });
    });

    await test.step("Step 4: Navigate to todo page and verify comment count", async () => {
      await page.getByTestId("navbar-todos-page-link").click();
      await todoPage.verifyCommentCount({ todoName: newTodo, commentCount: "1" });
    });

    await test.step("Step 6: Login as the assignee and verify todo creator comment", async () => {
      const newUserContext = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      });
      const newUserPage = await newUserContext.newPage();
      const loginPage = new LoginPage(newUserPage);
      const newUserTodoPage = new TodoPage(newUserPage);

      await newUserPage.goto("/");
      await loginPage.loginAndVerifyUser({
        email: "sam@example.com",
        password: "welcome",
        username: "Sam Smith",
      });

      await newUserTodoPage.verifyCommentCount({ todoName: newTodo, commentCount: "1" });
      await newUserPage.getByTestId("tasks-pending-table")
        .getByRole("row", { name: new RegExp(newTodo, "i") })
        .getByRole("cell", { name: new RegExp(newTodo, "i") })
        .click();
      await expect(newUserPage.getByTestId("task-comment-content")).toHaveText(commentByCreator);
      await newUserPage.close();
      await newUserContext.close();
    });
  });

  test("should be able to add a new comment as an assignee of a task", async ({ browser, page, todoPage }) => {
    await test.step("Step 1: Navigate to home page", async () => {
      await page.goto("/");
    });

    await test.step("Step 2: Create a todo and verify it", async () => {
      await todoPage.createTodoAndVerify({ newTodo, userName: "Sam Smith" });
    });

    await test.step("Step 3: Login as the assignee and add comment", async () => {
      const newUserContext = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      });
      const newUserPage = await newUserContext.newPage();
      const loginPage = new LoginPage(newUserPage);
      const newUserTodoPage = new TodoPage(newUserPage);

      await newUserPage.goto("/");
      await loginPage.loginAndVerifyUser({
        email: "sam@example.com",
        password: "welcome",
        username: "Sam Smith",
      });

      await newUserPage.getByTestId("tasks-pending-table")
        .getByRole("row", { name: new RegExp(newTodo, "i") })
        .getByRole("cell", { name: new RegExp(newTodo, "i") })
        .click();
      await newUserTodoPage.addCommentAndVerify({ comment: commentByAssignee });
      await newUserPage.getByTestId("navbar-todos-page-link").click();
      await newUserTodoPage.verifyCommentCount({ todoName: newTodo, commentCount: "1" });
      await newUserPage.close();
      await newUserContext.close();
    });

    await test.step("Step 4: Verify comment as a creator of the todo", async () => {
      await page.reload();
      await todoPage.verifyCommentCount({ todoName: newTodo, commentCount: "1" });
      await page.getByTestId("tasks-pending-table")
        .getByRole("row", { name: new RegExp(newTodo, "i") })
        .getByRole("cell", { name: new RegExp(newTodo, "i") })
        .click();
      await expect(page.getByTestId("task-comment-content").first()).toHaveText(commentByAssignee);
      await page.getByTestId("navbar-todos-page-link").click();
    });
  });
});
