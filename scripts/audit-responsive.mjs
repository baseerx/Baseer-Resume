/**
 * Responsive audit for the built site.
 *
 * Renders dist/index.html at every viewport width worth caring about and fails
 * if anything breaks out of its box:
 *   - the page scrolls horizontally
 *   - an element sticks out past the viewport edge
 *   - an element's own content is wider than its box (the symptom that makes
 *     text from adjacent grid cells look "merged")
 *   - two children of the same grid/definition-list visually overlap
 *
 * Decorative layers (the fixed background blobs, the tools marquee, sr-only
 * skip links, aria-hidden ornaments) are intentionally exempt.
 *
 * Usage: node scripts/audit-responsive.mjs [--shots <dir>]
 *        expects `vite build` to have run first.
 */

import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = resolve(ROOT, "dist");
const BASE = "/Baseer-Resume";

const shotsFlag = process.argv.indexOf("--shots");
const SHOTS = shotsFlag > -1 ? resolve(process.argv[shotsFlag + 1]) : null;

const VIEWPORTS = [
  { name: "320  galaxy-fold", w: 320, h: 740 },
  { name: "360  android", w: 360, h: 780 },
  { name: "375  iphone-se", w: 375, h: 667 },
  { name: "390  iphone-14", w: 390, h: 844 },
  { name: "414  iphone-plus", w: 414, h: 896 },
  { name: "480  phablet", w: 480, h: 900 },
  { name: "640  sm", w: 640, h: 900 },
  { name: "768  ipad", w: 768, h: 1024 },
  { name: "834  ipad-air", w: 834, h: 1112 },
  { name: "1024 lg", w: 1024, h: 800 },
  { name: "1280 laptop", w: 1280, h: 800 },
  { name: "1440 desktop", w: 1440, h: 900 },
  { name: "1920 fhd", w: 1920, h: 1080 },
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

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

/** Runs inside the page. Returns everything that breaks out of its box. */
function collect(vw) {
  const out = { pageOverflow: 0, wide: [], contentOverflow: [], collisions: [] };
  out.pageOverflow = Math.max(0, document.documentElement.scrollWidth - vw);

  const EXEMPT = '.marquee, .sr-only, [aria-hidden="true"]';

  // A hover sheen parked off to the left is fine when an ancestor clips it —
  // it never actually reaches the edge of the page.
  const clippedByAncestor = (el, vw) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflow !== "visible" || ps.overflowX !== "visible") {
        const pr = p.getBoundingClientRect();
        if (pr.right <= vw + 2 && pr.left >= -2) return true;
      }
    }
    return false;
  };
  const describe = (el) => {
    const cls =
      el.className && typeof el.className === "string"
        ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
        : "";
    const txt = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 44);
    return `${el.tagName.toLowerCase()}${cls}${txt ? ` — "${txt}"` : ""}`;
  };

  for (const el of document.querySelectorAll("body *")) {
    const st = getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden") continue;
    if (st.position === "fixed") continue;
    if (el.closest(EXEMPT)) continue;

    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;

    if ((r.right > vw + 2 || r.left < -2) && !clippedByAncestor(el, vw)) {
      out.wide.push({ el: describe(el), left: +r.left.toFixed(1), right: +r.right.toFixed(1) });
    }
    // Only text-bearing leaves count. A container whose scrollWidth exceeds
    // its clientWidth is usually just hosting an absolutely-positioned
    // ornament, and `text-overflow: ellipsis` overflows by definition.
    const over = el.scrollWidth - el.clientWidth;
    const isLeaf = el.children.length === 0 && (el.textContent || "").trim().length > 0;
    if (
      over > 3 &&
      isLeaf &&
      st.textOverflow !== "ellipsis" &&
      st.overflowX !== "auto" &&
      st.overflowX !== "scroll"
    ) {
      out.contentOverflow.push({ el: describe(el), by: +over.toFixed(1) });
    }
  }

  for (const list of document.querySelectorAll("dl, .grid")) {
    // Absolutely-positioned children (glow rings, hover pills) are meant to
    // sit on top of their siblings.
    const kids = [...list.children].filter((k) => {
      const ks = getComputedStyle(k);
      return (
        ks.display !== "none" &&
        ks.position !== "absolute" &&
        ks.position !== "fixed" &&
        k.getBoundingClientRect().height > 0
      );
    });
    for (let i = 0; i < kids.length; i++) {
      for (let j = i + 1; j < kids.length; j++) {
        const a = kids[i].getBoundingClientRect();
        const b = kids[j].getBoundingClientRect();
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (ox > 2 && oy > 2) {
          out.collisions.push({ a: describe(kids[i]), b: describe(kids[j]), ox: +ox.toFixed(1) });
        }
      }
    }
  }
  return out;
}

async function main() {
  if (!existsSync(join(DIST, "index.html"))) {
    console.error("\n  x  dist/index.html is missing — run `npm run build` first.\n");
    process.exit(1);
  }
  if (SHOTS) mkdirSync(SHOTS, { recursive: true });

  const server = await serveDist();
  const { port } = server.address();
  const browser = await chromium.launch();
  let broken = 0;

  console.log("\n  Responsive audit\n");

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 1,
      // measure the settled layout, not mid-spring transforms
      reducedMotion: "reduce",
    });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200); // preloader curtain

    // walk the page so every scroll-reveal has fired, then return to the top
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.75;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 300));
    });

    const r = await page.evaluate(collect, vp.w);
    const issues = (r.pageOverflow > 0 ? 1 : 0) + r.wide.length + r.contentOverflow.length + r.collisions.length;
    if (issues) broken++;

    console.log(
      `    ${issues ? "FAIL" : "ok  "}  ${vp.name.padEnd(18)}` +
        (issues
          ? `scroll=${r.pageOverflow}  offscreen=${r.wide.length}  clipped=${r.contentOverflow.length}  overlap=${r.collisions.length}`
          : ""),
    );
    for (const w of r.wide.slice(0, 5)) console.log(`            offscreen  ${w.el}  [${w.left}..${w.right}]`);
    for (const c of r.contentOverflow.slice(0, 5)) console.log(`            clipped +${c.by}px  ${c.el}`);
    for (const c of r.collisions.slice(0, 5)) console.log(`            overlap ${c.ox}px  ${c.a}  <>  ${c.b}`);

    if (SHOTS) await page.screenshot({ path: join(SHOTS, `${vp.w}.png`), fullPage: true });
    await page.close();
  }

  await browser.close();
  server.close();

  if (broken) {
    console.error(`\n  x  ${broken}/${VIEWPORTS.length} viewports have layout breakage.\n`);
    process.exit(1);
  }
  console.log(`\n  OK  all ${VIEWPORTS.length} viewports clean.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
