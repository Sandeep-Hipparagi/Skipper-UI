import { expect, test } from "playwright/test";

test("dashboard, search, preview drawer, viewport controls and copyable registry command", async ({ page, context, baseURL }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(page.getByRole("img", { name: "SKIPPER UI FOR FREE" })).toBeVisible();
  await expect(page.getByText("106 Verified", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("1 Original", { exact: false }).first()).toBeVisible();

  await page.getByPlaceholder(/Search 107 catalog slots/i).fill("skipper2");
  const card = page.locator("article, [class*=group]").filter({ hasText: "skipper2" }).first();
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Test Inline" }).click();
  await expect(page.getByText("skipper2", { exact: true }).last()).toBeVisible();

  for (const viewport of ["Desktop Frame (1024px)", "Tablet Frame (768px)", "Mobile Frame (390px)"]) {
    await page.getByTitle(viewport).click();
  }
  await page.getByTestId("copy-cli-command").click();
  await expect(page.getByTestId("copy-cli-command")).toContainText("Copied!");
  const host = new URL(baseURL!).host;
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`npx shadcn@latest add https://${host}/r/skiper2.json`);
});

test("representative preview routes mount without page or console errors", async ({ page, request, baseURL }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(message.text()); });

  for (const slug of ["skipper1", "skipper2", "skipper4", "skipper5", "skipper73", "skipper14"]) {
    const response = await request.get(new URL(`/v1/preview/${slug}`, baseURL!).toString());
    expect(response.status(), `${slug} HTTP status`).toBe(200);
    await page.goto(`/v1/preview/${slug}`);
    await expect(page.locator("#preview")).toBeVisible();
    const drawingSurface = page.locator("svg, canvas").first();
    if (await drawingSurface.count()) {
      const box = await drawingSurface.boundingBox();
      expect(box && box.width).toBeGreaterThan(0);
      expect(box && box.height).toBeGreaterThan(0);
    }
  }
  expect(runtimeErrors).toEqual([]);
});

test("remote registry index and component endpoints return populated JSON", async ({ request, baseURL }) => {
  const indexResponse = await request.get(new URL("/r/index.json", baseURL!).toString());
  expect(indexResponse.status()).toBe(200);
  const index = await indexResponse.json();
  expect(index.items).toHaveLength(106);
  expect(index.items.some((item: { name: string }) => item.name === "skiper93")).toBe(false);

  const itemResponse = await request.get(new URL("/r/skiper1.json", baseURL!).toString());
  expect(itemResponse.status()).toBe(200);
  const item = await itemResponse.json();
  expect(item).toMatchObject({ name: "skiper1", type: "registry:block" });
  expect(item.files[0].content.length).toBeGreaterThan(0);
  expect(item.dependencies).toContain("framer-motion");
});
