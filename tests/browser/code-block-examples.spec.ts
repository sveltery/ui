import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://127.0.0.1:5175" });

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/code-block");
  await expect(page.locator("html")).toHaveAttribute("data-ready", {
    timeout: 30_000,
  });
});

test("the Typeset example puts a numbered, highlighted code block between paragraphs", async ({
  page,
}) => {
  const typeset = page.locator(
    '[data-name="base/CodeBlockTypesetExample"] .typeset',
  );
  await expect(
    typeset.getByRole("heading", { name: "Stream a response" }),
  ).toBeVisible();
  const block = typeset.locator("[data-slot=code-block]");
  await expect(block.locator("[data-slot=code-block-title]")).toHaveText(
    "app/api/chat/route.ts",
  );
  await expect(block.locator("[data-slot=code-block-line]")).toHaveCount(8);
  await expect(
    block.locator("[data-slot=code-block-line-content] > span").first(),
  ).toHaveAttribute("style", /--shiki-light:#/);
  await expect(block.locator("xpath=following-sibling::p")).toContainText(
    "The useChat hook reads the stream",
  );
});

test("the Markdown example streams fenced code into a code block, keeps inline code inline, and copies only once the fence closes", async ({
  page,
}) => {
  const preview = page.locator('[data-name="base/CodeBlockMarkdownExample"]');
  await expect(
    preview.getByText("How do I debounce a search input in React?"),
  ).toBeVisible();
  const block = preview.locator("[data-slot=code-block]");
  await expect(block.locator("[data-slot=code-block-title]")).toHaveText("tsx");
  await expect(block.locator("[data-slot=code-block-line]")).toHaveCount(10);
  await expect(
    preview.locator("code", { hasText: "useDebounce" }).first(),
  ).toHaveClass(/bg-muted/);
  await expect(block.getByRole("button", { name: /copy/i })).toBeEnabled();

  await preview.getByRole("button", { name: "Replay" }).click();
  await expect(preview.getByRole("button", { name: "Replay" })).toBeHidden();
  const copy = preview
    .locator("[data-slot=code-block]")
    .getByRole("button", { name: /copy/i });
  await expect(copy).toBeDisabled({ timeout: 15_000 });
  await expect(copy).toBeEnabled({ timeout: 30_000 });
  await expect(
    preview.getByText(
      "Pass the debounced value to your fetch instead of the raw input.",
    ),
  ).toBeVisible({ timeout: 30_000 });
  await expect(preview.getByRole("button", { name: "Replay" })).toBeVisible();
});
