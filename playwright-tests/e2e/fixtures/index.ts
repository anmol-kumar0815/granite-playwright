import { test as base } from "@playwright/test";
import { TodoPage } from './../poms/todos';
import LoginPage from "../poms/login";

interface ExtendedFixtures {
  loginPage: LoginPage,
  todoPage: TodoPage,
}

export const test = base.extend<ExtendedFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  todoPage: async ({ page }, use)=> {
    const todoPage = new TodoPage(page);
    await use(todoPage);
  },
});
