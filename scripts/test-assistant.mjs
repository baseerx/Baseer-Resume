/**
 * Browser tests for the résumé assistant.
 *
 * `test-search.mjs` covers retrieval in isolation; this drives the real widget
 * in a real browser: opening it, asking questions, rendering a table, following
 * a section link, exporting CSV, and fitting inside small viewports.
 *
 * Usage: node scripts/test-assistant.mjs   (expects `npm run build` first)
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = resolve(ROOT, "dist");
const BASE = "/Baseer-Resume";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

function serveDist() {
  const server = createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.startsWith(BASE)) pathname = pathname.slice(BASE.length) || "/";
    if (pathname.endsWith("/")) pathname += "index.html";
    const file = join(DIST, normalize(pathname));
    if (!file.startsWith(DIST) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`    ${ok ? "ok  " : "FAIL"}  ${name}${detail && !ok ? `  — ${detail}` : ""}`);
};

async function openAssistant(page) {
  await page.click('button[aria-label="Ask about this résumé"]');
  await page.waitForSelector('div[role="dialog"]', { state: "visible" });
  await page.waitForTimeout(320);
}

async function ask(page, question) {
  await page.fill('input[aria-label="Ask a question about this résumé"]', question);
  await page.click('button[aria-label="Send"]');
  await page.waitForTimeout(520);
  return page.evaluate(() => {
    const bubbles = document.querySelectorAll('div[role="dialog"] .rounded-bl-md');
    const last = bubbles[bubbles.length - 1];
    if (!last) return "";
    // only the prose paragraphs — not the source chips or action buttons
    return [...last.querySelectorAll("p")].map((n) => n.textContent.trim()).join(" ");
  });
}

async function main() {
  if (!existsSync(join(DIST, "index.html"))) {
    console.error("\n  x  dist/index.html missing — run `npm run build` first.\n");
    process.exit(1);
  }

  const server = await serveDist();
  const { port } = server.address();
  const browser = await chromium.launch();
  const url = `http://127.0.0.1:${port}/index.html`;

  console.log("\n  Assistant browser tests\n");

  // ── conversation, tables, links, export (desktop) ───────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1300);

    check("launcher is present", (await page.$('button[aria-label="Ask about this résumé"]')) !== null);

    await openAssistant(page);
    check("panel opens", (await page.$('div[role="dialog"]')) !== null);

    const nice = await ask(page, "What is NICE?");
    check("answers a NICE question", /News Intelligence Collection Exchange/i.test(nice), nice.slice(0, 70));

    const letter = await ask(page, "what does the ISMO letter say");
    check(
      "answers about the endorsement letter",
      /ISMO\/2026\/Dir\.Communications\/6581/.test(letter),
      letter.slice(0, 70),
    );

    const unknown = await ask(page, "what is the capital of France");
    check("declines an off-résumé question", /could not find that/i.test(unknown), unknown.slice(0, 70));

    // table rendering
    await ask(page, "show all projects in a table");
    const table = await page.evaluate(() => {
      const tables = document.querySelectorAll('div[role="dialog"] table');
      const t = tables[tables.length - 1];
      if (!t) return null;
      return {
        headers: [...t.querySelectorAll("thead th")].map((h) => h.textContent.trim()),
        rows: t.querySelectorAll("tbody tr").length,
        firstCell: t.querySelector("tbody td")?.textContent.trim() ?? "",
      };
    });
    check("renders a table", table !== null && table.rows > 0, JSON.stringify(table));
    check("table has 14 project rows", table?.rows === 14, `got ${table?.rows}`);
    check("table headers include name", table?.headers.includes("name"), (table?.headers ?? []).join(","));

    // asked-for columns only
    await ask(page, "projects table with name and url");
    const cols = await page.evaluate(() => {
      const tables = document.querySelectorAll('div[role="dialog"] table');
      const last = tables[tables.length - 1];
      return [...last.querySelectorAll("thead th")].map((h) => h.textContent.trim());
    });
    check("honours requested columns", cols.length === 2 && cols.includes("name") && cols.includes("url"), cols.join(","));

    // CSV export
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 8000 }).catch(() => null),
      page.locator('div[role="dialog"] button:has-text("Export CSV")').last().click(),
    ]);
    check("exports CSV", download !== null && /projects\.csv$/.test(download?.suggestedFilename() ?? ""), download?.suggestedFilename() ?? "no download");

    // résumé download action
    const [pdf] = await Promise.all([
      page.waitForEvent("download", { timeout: 8000 }).catch(() => null),
      page.locator('div[role="dialog"] a:has-text("Download résumé")').last().click(),
    ]);
    check("offers the résumé download", pdf !== null && /\.pdf$/.test(pdf?.suggestedFilename() ?? ""), pdf?.suggestedFilename() ?? "no download");

    // A download event fires even when the file 404s, so confirm it is really
    // served — `vite build` empties dist/, so the PDF must be regenerated after.
    const pdfStatus = await page.evaluate(async () => {
      const href = document.querySelector('div[role="dialog"] a[download]')?.getAttribute("href");
      if (!href) return "no link";
      const r = await fetch(href);
      return `${r.status} ${r.headers.get("content-type")}`;
    });
    check("résumé PDF is actually served", pdfStatus.startsWith("200 application/pdf"), pdfStatus);

    // section link jumps and closes the panel
    await ask(page, "What is NICE?");
    await page.locator('div[role="dialog"] [data-jump="nice"]').last().click();
    await page
      .waitForSelector('div[role="dialog"]', { state: "detached", timeout: 5000 })
      .catch(() => {});
    await page
      .waitForFunction(
        () => Math.abs(document.getElementById("nice").getBoundingClientRect().top) < 340,
        null,
        { timeout: 8000, polling: 100 },
      )
      .catch(() => {});
    const jumped = await page.evaluate(() => {
      const el = document.getElementById("nice");
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), dialogOpen: !!document.querySelector('div[role="dialog"]') };
    });
    check("section link scrolls to NICE", Math.abs(jumped.top) < 340, `top=${jumped.top}`);
    check("section link closes the panel", jumped.dialogOpen === false);

    // desktop: launcher bottom-right, back-to-top stacked above it, no overlap
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(700);
    const stack = await page.evaluate((vw) => {
      const launcher = document.querySelector('button[aria-label="Ask about this résumé"]');
      const top = document.querySelector('button[aria-label="Back to top"]');
      if (!launcher || !top) return { ok: false, why: "button missing" };
      const l = launcher.getBoundingClientRect();
      const t = top.getBoundingClientRect();
      const vertical = Math.min(l.bottom, t.bottom) - Math.max(l.top, t.top);
      const horizontal = Math.min(l.right, t.right) - Math.max(l.left, t.left);
      return {
        ok: true,
        bothRight: l.left > vw / 2 && t.left > vw / 2,
        overlapping: vertical > 1 && horizontal > 1,
        arrowAbove: t.bottom <= l.top + 1,
      };
    }, 1280);
    check("desktop: launcher and back-to-top are both right-aligned", stack.ok && stack.bothRight);
    check("desktop: back-to-top does not overlap the launcher", stack.ok && !stack.overlapping);
    check("desktop: back-to-top stacks above the launcher", stack.ok && stack.arrowAbove);

    check("no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ── fits small screens ──────────────────────────────────────────────────
  for (const w of [320, 390, 768]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1300);
    // past the 700px threshold so the back-to-top arrow is really mounted —
    // otherwise "it is hidden" would pass simply because it does not exist
    await page.evaluate(() => window.scrollTo(0, 1600));
    await page.waitForTimeout(600);
    const arrowMounted = await page.$(".back-to-top");
    check(`${w}px: back-to-top is mounted after scrolling`, arrowMounted !== null);
    await openAssistant(page);
    await ask(page, "show all projects in a table");

    const fit = await page.evaluate((vw) => {
      const d = document.querySelector('div[role="dialog"]');
      const r = d.getBoundingClientRect();
      const scroller = d.querySelector("table")?.closest("div");
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        withinX: r.left >= -1 && r.right <= vw + 1,
        withinY: r.top >= -1 && r.bottom <= window.innerHeight + 1,
        pageScroll: Math.max(0, document.documentElement.scrollWidth - vw),
        tableScrolls: scroller ? getComputedStyle(scroller).overflow !== "visible" : false,
      };
    }, w);

    check(`${w}px: panel fits horizontally`, fit.withinX, `${fit.left}..${fit.right}`);
    check(`${w}px: panel fits vertically`, fit.withinY);
    check(`${w}px: no page overflow`, fit.pageScroll === 0, `overflow ${fit.pageScroll}px`);
    check(`${w}px: wide table scrolls inside the panel`, fit.tableScrolls);

    // the launcher must not sit on top of the composer while the panel is open
    const clash = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Close the résumé assistant"]');
      const input = document.querySelector('input[aria-label="Ask a question about this résumé"]');
      if (!btn || !input) return false;
      if (getComputedStyle(btn).display === "none") return false;
      const a = btn.getBoundingClientRect();
      const b = input.closest("form").getBoundingClientRect();
      return Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
             Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
    });
    check(`${w}px: launcher does not cover the composer`, clash === false);

    // the launcher belongs in the bottom-right corner, with the panel above it
    const geom = await page.evaluate((vw) => {
      const btn =
        document.querySelector('button[aria-label="Close the résumé assistant"]') ||
        document.querySelector('button[aria-label="Ask about this résumé"]');
      const panel = document.querySelector('div[role="dialog"]');
      const b = btn.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      return {
        onRight: b.left + b.width / 2 > vw / 2,
        rightGap: Math.round(vw - b.right),
        panelAbove: p.bottom <= b.top + 1,
        overlap: Math.round(Math.min(p.bottom, b.bottom) - Math.max(p.top, b.top)),
      };
    }, w);
    check(`${w}px: launcher sits on the right`, geom.onRight, `rightGap=${geom.rightGap}`);
    check(`${w}px: panel opens above the launcher`, geom.panelAbove, `overlap=${geom.overlap}px`);

    const arrowState = await page.evaluate(() => {
      const arrow = document.querySelector(".back-to-top");
      return arrow ? getComputedStyle(arrow).display : "absent";
    });
    check(`${w}px: back-to-top steps aside for the panel`, arrowState === "none", arrowState);
    await ctx.close();
  }

  await browser.close();
  server.close();

  const failed = results.filter((r) => !r.ok);
  console.log(
    failed.length
      ? `\n  x  ${failed.length}/${results.length} checks failed\n`
      : `\n  OK  all ${results.length} assistant checks passed\n`,
  );
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
