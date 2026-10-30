import { chromium } from "playwright";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const output = path.join(os.tmpdir(), "skipper-ui-audit");

async function makeContext(browser) {
  return browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--enable-webgl"] });
  let context = await makeContext(browser);
  let inContext = 0;
  const results = [];

  try {
    for (let n = 1; n <= 107; n++) {
      const id = `skipper${n}`;
      if (inContext === 8) {
        await context.close();
        context = await makeContext(browser);
        inContext = 0;
      }

      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
      });
      await page.addInitScript(() => {
        window.addEventListener("unhandledrejection", (event) => {
          console.error("unhandledrejection:", event.reason);
        });
      });

      try {
        const response = await page.goto(`${baseUrl}/v1/preview/${id}`, { waitUntil: "domcontentloaded", timeout: 20000 });
        if (response?.status() !== 200) errors.push(`HTTP ${response?.status() ?? "no response"}`);
        await page.waitForTimeout(500);
        const visibleElements = await page.locator("#preview *:visible").count();
        if (visibleElements < 2) errors.push(`Only ${visibleElements} visible preview descendants`);
        await page.screenshot({ path: path.join(output, `${id}.png`), fullPage: false });
      } catch (error) {
        errors.push(`navigation/audit: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        const visibleElements = await page.locator("#preview *:visible").count().catch(() => 0);
        results.push({ id, status: errors.length ? "fail" : "pass", errors, visibleElements });
        console.log(`${errors.length ? "FAIL" : "PASS"} ${id}${errors.length ? `: ${errors.join(" | ")}` : ""}`);
        await page.close();
        inContext++;
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  await fs.writeFile(path.join(output, "report.json"), JSON.stringify(results, null, 2));
  const pass = results.filter((result) => result.status === "pass").length;
  const fail = results.filter((result) => result.status === "fail").length;
  console.log(`\n${pass} passed, ${fail} failed. Report and screenshots: ${output}`);
  if (fail) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
