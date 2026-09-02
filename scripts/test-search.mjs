/**
 * Retrieval tests for the résumé assistant.
 *
 * The assistant answers from the résumé corpus with no model in the loop, so
 * its behaviour is deterministic and worth asserting: each case fixes the kind
 * of reply, the section it links to, and a phrase the answer must contain.
 *
 * Usage: node scripts/test-search.mjs
 */

import { answer, rank, toCSV } from "../src/lib/search.js";
import { datasets, documents } from "../src/lib/knowledge.js";

const CASES = [
  // --- flagship / NICE -----------------------------------------------------
  { q: "What is NICE?", kind: "answer", section: "nice", must: /News Intelligence Collection Exchange/i },
  { q: "tell me about the news intelligence platform", kind: "answer", section: "nice" },
  { q: "what does NICE do for sentiment", kind: "answer", section: "nice", must: /sentiment|perception/i },
  { q: "who endorsed the NICE work", kind: "answer", section: "nice", must: /ISMO\/2026|Confirmation/i },
  { q: "what does the ISMO letter say", kind: "answer", primary: "nice", must: /ISMO[/]2026[/]Dir.Communications[/]6581/ },
  { q: "reference number of the support letter", kind: "answer", section: "nice", must: /ISMO\/2026\/Dir\.Communications\/6581/ },

  // --- experience ----------------------------------------------------------
  { q: "where does he work now", kind: "answer", section: "experience", must: /Independent System/i },
  { q: "tell me about the NTDC role", kind: "answer", section: "experience", must: /National Transmission/i },
  { q: "what did he do at Artziii", kind: "answer", section: "experience", must: /Artziii/i },
  { q: "how many years of experience", kind: "answer", must: /10\+/ },

  // --- projects ------------------------------------------------------------
  { q: "what is the pickleball project", kind: "answer", must: /Pickleball/i },
  { q: "tell me about SDXP", kind: "answer", must: /Data Exchange/i },

  // --- skills / education --------------------------------------------------
  { q: "what backend skills does he have", kind: "answer", section: "skills", must: /FastAPI|Python|Laravel/i },
  { q: "is he doing a PhD", kind: "answer", section: "education", must: /PhD|Computer Science/i },
  { q: "which university for the masters", kind: "answer", section: "education", must: /Air University|Quaid/i },
  { q: "what awards has he won", kind: "answer", section: "education", must: /Employee of the Year|Appreciation|Certificate/i },
  { q: "what languages does he speak", kind: "answer", section: "about", must: /English.*Urdu.*Pashto/ },

  // --- contact -------------------------------------------------------------
  { q: "how do I contact him", kind: "answer", section: "contact", must: /@|contact/i },
  { q: "is he available for hire", kind: "answer", section: "contact", must: /Open to opportunities|available/i },

  // --- tables --------------------------------------------------------------
  { q: "show all projects in a table", kind: "table", dataset: "projects" },
  { q: "list every role with company and dates", kind: "table", dataset: "experience", columns: ["company", "period"] },
  { q: "show education with degree and institution", kind: "table", dataset: "education", columns: ["degree", "institution"] },
  { q: "list all skills", kind: "table", dataset: "skills" },
  { q: "show me the awards table", kind: "table", dataset: "achievements" },
  { q: "list the NICE core functions", kind: "table", dataset: "nice" },
  { q: "show all tools", kind: "table", dataset: "tools" },
  { q: "projects table with name and url", kind: "table", dataset: "projects", columns: ["name", "url"] },

  // --- résumé actions ------------------------------------------------------
  { q: "download the resume", kind: "resume" },
  { q: "can I get your CV as a pdf", kind: "resume" },
  { q: "export resume", kind: "resume" },

  // --- conversational ------------------------------------------------------
  { q: "hi", kind: "greeting" },
  { q: "thanks!", kind: "thanks" },
  { q: "what is the capital of France", kind: "miss" },
  { q: "do you know my cat's name", kind: "miss" },
];

let pass = 0;
const failures = [];

for (const c of CASES) {
  const res = answer(c.q);
  const problems = [];

  if (res.kind !== c.kind) problems.push(`kind=${res.kind} expected ${c.kind}`);
  if (c.section && !res.sources.some((s) => s.section === c.section)) {
    problems.push(`sections=[${res.sources.map((s) => s.section).join(",")}] missing ${c.section}`);
  }
  if (c.primary && res.sources[0]?.section !== c.primary) {
    problems.push(`primary source=${res.sources[0]?.section} expected ${c.primary}`);
  }
  if (c.must && !c.must.test(res.text)) problems.push(`text did not match ${c.must}`);
  if (c.dataset && res.table?.key !== c.dataset) problems.push(`dataset=${res.table?.key} expected ${c.dataset}`);
  if (c.columns) {
    const missing = c.columns.filter((col) => !res.table?.columns.includes(col));
    if (missing.length) problems.push(`columns missing ${missing.join(",")} (got ${res.table?.columns.join(",")})`);
  }

  if (problems.length) failures.push({ q: c.q, problems, got: res.text?.slice(0, 90) });
  else pass++;
}

// --- structural checks -----------------------------------------------------
const structural = [];
if (documents.length < 40) structural.push(`corpus is only ${documents.length} documents`);
for (const d of documents) {
  if (!d.answer || !d.section || !d.title) structural.push(`document ${d.id} is missing a field`);
}
for (const [key, ds] of Object.entries(datasets)) {
  if (!ds.rows.length) structural.push(`dataset ${key} is empty`);
  for (const row of ds.rows) {
    const missing = ds.columns.filter((c) => row[c] === undefined);
    if (missing.length) structural.push(`dataset ${key} row missing ${missing.join(",")}`);
  }
}
const csv = toCSV(datasets.projects.columns, datasets.projects.rows);
if (csv.split("\n").length !== datasets.projects.rows.length + 1) structural.push("CSV row count wrong");
if (!/"/.test(toCSV(["a"], [{ a: 'x,y "z"' }]))) structural.push("CSV does not quote separators");

// every ranked result must be reachable from a real nav section
const NAV = new Set(["home", "about", "experience", "nice", "projects", "skills", "education", "contact"]);
for (const d of documents) if (!NAV.has(d.section)) structural.push(`document ${d.id} points at unknown section ${d.section}`);

console.log(`\n  Assistant retrieval tests\n`);
console.log(`    corpus: ${documents.length} documents, ${Object.keys(datasets).length} datasets`);
console.log(`    cases : ${pass}/${CASES.length} passed`);

for (const f of failures) {
  console.log(`\n    FAIL  "${f.q}"`);
  for (const p of f.problems) console.log(`          ${p}`);
  if (f.got) console.log(`          got: ${f.got}...`);
}
for (const s of structural) console.log(`\n    STRUCT  ${s}`);

const bad = failures.length + structural.length;
console.log(bad ? `\n  x  ${bad} problem(s)\n` : `\n  OK  all ${CASES.length} cases and structural checks passed\n`);
process.exit(bad ? 1 : 0);
