/**
 * Skipper UI Automated Reverse-Engineering Telemetry Harvester
 * ------------------------------------------------------------
 * Concurrently extracts documentation metadata, registry source code,
 * DOM hierarchies, Tailwind styling, and real-time motion physics
 * from https://skipper-ui.com/v1/skipper{1..107}.
 *
 * Usage:
 *   npx tsx harvest-skipper.ts [--start 1] [--end 107] [--concurrency 3] [--out-dir ./dataset]
 *   npx tsx harvest-skipper.ts --only 1,40,62
 */

import { chromium, Browser, BrowserContext, Page } from "playwright";
import * as fs from "fs/promises";
import * as path from "path";

// ============================================================================
// Types & Contracts
// ============================================================================

export interface SkipperProp {
  name: string;
  type?: string;
  description: string;
}

export interface SkipperInteraction {
  action: string;
  effect: string;
}

export interface SkipperDocMetadata {
  id: string;
  componentNumber: number;
  title: string;
  description: string;
  isPro: boolean;
  dependencies: string[];
  interactions: SkipperInteraction[];
  props: SkipperProp[];
  howToUseSnippet: string;
  installCommand: string;
  registryAvailable: boolean;
  registryData: Record<string, any> | null;
}

export interface SkipperTelemetry {
  idleScreenshotPath: string;
  activeScreenshotPath: string;
  idleHtmlPath: string;
  activeHtmlPath: string;
}

export interface SkipperSpec extends SkipperDocMetadata {
  telemetry: SkipperTelemetry;
  harvestTimestamp: string;
  status: "success" | "partial" | "error";
  error?: string;
}

interface CliConfig {
  start: number;
  end: number;
  concurrency: number;
  outDir: string;
  onlyList?: number[];
  headless: boolean;
  timeoutMs: number;
}

// ============================================================================
// Helper Utilities
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseCliArgs(): CliConfig {
  const args = process.argv.slice(2);
  const config: CliConfig = {
    start: 1,
    end: 107,
    concurrency: 3,
    outDir: path.resolve(process.cwd(), "dataset"),
    headless: true,
    timeoutMs: 45000,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--start" && args[i + 1]) {
      config.start = parseInt(args[++i], 10);
    } else if (arg === "--end" && args[i + 1]) {
      config.end = parseInt(args[++i], 10);
    } else if (arg === "--concurrency" && args[i + 1]) {
      config.concurrency = Math.max(1, Math.min(10, parseInt(args[++i], 10)));
    } else if (arg === "--out-dir" && args[i + 1]) {
      config.outDir = path.resolve(process.cwd(), args[++i]);
    } else if (arg === "--only" && args[i + 1]) {
      config.onlyList = args[++i].split(",").map((v) => parseInt(v.trim(), 10)).filter((n) => !isNaN(n));
    } else if (arg === "--headless" && args[i + 1]) {
      config.headless = args[++i] === "true";
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
Skipper UI Harvester CLI
-----------------------
--start <n>        Start component index (default: 1)
--end <n>          End component index (default: 107)
--concurrency <n>  Max parallel browser contexts (default: 3)
--out-dir <path>   Output directory (default: ./dataset)
--only <list>      Comma-separated list of IDs to scrape (e.g. 1,40,107)
--headless <bool>  Run headless browser (default: true)
      `);
      process.exit(0);
    }
  }

  return config;
}

/**
 * Executes an async operation with exponential backoff on retryable HTTP errors (429, 5xx)
 */
async function retryWithBackoff<T>(
  operation: (attempt: number) => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1500,
  contextLabel = "operation"
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation(attempt);
    } catch (err: any) {
      attempt++;
      const errorMessage = err?.message || String(err);
      const isRateLimit = errorMessage.includes("429") || errorMessage.includes("rate");
      const isServerError = errorMessage.includes("500") || errorMessage.includes("502") || errorMessage.includes("503") || errorMessage.includes("504");
      const isNetworkTimeout = errorMessage.includes("Timeout") || errorMessage.includes("ETIMEDOUT") || errorMessage.includes("ECONNRESET");

      if (attempt > maxRetries || (!isRateLimit && !isServerError && !isNetworkTimeout)) {
        throw err;
      }

      const jitter = Math.random() * 500;
      const delay = Math.pow(2, attempt) * baseDelayMs + jitter;
      console.warn(`[WARN] [${contextLabel}] Attempt ${attempt} failed: ${errorMessage}. Retrying in ${Math.round(delay)}ms...`);
      await sleep(delay);
    }
  }
}

/**
 * Concurrency worker pool
 */
async function runWorkerPool<T>(
  items: T[],
  concurrency: number,
  workerFn: (item: T, index: number) => Promise<void>
): Promise<void> {
  let currentIndex = 0;
  const workers: Promise<void>[] = [];

  for (let i = 0; i < concurrency; i++) {
    workers.push(
      (async () => {
        while (currentIndex < items.length) {
          const index = currentIndex++;
          await workerFn(items[index], index);
        }
      })()
    );
  }

  await Promise.all(workers);
}

// ============================================================================
// Core Harvester Module
// ============================================================================

export class SkipperHarvester {
  private browser: Browser | null = null;
  private config: CliConfig;

  constructor(config: CliConfig) {
    this.config = config;
  }

  public async init(): Promise<void> {
    console.log(`[INIT] Launching Playwright Chromium (headless: ${this.config.headless})...`);
    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    await fs.mkdir(this.config.outDir, { recursive: true });
  }

  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log(`[SHUTDOWN] Browser shut down gracefully.`);
    }
  }

  /**
   * Harvests a single component end-to-end
   */
  public async harvestComponent(componentNum: number): Promise<SkipperSpec> {
    const id = `skipper${componentNum}`;
    const componentDir = path.join(this.config.outDir, id);
    await fs.mkdir(componentDir, { recursive: true });

    console.log(`[START] [${id}] Processing component #${componentNum}...`);

    let context: BrowserContext | null = null;

    try {
      if (!this.browser) throw new Error("Browser not initialized");

      // Create isolated context with 1440x900 viewport & dark mode
      context = await this.browser.newContext({
        viewport: { width: 1440, height: 900 },
        colorScheme: "dark",
        deviceScaleFactor: 2, // Crisp screenshots
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      });

      // 1. Fetch free shadcn registry JSON directly if accessible
      const registryData = await this.checkRegistryJson(componentNum);
      if (registryData) {
        await fs.writeFile(
          path.join(componentDir, "registry.json"),
          JSON.stringify(registryData, null, 2),
          "utf-8"
        );
      }

      // 2. Scrape Documentation Page
      const docMetadata = await retryWithBackoff(
        async () => {
          const page = await context!.newPage();
          try {
            return await this.extractDocMetadata(page, componentNum, registryData);
          } finally {
            await page.close().catch(() => {});
          }
        },
        3,
        1500,
        `${id}:docs`
      );

      // 3. Telemetry on Isolated Preview Page
      const telemetry = await retryWithBackoff(
        async () => {
          const page = await context!.newPage();
          try {
            return await this.extractPreviewTelemetry(page, componentNum, docMetadata, componentDir);
          } finally {
            await page.close().catch(() => {});
          }
        },
        3,
        2000,
        `${id}:preview`
      );

      // 4. Construct final deterministic spec & LLM prompt context
      const spec: SkipperSpec = {
        ...docMetadata,
        telemetry: {
          idleScreenshotPath: path.relative(this.config.outDir, telemetry.idleScreenshotPath),
          activeScreenshotPath: path.relative(this.config.outDir, telemetry.activeScreenshotPath),
          idleHtmlPath: path.relative(this.config.outDir, telemetry.idleHtmlPath),
          activeHtmlPath: path.relative(this.config.outDir, telemetry.activeHtmlPath),
        },
        harvestTimestamp: new Date().toISOString(),
        status: "success",
      };

      await fs.writeFile(path.join(componentDir, "spec.json"), JSON.stringify(spec, null, 2), "utf-8");

      const promptContext = this.generatePromptContextMarkdown(spec, telemetry.idleHtmlContent, telemetry.activeHtmlContent);
      await fs.writeFile(path.join(componentDir, "prompt_context.md"), promptContext, "utf-8");

      console.log(`[SUCCESS] [${id}] Completed: "${spec.title}" (Registry: ${spec.registryAvailable ? "Free" : "Pro"})`);
      return spec;
    } catch (err: any) {
      console.error(`[ERROR] [${id}] Failed harvesting:`, err?.message || err);
      const errorSpec: SkipperSpec = {
        id,
        componentNumber: componentNum,
        title: `Skipper ${componentNum}`,
        description: "",
        isPro: true,
        dependencies: [],
        interactions: [],
        props: [],
        howToUseSnippet: "",
        installCommand: `pnpm dlx shadcn add @skipper-ui/${id}`,
        registryAvailable: false,
        registryData: null,
        telemetry: {
          idleScreenshotPath: "",
          activeScreenshotPath: "",
          idleHtmlPath: "",
          activeHtmlPath: "",
        },
        harvestTimestamp: new Date().toISOString(),
        status: "error",
        error: err?.message || String(err),
      };

      await fs.writeFile(path.join(componentDir, "spec.json"), JSON.stringify(errorSpec, null, 2), "utf-8");
      return errorSpec;
    } finally {
      if (context) {
        await context.close().catch(() => {});
      }
    }
  }

  /**
   * Check if free shadcn registry endpoint returns HTTP 200 without auth
   */
  private async checkRegistryJson(componentNum: number): Promise<Record<string, any> | null> {
    const url = `https://skipper-ui.com/r/skipper${componentNum}.json`;
    try {
      const res = await fetch(url, { headers: { "Accept": "application/json" } });
      if (res.status === 200) {
        const data = await res.json();
        return data;
      }
    } catch {
      // 401 or network error indicates pro component or unavailable registry
    }
    return null;
  }

  /**
   * Navigates to `/v1/skipper{i}` and extracts documentation metadata
   */
  private async extractDocMetadata(
    page: Page,
    componentNum: number,
    registryData: Record<string, any> | null
  ): Promise<SkipperDocMetadata> {
    const id = `skipper${componentNum}`;
    const docUrl = `https://skipper-ui.com/v1/${id}`;

    await page.goto(docUrl, { waitUntil: "domcontentloaded", timeout: this.config.timeoutMs });

    // Wait for the docs heading or body to settle
    await page.waitForSelector(".docs-h3, h1, h2, h3", { timeout: 15000 }).catch(() => {});

    const extracted = await page.evaluate(() => {
      // Helper to clean inner text
      const clean = (str: string | null | undefined) => (str ? str.replace(/\s+/g, " ").trim() : "");

      // 1. Title
      let title = "";
      const h3s = Array.from(document.querySelectorAll("h3.docs-h3"));
      if (h3s.length > 0) {
        title = clean(h3s[0].textContent);
      }
      if (!title) {
        const titleTag = document.querySelector("title");
        title = titleTag ? clean(titleTag.textContent).split("|")[0].trim() : "";
      }

      // 2. Description
      let description = "";
      const pDoc = document.querySelector("p.docs-p");
      if (pDoc) {
        description = clean(pDoc.textContent);
      } else {
        const metaDesc = document.querySelector("meta[name='description']");
        description = metaDesc ? metaDesc.getAttribute("content") || "" : "";
      }

      // 3. Dependencies
      const dependenciesSet = new Set<string>();
      // Find Dependencies heading
      const depHeading = Array.from(document.querySelectorAll("h3, h4, h2")).find((el) =>
        /dependencies/i.test(el.textContent || "")
      );
      if (depHeading) {
        let sibling = depHeading.nextElementSibling;
        while (sibling && !/h[1-4]/i.test(sibling.tagName)) {
          const links = Array.from(sibling.querySelectorAll("a, span, p, code"));
          for (const item of links) {
            const txt = clean(item.textContent);
            if (txt && txt.length < 35 && !txt.includes("http")) {
              dependenciesSet.add(txt);
            }
          }
          sibling = sibling.nextElementSibling;
        }
      }

      // Scan page text for canonical motion / UI dependencies
      const bodyText = document.body.innerText || "";
      const knownDeps = [
        "framer-motion",
        "gsap",
        "lucide-react",
        "react-use-measure",
        "use-sound",
        "lenis",
        "animejs",
        "tailwind-merge",
        "clsx",
      ];
      for (const kd of knownDeps) {
        if (new RegExp(`\\b${kd}\\b`, "i").test(bodyText)) {
          dependenciesSet.add(kd);
        }
      }

      // 4. Interaction Instructions (Table 0 or interaction block)
      const interactions: Array<{ action: string; effect: string }> = [];
      const interactionHeading = Array.from(document.querySelectorAll("h2, h3, h4")).find((el) =>
        /interaction\s*type/i.test(el.textContent || "")
      );
      if (interactionHeading) {
        const table = interactionHeading.parentElement?.querySelector("table") ||
                      interactionHeading.nextElementSibling?.closest("table") ||
                      interactionHeading.nextElementSibling;
        if (table && table.tagName === "TABLE") {
          const rows = Array.from(table.querySelectorAll("tbody tr"));
          for (const row of rows) {
            const cells = Array.from(row.querySelectorAll("td"));
            if (cells.length >= 2) {
              interactions.push({
                action: clean(cells[0].textContent),
                effect: clean(cells[1].textContent),
              });
            } else if (cells.length === 1) {
              interactions.push({
                action: "Interact",
                effect: clean(cells[0].textContent),
              });
            }
          }
        }
      }

      // Fallback: search all tables for interaction patterns
      if (interactions.length === 0) {
        const allTables = Array.from(document.querySelectorAll("table"));
        for (const tbl of allTables) {
          const text = tbl.textContent || "";
          if (/try\s+(scrolling|hovering|dragging|clicking)/i.test(text)) {
            const rows = Array.from(tbl.querySelectorAll("tbody tr"));
            for (const row of rows) {
              const cells = Array.from(row.querySelectorAll("td"));
              if (cells.length >= 2) {
                interactions.push({
                  action: clean(cells[0].textContent),
                  effect: clean(cells[1].textContent),
                });
              } else if (cells.length === 1) {
                interactions.push({
                  action: "Interact",
                  effect: clean(cells[0].textContent),
                });
              }
            }
            break;
          }
        }
      }

      // 5. Props Table
      const props: Array<{ name: string; type?: string; description: string }> = [];
      const tables = Array.from(document.querySelectorAll("table"));
      for (const tbl of tables) {
        const ths = Array.from(tbl.querySelectorAll("th")).map((th) => clean(th.textContent).toLowerCase());
        if (ths.some((h) => h.includes("prop")) && ths.some((h) => h.includes("desc"))) {
          const rows = Array.from(tbl.querySelectorAll("tbody tr"));
          for (const row of rows) {
            const tds = Array.from(row.querySelectorAll("td"));
            if (tds.length >= 2) {
              props.push({
                name: clean(tds[0].textContent),
                description: clean(tds[1].textContent),
              });
            }
          }
        }
      }

      // 6. How to use code snippet
      let howToUseSnippet = "";
      const preBlocks = Array.from(document.querySelectorAll("pre"));
      for (const pre of preBlocks) {
        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        if (code.includes(`@/components/v1/`) || code.includes(`from "@/components/v1/`)) {
          howToUseSnippet = code.trim();
          break;
        }
      }
      if (!howToUseSnippet && preBlocks.length > 0) {
        howToUseSnippet = (preBlocks[0].querySelector("code")?.textContent || preBlocks[0].textContent || "").trim();
      }

      // 7. Install command
      let installCommand = "";
      const codeTags = Array.from(document.querySelectorAll("code"));
      for (const c of codeTags) {
        const txt = clean(c.textContent);
        if (txt.includes("shadcn add") && txt.includes("@skipper-ui")) {
          installCommand = txt;
          break;
        }
      }

      // 8. Pro detection
      const isPro = !!document.body.innerText.match(/Pro Login Required|Install via Pro CLI|Pro license key/i);

      return {
        title,
        description,
        isPro,
        dependencies: Array.from(dependenciesSet),
        interactions,
        props,
        howToUseSnippet,
        installCommand: installCommand || `pnpm dlx shadcn add @skipper-ui/${id}`,
      };
    });

    // Merge registry data if present
    const finalDeps = Array.from(
      new Set([...extracted.dependencies, ...(registryData?.dependencies || [])])
    );

    return {
      id,
      componentNumber: componentNum,
      title: extracted.title || `Skipper ${componentNum}`,
      description: extracted.description || "",
      isPro: registryData ? false : extracted.isPro,
      dependencies: finalDeps,
      interactions: extracted.interactions,
      props: extracted.props,
      howToUseSnippet: extracted.howToUseSnippet,
      installCommand: extracted.installCommand,
      registryAvailable: !!registryData,
      registryData,
    };
  }

  /**
   * Navigates to `/v1/preview/skipper{i}`, waits for hydration, captures screenshots & serialized DOM
   */
  private async extractPreviewTelemetry(
    page: Page,
    componentNum: number,
    metadata: SkipperDocMetadata,
    componentDir: string
  ): Promise<{
    idleScreenshotPath: string;
    activeScreenshotPath: string;
    idleHtmlPath: string;
    activeHtmlPath: string;
    idleHtmlContent: string;
    activeHtmlContent: string;
  }> {
    const previewUrl = `https://skipper-ui.com/v1/preview/skipper${componentNum}`;

    await page.goto(previewUrl, { waitUntil: "networkidle", timeout: this.config.timeoutMs });

    // Wait for hydration & client render (bailout template replacement)
    await page.waitForTimeout(1200);

    // 1. Capture Idle State
    const idleScreenshotPath = path.join(componentDir, "idle.png");
    await page.screenshot({ path: idleScreenshotPath, fullPage: false });

    const idleHtmlContent = await this.serializePreviewDOM(page);
    const idleHtmlPath = path.join(componentDir, "preview_idle.html");
    await fs.writeFile(idleHtmlPath, idleHtmlContent, "utf-8");

    // 2. Programmatic Interaction Probe
    await this.triggerInteractionProbe(page, metadata);

    // Give motion physics 450ms to reach peak mid-transition velocity
    await page.waitForTimeout(450);

    // 3. Capture Active/Mid-Transition State
    const activeScreenshotPath = path.join(componentDir, "active.png");
    await page.screenshot({ path: activeScreenshotPath, fullPage: false });

    const activeHtmlContent = await this.serializePreviewDOM(page);
    const activeHtmlPath = path.join(componentDir, "preview_active.html");
    await fs.writeFile(activeHtmlPath, activeHtmlContent, "utf-8");

    return {
      idleScreenshotPath,
      activeScreenshotPath,
      idleHtmlPath,
      activeHtmlPath,
      idleHtmlContent,
      activeHtmlContent,
    };
  }

  /**
   * Browser-side deep DOM serialization:
   * Strips script tags, hydration artifacts, and comments while faithfully
   * preserving inline styles (real-time transforms/opacities), Tailwind classes, and SVGs.
   */
  private async serializePreviewDOM(page: Page): Promise<string> {
    return await page.evaluate(() => {
      // Locate the primary rendered preview container
      const target =
        document.querySelector("main") ||
        document.querySelector("#preview") ||
        document.querySelector("[data-preview]") ||
        document.body;

      if (!target) return "";

      const clone = target.cloneNode(true) as HTMLElement;

      // 1. Strip script tags, noscript, styles, templates
      const removeSelectors = [
        "script",
        "noscript",
        "template",
        "style",
        "[data-nextjs-scroll-focus-boundary]",
        "[data-nextjs-router-announcer]",
        "next-route-announcer",
        ".sr-only",
      ];
      removeSelectors.forEach((sel) => {
        clone.querySelectorAll(sel).forEach((el) => el.remove());
      });

      // 2. Recursively sanitize attributes & format tree
      function cleanNode(node: Node): void {
        if (node.nodeType === Node.COMMENT_NODE) {
          node.parentNode?.removeChild(node);
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const allowedAttrs = [
            "class",
            "style",
            "id",
            "role",
            "aria-label",
            "aria-hidden",
            "aria-expanded",
            "tabindex",
            "href",
            "src",
            "alt",
            "width",
            "height",
            // SVG attributes
            "viewBox",
            "xmlns",
            "fill",
            "stroke",
            "stroke-width",
            "stroke-linecap",
            "stroke-linejoin",
            "d",
            "cx",
            "cy",
            "r",
            "x",
            "y",
            "rx",
            "ry",
          ];

          const attrNames = Array.from(el.attributes).map((a) => a.name);
          for (const name of attrNames) {
            const isDataAttr = name.startsWith("data-") && !name.startsWith("data-dgst");
            if (!allowedAttrs.includes(name.toLowerCase()) && !isDataAttr) {
              el.removeAttribute(name);
            }
          }

          // Clean child nodes
          const children = Array.from(el.childNodes);
          for (const child of children) {
            cleanNode(child);
          }
        }
      }

      cleanNode(clone);

      // Pretty indentation helper
      function formatHtml(html: string): string {
        let formatted = "";
        let pad = 0;
        const tokens = html.replace(/>\s*</g, "><").split(/(<[^>]+>)/g).filter(Boolean);

        for (const token of tokens) {
          if (token.startsWith("</")) {
            pad = Math.max(0, pad - 1);
            formatted += "  ".repeat(pad) + token + "\n";
          } else if (token.startsWith("<") && !token.startsWith("<!") && !token.endsWith("/>") && !/^(<input|<img|<hr|<br|<meta)/i.test(token)) {
            formatted += "  ".repeat(pad) + token + "\n";
            pad++;
          } else {
            const trimmed = token.trim();
            if (trimmed) {
              formatted += "  ".repeat(pad) + trimmed + "\n";
            }
          }
        }
        return formatted;
      }

      return formatHtml(clone.outerHTML);
    });
  }

  /**
   * Intelligently dispatches interactions based on the documented interaction pattern
   */
  private async triggerInteractionProbe(page: Page, metadata: SkipperDocMetadata): Promise<void> {
    const interactionText = metadata.interactions.map((i) => `${i.action} ${i.effect}`).join(" ").toLowerCase();

    // Strategy 1: Scroll interaction (e.g. scrollbars, reveal on scroll, parallax)
    if (interactionText.includes("scroll") || interactionText.includes("wheel")) {
      // Try smooth wheel dispatch
      await page.mouse.wheel(0, 450);
      await page.evaluate(() => {
        const scrollable =
          document.querySelector("[class*='overflow-y-scroll'], [class*='overflow-y-auto'], [class*='snap-y']") ||
          document.documentElement;
        if (scrollable) {
          scrollable.scrollBy({ top: 400, behavior: "smooth" });
        }
      });
      return;
    }

    // Strategy 2: Hover interaction (cards, menus, dynamic buttons, hover reveals)
    if (interactionText.includes("hover") || interactionText.includes("mouse") || interactionText.includes("cursor")) {
      const targetFound = await page.evaluate(() => {
        const candidates = Array.from(
          document.querySelectorAll("button, a, [class*='group'], [class*='hover:'], [role='button']")
        );
        const best = candidates.find((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 20 && rect.height > 20 && rect.top >= 0 && rect.top <= window.innerHeight;
        });
        if (best) {
          const rect = best.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
        return null;
      });

      if (targetFound) {
        await page.mouse.move(targetFound.x, targetFound.y, { steps: 8 });
        return;
      }
    }

    // Strategy 3: Drag interaction
    if (interactionText.includes("drag") || interactionText.includes("handle") || interactionText.includes("slider")) {
      const handlePos = await page.evaluate(() => {
        const handle = document.querySelector("[class*='cursor-grab'], [class*='cursor-pointer'], [role='slider']");
        if (handle) {
          const r = handle.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
        return null;
      });

      if (handlePos) {
        await page.mouse.move(handlePos.x, handlePos.y);
        await page.mouse.down();
        await page.mouse.move(handlePos.x + 80, handlePos.y + 120, { steps: 10 });
        // Keep mouse down for active screenshot
        return;
      }
    }

    // Strategy 4: Click / Toggle interaction
    if (interactionText.includes("click") || interactionText.includes("toggle") || interactionText.includes("press")) {
      const clickable = await page.$("button, [role='button'], input[type='checkbox']");
      if (clickable) {
        await clickable.click();
        return;
      }
    }

    // Fallback: Default to center viewport mouse move + small wheel scroll to provoke motion/react listeners
    await page.mouse.move(720, 450, { steps: 5 });
    await page.mouse.wheel(0, 200);
  }

  /**
   * Generates a tailored prompt_context.md that directly satisfies
   * the Phase 1 & Phase 2 reverse-engineering workflow.
   */
  private generatePromptContextMarkdown(
    spec: SkipperSpec,
    idleHtml: string,
    activeHtml: string
  ): string {
    const truncatedIdle = idleHtml.length > 12000 ? idleHtml.slice(0, 12000) + "\n<!-- [Truncated] -->" : idleHtml;
    const truncatedActive = activeHtml.length > 12000 ? activeHtml.slice(0, 12000) + "\n<!-- [Truncated] -->" : activeHtml;

    return `# Reverse-Engineering Brief: ${spec.id} (${spec.title})

## 1. Component Metadata
- **ID:** \`${spec.id}\`
- **Name:** ${spec.title}
- **Access Tier:** ${spec.isPro ? "Pro [Requires License / Clean-room Reconstruction]" : "Free / Community Registry"}
- **Dependencies:** ${spec.dependencies.length > 0 ? spec.dependencies.map((d) => `\`${d}\``).join(", ") : "`framer-motion`, `lucide-react`"}
- **Install Command:** \`${spec.installCommand}\`

## 2. Description
${spec.description || "Interactive motion component from Skipper UI library."}

## 3. Observed Interactions & Choreography
${
  spec.interactions.length > 0
    ? spec.interactions.map((i) => `- **${i.action}:** ${i.effect}`).join("\n")
    : "- Standard idle -> hover / scroll reactive state transitions."
}

## 4. Props Interface
${
  spec.props.length > 0
    ? "| Prop | Type | Description |\n|---|---|---|\n" +
      spec.props.map((p) => `| \`${p.name}\` | \`${p.type || "any"}\` | ${p.description} |`).join("\n")
    : "No external props declared; self-contained or internally configured."
}

## 5. Public Import & Usage Harness
\`\`\`tsx
${spec.howToUseSnippet || `import { ${spec.title.replace(/\s+/g, "")} } from "@/components/v1/${spec.id}";\n\nexport default function Demo${spec.id.toUpperCase()}() {\n  return <${spec.title.replace(/\s+/g, "")} />;\n}`}
\`\`\`

## 6. Captured Telemetry & Artifacts
- **Idle Screenshot:** \`./idle.png\`
- **Active / Mid-Transition Screenshot:** \`./active.png\`
- **Idle DOM Snapshot:** \`./preview_idle.html\`
- **Active DOM Snapshot:** \`./preview_active.html\`

### Idle State DOM Snapshot
\`\`\`html
${truncatedIdle}
\`\`\`

### Active / Mid-Transition State DOM Snapshot
\`\`\`html
${truncatedActive}
\`\`\`

${
  spec.registryData?.files
    ? `## 7. Registry Source Code (Free Tier Reference)
\`\`\`tsx
${spec.registryData.files[0]?.content || ""}
\`\`\``
    : `## 7. Clean-Room Implementation Directives
Synthesize a clean-room, production-grade \`@/components/v1/${spec.id}.tsx\` and accompanying demo component \`Demo${spec.id.toUpperCase()}\` matching the visual layout, spring dynamics, and DOM hierarchy extracted above.`
}
`;
  }

  /**
   * Main execution loop over requested range
   */
  public async run(): Promise<void> {
    const list: number[] = [];
    if (this.config.onlyList && this.config.onlyList.length > 0) {
      list.push(...this.config.onlyList);
    } else {
      for (let i = this.config.start; i <= this.config.end; i++) {
        list.push(i);
      }
    }

    console.log(
      `[BATCH] Queued ${list.length} components (${list[0]} -> ${list[list.length - 1]}) with concurrency ${
        this.config.concurrency
      }`
    );

    const startTime = Date.now();
    const results: SkipperSpec[] = [];

    await runWorkerPool(list, this.config.concurrency, async (compNum) => {
      const spec = await this.harvestComponent(compNum);
      results.push(spec);
    });

    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    const successful = results.filter((r) => r.status === "success").length;
    const errors = results.filter((r) => r.status === "error").length;
    const freeTier = results.filter((r) => r.registryAvailable).length;
    const proTier = results.length - freeTier;

    // Write final summary index
    const summaryPath = path.join(this.config.outDir, "index.json");
    await fs.writeFile(
      summaryPath,
      JSON.stringify(
        {
          total: results.length,
          successful,
          errors,
          freeTier,
          proTier,
          elapsedSeconds: Number(elapsedSec),
          components: results.map((r) => ({
            id: r.id,
            title: r.title,
            isPro: r.isPro,
            registryAvailable: r.registryAvailable,
            status: r.status,
          })),
        },
        null,
        2
      ),
      "utf-8"
    );

    console.log(`\n==================================================`);
    console.log(`[COMPLETED] Harvested ${results.length} components in ${elapsedSec}s`);
    console.log(`- Success: ${successful} | Errors: ${errors}`);
    console.log(`- Free (Registry Source): ${freeTier} | Pro (Clean-room Spec): ${proTier}`);
    console.log(`- Index written to: ${summaryPath}`);
    console.log(`==================================================\n`);
  }
}

// ============================================================================
// Script Entrypoint
// ============================================================================

async function main() {
  const config = parseCliArgs();
  const harvester = new SkipperHarvester(config);

  process.on("SIGINT", async () => {
    console.log("\n[ABORT] SIGINT received. Shutting down...");
    await harvester.close();
    process.exit(1);
  });

  try {
    await harvester.init();
    await harvester.run();
  } catch (err) {
    console.error("[FATAL] Uncaught error during harvesting:", err);
    process.exit(1);
  } finally {
    await harvester.close();
  }
}

if (require.main === module || process.argv[1]?.endsWith("harvest-skipper.ts")) {
  main();
}
