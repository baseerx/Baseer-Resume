/**
 * Retrieval for the résumé assistant.
 *
 * A real BM25 index over the résumé corpus plus intent routing, run entirely in
 * the browser. There is no model call: answers are retrieved verbatim from
 * `knowledge.js`, which is derived from `resume.js`. That is deliberate — a
 * static site cannot hold an API key safely, and a résumé is exactly the case
 * where a confidently wrong answer is worse than no answer.
 */

import { experience } from "../data/resume.js";
import { datasets, documents, SECTION_LABELS } from "./knowledge.js";

/* ── tokenisation ───────────────────────────────────────────────────────── */

const STOPWORDS = new Set(
  `a an the and or but of in on at to for with about from by is are was were be been being do does did
   have has had i you he she it we they me him her them my your his their this that these those what
   which who whom whose when where why how can could should would will shall may might must not no
   yes please tell show give list any some all more most much many any there here as if than then so
   into over under again further once during before after above below up down out off own same too very
   s t just don now`.split(/\s+/),
);

/** Light stemmer — enough to unify plurals and common verb endings. */
function stem(word) {
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && w.endsWith("sses")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us")) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  return w;
}

export function tokenize(text, { keepStopwords = false } = {}) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#./\- ]+/g, " ")
    .split(/[\s/]+/)
    .map((t) => t.replace(/^[-.]+|[-.]+$/g, ""))
    .filter((t) => t.length > 1 || t === "c")
    .filter((t) => keepStopwords || !STOPWORDS.has(t))
    .map(stem);
}

/**
 * Query-side expansion: the words people actually type mapped onto the words
 * the résumé uses.
 */
const SYNONYMS = {
  job: ["experience", "role", "work", "company"],
  work: ["experience", "role", "job"],
  career: ["experience", "role"],
  employer: ["company", "experience"],
  workplace: ["company", "experience"],
  cv: ["resume"],
  study: ["education", "degree"],
  studied: ["education", "degree"],
  qualification: ["education", "degree"],
  uni: ["university", "education"],
  college: ["university", "education"],
  school: ["university", "education"],
  phd: ["doctorate", "doctoral", "education"],
  doctorate: ["phd", "education"],
  masters: ["master", "msc", "education"],
  tech: ["technology", "skill", "stack"],
  stack: ["technology", "skill"],
  framework: ["skill", "technology"],
  language: ["skill", "programming"],
  ai: ["agentic", "artificial", "intelligence", "llm", "rag"],
  llm: ["ai", "agentic", "model"],
  ml: ["machine", "learning"],
  bot: ["chatbot", "agentic"],
  award: ["achievement", "recognition", "commendation"],
  achievement: ["award", "recognition"],
  email: ["contact", "mail"],
  phone: ["contact", "mobile", "number"],
  hire: ["contact", "available", "opportunity"],
  reach: ["contact"],
  portfolio: ["project"],
  app: ["project", "product"],
  product: ["project"],
  built: ["project", "developed"],
  nice: ["news", "intelligence", "collection", "exchange", "flagship"],
  ismo: ["independent", "system", "market", "operator"],
  ntdc: ["national", "transmission", "dispatch"],
  letter: ["endorsement", "recommendation", "reference", "confirmation"],
  recommendation: ["letter", "endorsement", "reference"],
  location: ["based", "city", "islamabad"],
  salary: ["contact"],
  age: ["profile"],
};

function expand(tokens) {
  const out = [...tokens];
  for (const t of tokens) {
    const syn = SYNONYMS[t];
    if (syn) out.push(...syn.map(stem));
  }
  return out;
}

/* ── index ──────────────────────────────────────────────────────────────── */

function buildIndex(docs) {
  const N = docs.length;
  const df = new Map();
  const entries = docs.map((doc) => {
    const body = tokenize(`${doc.title} ${doc.text} ${doc.keywords ?? ""}`);
    const titleTokens = new Set(tokenize(doc.title));
    const tf = new Map();
    for (const t of body) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of new Set(body)) df.set(t, (df.get(t) ?? 0) + 1);
    return { doc, tf, titleTokens, length: body.length };
  });
  const avgLen = entries.reduce((s, e) => s + e.length, 0) / Math.max(1, entries.length);
  const idf = new Map();
  for (const [term, n] of df) idf.set(term, Math.log(1 + (N - n + 0.5) / (n + 0.5)));
  return { entries, idf, avgLen };
}

const INDEX = buildIndex(documents);

const K1 = 1.5;
const B = 0.72;

/**
 * Some questions are about a kind of document, not just its words. The award
 * list and the endorsement letter describe the same commendation in almost the
 * same vocabulary, and without this the one-line award row outranks the letter
 * on "what does the letter say".
 */
const TYPE_AFFINITY = [
  [/\b(letter|endorsement|recommendation|reference|testimonial|quote|confirmw*)\b/i, "letter", 8],
  [/\b(core function|capabilitw*|featurew*)\b/i, "nice-function", 3],
  [/\b(metric|score|index|sentiment)\b/i, "nice-signal", 3],
];
/** BM25 with a title boost and a phrase bonus. */
export function rank(query, limit = 5) {
  const base = tokenize(query);
  if (!base.length) return [];
  const terms = expand(base);
  const phrase = String(query).toLowerCase().trim();

  const scored = INDEX.entries.map((entry) => {
    let score = 0;
    for (const term of terms) {
      const f = entry.tf.get(term);
      if (!f) continue;
      const idf = INDEX.idf.get(term) ?? 0;
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * (entry.length / INDEX.avgLen))));
      if (entry.titleTokens.has(term)) score += idf * 0.9;
    }
    for (const [re, type, boost] of TYPE_AFFINITY) {
      if (entry.doc.type === type && re.test(query)) score += boost;
    }
    // whole-phrase hit in the title or answer is a very strong signal
    if (phrase.length > 3) {
      if (entry.doc.title.toLowerCase().includes(phrase)) score += 6;
      else if (entry.doc.answer.toLowerCase().includes(phrase)) score += 2.5;
    }
    return { doc: entry.doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ── intent ─────────────────────────────────────────────────────────────── */

const TABLE_TRIGGERS =
  /\b(table|tabular|columns?|list|show|all|every|compare|breakdown|grid|spreadsheet|rows?)\b/i;
const EXPORT_TRIGGERS = /\b(export|csv|download|save|excel|copy)\b/i;
const RESUME_TRIGGERS = /\b(resume|cv|pdf|curriculum)\b/i;
const CURRENT_RE = /\b(current|currently|now|nowadays|present|latest|today|these days|at the moment)\b/i;
const ROLE_RE = /\b(work|working|works|job|role|company|employer|employed|position|doing)\b/i;

/**
 * Relevance floor. Measured separation on this corpus: on-topic questions
 * score 7.3 and up, off-topic ones 3.3 and below. Under this we say we do
 * not know rather than return the least-bad document.
 */
const MIN_SCORE = 5;

/** Which dataset is the question about? */
const DATASET_HINTS = [
  ["experience", /\b(experience|job|jobs|role|roles|work|employment|career|compan(y|ies)|position)\b/i],
  ["projects", /\b(project|projects|portfolio|product|products|app|apps|built|delivered)\b/i],
  ["skills", /\b(skill|skills|stack|tech|technolog|framework|language[sz]?\s+used|proficien)\b/i],
  ["education", /\b(education|degree|degrees|qualification|universit|academic|phd|master|study|studies)\b/i],
  ["achievements", /\b(award|awards|achievement|recognition|commendation|medal|certificate|honou?r)\b/i],
  ["languages", /\b(language|languages|speak|spoken|fluen)\b/i],
  ["tools", /\b(tool|tools|ide|editor|environment)\b/i],
  ["nice", /\b(nice|core function|capabilit|feature)\b/i],
  ["contact", /\b(contact|email|phone|reach|hire|address)\b/i],
];

function detectDataset(query) {
  for (const [key, re] of DATASET_HINTS) if (re.test(query)) return key;
  return null;
}

/**
 * Pick the columns the question actually asked for, e.g.
 * "projects with name and tech" -> ["name", "tech"].
 */
function detectColumns(query, dataset) {
  const q = query.toLowerCase();
  const aliases = {
    role: ["role", "title", "position", "designation"],
    company: ["company", "employer", "organisation", "organization", "org"],
    period: ["period", "date", "dates", "when", "duration", "year", "years", "timeline"],
    location: ["location", "city", "where", "place"],
    type: ["type", "contract", "employment"],
    tech: ["tech", "stack", "technology", "technologies", "tools", "built"],
    name: ["name", "title", "project"],
    org: ["org", "organisation", "organization", "company", "client"],
    category: ["category", "kind", "type"],
    url: ["url", "link", "site", "website", "live"],
    description: ["description", "detail", "details", "about", "summary"],
    skill: ["skill", "skills", "name"],
    group: ["group", "category", "area"],
    level: ["level", "proficiency", "rating", "percent"],
    degree: ["degree", "qualification", "name"],
    institution: ["institution", "university", "school", "college"],
    honour: ["honour", "honor", "medal", "distinction"],
    title: ["title", "name", "award"],
    issuer: ["issuer", "by", "from", "awarded"],
    year: ["year", "when", "date"],
    language: ["language", "name"],
    tool: ["tool", "name"],
    channel: ["channel", "type"],
    value: ["value", "detail"],
    function: ["function", "capability", "feature", "name"],
    "what it does": ["description", "detail", "does", "explanation"],
  };

  const asked = dataset.columns.filter((col) =>
    (aliases[col] ?? [col]).some((a) => new RegExp(`\\b${a}\\b`, "i").test(q)),
  );
  // "everything"/"all columns" or nothing recognised -> sensible default
  if (/\ball (the )?(columns|fields|details)\b|\beverything\b|\bfull\b/i.test(q)) return dataset.columns;
  if (!asked.length) return dataset.columns.slice(0, Math.min(4, dataset.columns.length));
  return asked;
}

/* ── answering ──────────────────────────────────────────────────────────── */

const GREETING = /^(hi|hey|hello|salam|assalam|good (morning|afternoon|evening))\b/i;
const THANKS = /\b(thanks|thank you|shukriya|cheers)\b/i;

export const SUGGESTIONS = [
  "What is NICE?",
  "Show all projects in a table",
  "Experience with company and dates",
  "What does the ISMO letter say?",
  "List skills by group",
  "Download the résumé",
];

/**
 * Answer a question.
 * Returns { kind, text, sources[], table?, actions[] } — never null.
 */
export function answer(query) {
  const q = String(query ?? "").trim();
  if (!q) {
    return {
      kind: "empty",
      text: "Ask me anything about this résumé — experience, projects, NICE, skills, education or contact details.",
      sources: [],
      actions: [],
    };
  }

  if (GREETING.test(q) && q.length < 24) {
    return {
      kind: "greeting",
      text: "Hello. I answer questions about this résumé — every reply comes straight from its content. Try one of the suggestions, or ask for anything as a table.",
      sources: [],
      actions: [{ type: "resume" }],
    };
  }

  if (THANKS.test(q) && q.length < 30) {
    return { kind: "thanks", text: "Any time. Ask away if anything else comes up.", sources: [], actions: [] };
  }

  // "download my resume" / "export the cv"
  if (RESUME_TRIGGERS.test(q) && (EXPORT_TRIGGERS.test(q) || /\b(get|give|want|need|send|link)\b/i.test(q))) {
    return {
      kind: "resume",
      text: "Here is the résumé — a typeset US Letter PDF generated from this same content, so it always matches the site.",
      sources: [],
      actions: [{ type: "resume" }, { type: "print" }],
    };
  }

  // "where does he work now" is asking about the current role specifically —
  // better handled outright than left to BM25 to choose between that role and
  // the availability blurb, which share most of their vocabulary.
  if (CURRENT_RE.test(q) && ROLE_RE.test(q)) {
    const currentRole = experience.find((r) => r.current);
    const doc = currentRole && documents.find((d) => d.id === `role-${currentRole.id}`);
    if (doc) {
      return {
        kind: "answer",
        title: doc.title,
        text: doc.answer,
        sources: [{ section: "experience", label: SECTION_LABELS.experience }],
        actions: [{ type: "export", dataset: "experience" }, { type: "resume" }],
      };
    }
  }

  const hits = rank(q, 5);
  const datasetKey = detectDataset(q);
  const wantsTable = TABLE_TRIGGERS.test(q);

  // A table is right when the question names a dataset AND asks to see it
  // listed, or when it names columns explicitly.
  if (datasetKey && (wantsTable || /\bwith\b.*\b(and|,)\b/i.test(q))) {
    const ds = datasets[datasetKey];
    const columns = detectColumns(q, ds);
    return {
      kind: "table",
      text: `${ds.label} — ${ds.rows.length} ${ds.rows.length === 1 ? "entry" : "entries"}${
        columns.length < ds.columns.length ? `, showing ${columns.join(", ")}` : ""
      }.`,
      table: { key: datasetKey, label: ds.label, columns, rows: ds.rows },
      sources: [{ section: ds.section, label: SECTION_LABELS[ds.section] ?? ds.label }],
      actions: [{ type: "export", dataset: datasetKey }, { type: "resume" }],
    };
  }

  if (!hits.length || hits[0].score < MIN_SCORE) {
    return {
      kind: "miss",
      text: "I could not find that on the résumé. I can cover experience, projects, NICE and the ISMO letter, skills, education, awards, languages and contact details — try one of those, or ask for a table.",
      sources: [],
      actions: [{ type: "resume" }],
      suggestions: SUGGESTIONS.slice(0, 3),
    };
  }

  const best = hits[0];
  const others = hits.slice(1, 3).filter((h) => h.score > best.score * 0.45);

  return {
    kind: "answer",
    text: best.doc.answer,
    title: best.doc.title,
    sources: [
      { section: best.doc.section, label: SECTION_LABELS[best.doc.section] ?? best.doc.section },
      ...others
        .filter((h) => h.doc.section !== best.doc.section)
        .map((h) => ({ section: h.doc.section, label: SECTION_LABELS[h.doc.section] ?? h.doc.section })),
    ].filter((s, i, arr) => arr.findIndex((x) => x.section === s.section) === i),
    related: others.map((h) => h.doc.title),
    actions: datasetKey ? [{ type: "export", dataset: datasetKey }, { type: "resume" }] : [{ type: "resume" }],
  };
}

/* ── export ─────────────────────────────────────────────────────────────── */

export function toCSV(columns, rows) {
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.map(esc).join(","), ...rows.map((r) => columns.map((c) => esc(r[c])).join(","))].join(
    "\n",
  );
}
