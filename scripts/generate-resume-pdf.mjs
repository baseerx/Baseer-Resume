/**
 * Renders dist/resume.html to a print-ready PDF.
 *
 * The point of this script is that the résumé can never quietly go wrong:
 * it refuses to emit a PDF whose pages overflow their paper box, whose page
 * count drifts from the document, or whose fonts failed to load. If content
 * grows past a page, the build fails loudly instead of shipping a clipped CV.
 *
 * Usage: node scripts/generate-resume-pdf.mjs   (expects `vite build` to have run)
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = resolve(ROOT, "dist");
const OUT = join(DIST, "Muhammad-Baseer-Khan-Resume.pdf");
const BASE = "/Baseer-Resume";

const PAPER = "Letter";
const EXPECTED_PAGES = 3;
// Chromium rounds the CSS page box to device pixels; allow a hair of slack so a
// sub-pixel rounding difference is not reported as a content overflow.
const OVERFLOW_TOLERANCE_PX = 1.5;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

/** Static server for dist/, tolerant of the deployed `/Baseer-Resume` prefix. */
function serveDist() {
  const server = createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.startsWith(BASE)) pathname = pathname.slice(BASE.length) || "/";
    if (pathname.endsWith("/")) pathname += "index.html";

    const file = join(DIST, normalize(pathname).replace(/^(\.\.[/\\])+/, ""));
    if (!file.startsWith(DIST) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });

  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const fail = (message) => {
  console.error(`\n  x  ${message}\n`);
  process.exit(1);
};

async function main() {
  if (!existsSync(join(DIST, "resume.html"))) {
    fail("dist/resume.html is missing — run `npm run build` first.");
  }

  const server = await serveDist();
  const { port } = server.address();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const failures = [];
  page.on("pageerror", (e) => failures.push(`page error: ${e.message}`));
  page.on("requestfailed", (r) => failures.push(`request failed: ${r.url()}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`HTTP ${r.status()}: ${r.url()}`);
  });

  await page.goto(`http://127.0.0.1:${port}/resume.html`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // the preview chrome is screen-only; drop it so it can never reach the paper
  await page.evaluate(() => document.querySelectorAll(".no-pdf").forEach((n) => n.remove()));

  if (failures.length) fail(`the résumé page did not load cleanly:\n     ${failures.join("\n     ")}`);

  // Chromium embeds images at their source resolution, so the 450x600 portrait
  // would add ~800KB of raw pixels for a 0.92in circle. Resample it in-page to
  // 3x its printed size — well past what 300dpi resolves — before rendering.
  await page.evaluate(async () => {
    const img = document.querySelector(".mast__photo");
    if (!img) return;
    await img.decode();
    const target = Math.round(img.getBoundingClientRect().width * 3);
    const canvas = document.createElement("canvas");
    canvas.width = target;
    canvas.height = target;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    // preserve the CSS object-fit: cover / object-position framing
    const scale = Math.max(target / img.naturalWidth, target / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (target - w) / 2, (target - h) * 0.18, w, h);
    img.src = canvas.toDataURL("image/jpeg", 0.92);
    await img.decode();
  });

  // --- verify the fonts actually rendered, not a fallback ------------------
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return ["Sora", "Plus Jakarta Sans", "JetBrains Mono"].map((f) => ({
      family: f,
      loaded: document.fonts.check(`700 12px "${f}"`),
    }));
  });
  const missing = fonts.filter((f) => !f.loaded).map((f) => f.family);
  if (missing.length) fail(`web fonts did not load: ${missing.join(", ")} — the PDF would use fallback metrics.`);

  // --- verify every page fits its paper box --------------------------------
  const pages = await page.evaluate(() =>
    [...document.querySelectorAll(".page")].map((el) => {
      const inner = el.querySelector(".page__inner");
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const usable =
        box.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      return {
        index: Number(el.dataset.page),
        usable,
        content: inner.scrollHeight,
        widthOverflow: inner.scrollWidth - inner.clientWidth,
      };
    }),
  );

  if (pages.length !== EXPECTED_PAGES) {
    fail(`expected ${EXPECTED_PAGES} pages in the document, found ${pages.length}.`);
  }

  console.log(`\n  Résumé pages (${PAPER}, content box per page):`);
  const overflows = [];
  for (const p of pages) {
    const fill = (p.content / p.usable) * 100;
    const over = p.content - p.usable;
    const flag = over > OVERFLOW_TOLERANCE_PX ? "  <-- OVERFLOWS" : "";
    console.log(
      `    page ${p.index}:  ${p.content.toFixed(0)} / ${p.usable.toFixed(0)} px` +
        `   ${fill.toFixed(1)}% full${flag}`,
    );
    if (over > OVERFLOW_TOLERANCE_PX) overflows.push(`page ${p.index} by ${over.toFixed(0)}px`);
    if (p.widthOverflow > OVERFLOW_TOLERANCE_PX) {
      overflows.push(`page ${p.index} horizontally by ${p.widthOverflow.toFixed(0)}px`);
    }
  }
  if (overflows.length) {
    fail(
      `résumé content overflows the paper: ${overflows.join(", ")}.\n` +
        "     Trim content in src/data/resume.js or adjust src/resume/resume.css.",
    );
  }

  // --- render ---------------------------------------------------------------
  await page.pdf({
    path: OUT,
    format: PAPER,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  await browser.close();
  server.close();

  // --- verify the emitted file ---------------------------------------------
  const pdf = await readFile(OUT);
  const count = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (count !== EXPECTED_PAGES) {
    fail(`the generated PDF has ${count} pages, expected ${EXPECTED_PAGES}.`);
  }

  console.log(
    `\n  OK  ${OUT.replace(ROOT, "")}  —  ${count} pages, ${(pdf.length / 1024).toFixed(0)} KB\n`,
  );
}

main().catch((e) => fail(e.stack ?? String(e)));
