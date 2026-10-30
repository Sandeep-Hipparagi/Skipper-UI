import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

interface AuditResult {
  id: string;
  status: "pass" | "fail" | "skipped";
  durationMs: number;
  thumbnailPath?: string;
  errors: string[];
}

const CONFIG = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  outputDir: path.resolve(process.cwd(), "public/thumbnails"),
  viewport: { width: 1440, height: 810 },
  deviceScaleFactor: 1.5,
  settleTimeoutMs: 900,
  actionTimeoutMs: 8000,
  contextRecycleThreshold: 8, // Recycle context every 8 routes to evade Chromium 16-WebGL-limit
  totalCount: 107,
};

async function createFreshContext(browser: Browser): Promise<BrowserContext> {
  return await browser.newContext({
    viewport: CONFIG.viewport,
    deviceScaleFactor: CONFIG.deviceScaleFactor,
    colorScheme: "dark", // Matches Skipper UI default preview palette
    ignoreHTTPSErrors: true,
  });
}

async function auditAndCapture(
  page: Page,
  id: string,
  title: string,
  collection: string,
): Promise<AuditResult> {
  const startTime = Date.now();
  const errors: string[] = [];

  page.on("pageerror", (err) => errors.push(`[PageError] ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`[ConsoleError] ${msg.text()}`);
    }
  });

  const url = `${CONFIG.baseUrl}/v1/preview/${id}`;
  const thumbnailFilename = `${id}.webp`;
  const absoluteOutPath = path.join(CONFIG.outputDir, thumbnailFilename);

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: CONFIG.actionTimeoutMs,
    });

    if (!response || response.status() !== 200) {
      throw new Error(`HTTP ${response?.status() ?? "No Response"}`);
    }

    // Wait for the client-only primitive to mount before decorating its thumbnail.
    await page.waitForSelector("#preview", { state: "visible", timeout: 3000 });

    // Gentle pointer movement wakes hover-driven previews without covering their center.
    await page.mouse.move(72, 72);
    await page.mouse.move(88, 82);

    // 3. Animation Settle Delay (Ensures keyframes and spring physics finish loading)
    await page.waitForTimeout(CONFIG.settleTimeoutMs);

    await page.evaluate(({ number, title, collection }) => {
      const preview = document.querySelector<HTMLElement>("#preview");
      if (!preview) return;
      preview.querySelector<HTMLElement>(":scope > a")?.style.setProperty("display", "none", "important");

      const accent = `hsl(${(number * 37) % 360} 88% 68%)`;
      const overlay = document.createElement("div");
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.cssText = `position:fixed;inset:0;z-index:2147483647;pointer-events:none;color:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,sans-serif;--thumb-accent:${accent};`;

      const vignette = document.createElement("div");
      vignette.style.cssText = `position:absolute;inset:0;background:radial-gradient(ellipse at 18% 8%,color-mix(in srgb,var(--thumb-accent) 15%,transparent),transparent 42%),linear-gradient(180deg,rgba(3,7,12,.38),transparent 27%,transparent 58%,rgba(3,7,12,.88) 100%);`;
      overlay.append(vignette);

      const frame = document.createElement("div");
      frame.style.cssText = "position:absolute;inset:16px;border:1px solid rgba(255,255,255,.14);border-radius:22px;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 14px 50px rgba(0,0,0,.16);";
      overlay.append(frame);

      const header = document.createElement("div");
      header.style.cssText = "position:absolute;top:36px;left:46px;right:46px;display:flex;align-items:center;justify-content:space-between;";
      const brand = document.createElement("div");
      brand.style.cssText = "display:flex;align-items:center;gap:9px;padding:8px 12px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(5,10,17,.52);backdrop-filter:blur(12px);font-size:10px;font-weight:650;letter-spacing:.16em;text-transform:uppercase;color:rgba(248,250,252,.82);";
      const dot = document.createElement("span");
      dot.style.cssText = "width:7px;height:7px;border-radius:50%;background:var(--thumb-accent);box-shadow:0 0 14px var(--thumb-accent);";
      brand.append(dot, document.createTextNode("Skipper UI · Motion Index"));
      const index = document.createElement("div");
      index.textContent = `${String(number).padStart(3, "0")} / 107`;
      index.style.cssText = "padding:8px 11px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(5,10,17,.5);backdrop-filter:blur(12px);font:500 11px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;color:rgba(248,250,252,.78);";
      header.append(brand, index);
      overlay.append(header);

      const footer = document.createElement("div");
      footer.style.cssText = "position:absolute;left:48px;right:48px;bottom:43px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;";
      const copy = document.createElement("div");
      copy.style.cssText = "max-width:78%;";
      const eyebrow = document.createElement("div");
      eyebrow.textContent = collection || "Interactive Primitive";
      eyebrow.style.cssText = "margin-bottom:8px;font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--thumb-accent);";
      const heading = document.createElement("div");
      heading.textContent = title;
      heading.style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:clamp(22px,3vw,38px);font-weight:620;letter-spacing:-.045em;line-height:1.05;text-shadow:0 2px 22px rgba(0,0,0,.38);";
      copy.append(eyebrow, heading);
      const marker = document.createElement("div");
      marker.textContent = "INTERACTIVE · 2026";
      marker.style.cssText = "flex:0 0 auto;padding-bottom:3px;font:500 9px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.15em;color:rgba(248,250,252,.58);";
      footer.append(copy, marker);
      overlay.append(footer);
      document.body.append(overlay);
    }, { number: Number(id.replace("skipper", "")), title, collection });

    // Save a consistently framed, branded WebP dashboard cover.
    await page.screenshot({
      path: absoluteOutPath,
      type: "webp",
      quality: 90,
      fullPage: false,
    });

    return {
      id,
      status: errors.length > 0 ? "fail" : "pass",
      durationMs: Date.now() - startTime,
      thumbnailPath: `/thumbnails/${thumbnailFilename}`,
      errors,
    };
  } catch (err: any) {
    return {
      id,
      status: "fail",
      durationMs: Date.now() - startTime,
      errors: [...errors, `[ExecutionError] ${err.message}`],
    };
  }
}

async function main() {
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  const records = JSON.parse(
    await fs.readFile(path.resolve(process.cwd(), "src/lib/side-by-side-data.json"), "utf8")
  ) as Array<{ id: string; title: string; collection?: string }>;
  const recordById = new Map(records.map((record) => [record.id, record]));

  console.log(`Redesigning dashboard thumbnails for all ${CONFIG.totalCount} live components...`);
  console.log(`Target: ${CONFIG.baseUrl}/v1/preview/skipper1 -> skipper${CONFIG.totalCount}\n`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-gl=angle", // Ensures stable hardware-accelerated WebGL rendering
      "--enable-webgl",
    ],
  });

  let context = await createFreshContext(browser);
  const results: AuditResult[] = [];
  let contextProcessedCount = 0;

  for (let i = 1; i <= CONFIG.totalCount; i++) {
    const id = `skipper${i}`;

    const record = recordById.get(id);
    if (!record) throw new Error(`No catalog metadata found for ${id}`);

    // Context recycling mechanism to prevent Chromium WebGL context leakage
    if (contextProcessedCount >= CONFIG.contextRecycleThreshold) {
      await context.close();
      context = await createFreshContext(browser);
      contextProcessedCount = 0;
    }

    const page = await context.newPage();
    try {
      const result = await auditAndCapture(page, id, record.title, record.collection ?? "Interactive Primitive");
      results.push(result);
      contextProcessedCount++;

      const logSymbol = result.status === "pass" ? "[OK]" : "[FAIL]";
      const durationStr = `${result.durationMs}ms`.padStart(7);
      console.log(`${logSymbol} ${id.padEnd(10)} in ${durationStr} -> ${result.thumbnailPath ?? "No asset"}`);

      if (result.errors.length > 0) {
        result.errors.forEach((e) => console.log(`     -> ${e}`));
      }
    } finally {
      await page.close();
    }
  }

  await context.close();
  await browser.close();

  // Write audit ledger to disk
  const summaryPath = path.resolve(os.tmpdir(), "skipper-dashboard-thumbnail-redesign-report.json");
  await fs.writeFile(summaryPath, JSON.stringify(results, null, 2), "utf-8");

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const skipped = results.filter((r) => r.status === "skipped").length;

  console.log("\n==========================================");
  console.log(`Audit Complete: ${passed} Passed | ${failed} Failed | ${skipped} Skipped`);
  console.log(`Report: ${summaryPath}`);
  console.log(`Thumbnails: ${CONFIG.outputDir}`);
  console.log("==========================================");

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Fatal audit crash:", err);
  process.exit(1);
});
