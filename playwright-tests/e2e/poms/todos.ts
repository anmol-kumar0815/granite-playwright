import { Page, expect } from "@playwright/test";

interface TodoName {
  todoName: string;
}

interface CreateNewTodoProps extends TodoName {
  userName?: string;
}

export class TodoPage {
  page: Page;

  constructor(page: Page){
    this.page = page;
  }

  createTodoAndVerify = async ({ newTodo, userName = "Oliver Smith", }: CreateNewTodoProps) => {
    await this.page.getByTestId("navbar-add-todo-link").click();
    await this.page.getByTestId("form-title-field").fill(newTodo);
    await this.page.locator(".css-2b097c-container").click();
    await this.page.locator(".css-26l3qy-menu").getByText(userName).click();
    await this.page.getByTestId("form-submit-button").click();
    const taskInDashboard = this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", {
        name: new RegExp(newTodo, "i"),
      });
    await taskInDashboard.scrollIntoViewIfNeeded();
    await expect(taskInDashboard).toBeVisible();
  };

  markTodoAsCompletedAndVerify = async ({ newTodo }: { newTodo: string }) => {
    await this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: newTodo })
      .getByRole("checkbox")
      .click();
    const completedTaskInDashboard = this.page
      .getByTestId("tasks-completed-table")
      .getByRole("row", { name: newTodo });
    await completedTaskInDashboard.scrollIntoViewIfNeeded();
    await expect(completedTaskInDashboard).toBeVisible();
  };

  starTodoAndVerify = async ({ newTodo }: TodoName) => {
    const starIcon = this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: newTodo })
      .getByTestId("pending-task-star-or-unstar-link");
    await starIcon.click();
    await expect(starIcon).toHaveClass(/ri-star-fill/i);
    await expect(
      this.page.getByTestId("tasks-pending-table").getByRole("row").nth(1)
    ).toContainText(newTodo);
  };
}
