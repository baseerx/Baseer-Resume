import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CornerDownLeft,
  Download,
  FileDown,
  MessageSquare,
  Printer,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { profile } from "../data/resume";
import { datasets } from "../lib/knowledge";
import { answer, SUGGESTIONS, toCSV } from "../lib/search";

/**
 * Résumé assistant — retrieval-augmented Q&A over the whole site.
 *
 * Retrieval runs in the browser against a BM25 index of the résumé (see
 * `lib/search.js`), so answers are quoted from the résumé itself rather than
 * generated: it can say "I don't know", but it cannot invent a job or a date.
 * Replies carry a link to the section they came from, render as a table when
 * the question asks for one, and can export that table as CSV.
 */

let idSeq = 0;
const nextId = () => `m${++idSeq}`;

const GREETING = {
  id: nextId(),
  from: "bot",
  reply: {
    kind: "greeting",
    text: `Ask me anything about ${profile.shortName}'s résumé — experience, projects, NICE, skills, education or contact details. Answers come straight from this page, and I can show results as a table you can export.`,
    sources: [],
    actions: [{ type: "resume" }],
  },
};

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const reduced = useReducedMotion();

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // keep the transcript pinned to the newest message
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 240);
  }, [open]);

  // Escape closes, and the panel traps nothing else — the page stays usable
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = (text) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { id: nextId(), from: "user", text: q }]);
    setDraft("");
    setThinking(true);
    // a beat of latency so the exchange reads as a conversation
    setTimeout(
      () => {
        setMessages((m) => [...m, { id: nextId(), from: "bot", reply: answer(q) }]);
        setThinking(false);
      },
      reduced ? 0 : 260,
    );
  };

  const jump = (section) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }, 180);
  };

  return (
    <>
      <Launcher open={open} onClick={() => setOpen((v) => !v)} />

      <AnimatePresence>
        {open ? (
          <motion.div
            key="assistant"
            ref={panelRef}
            role="dialog"
            aria-label="Résumé assistant"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="no-print fixed inset-x-3 bottom-3 z-[65] flex max-h-[82svh] flex-col overflow-hidden rounded-2xl sheet shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[26rem] sm:max-h-[min(34rem,72svh)] lg:w-[28rem]"
          >
            <Header onClose={() => setOpen(false)} />

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) =>
                m.from === "user" ? (
                  <UserBubble key={m.id} text={m.text} />
                ) : (
                  <BotBubble key={m.id} reply={m.reply} onJump={jump} onAsk={send} />
                ),
              )}
              {thinking ? <Typing /> : null}
            </div>

            <Composer
              ref={inputRef}
              value={draft}
              onChange={setDraft}
              onSubmit={() => send(draft)}
              onPick={send}
              showChips={messages.length <= 1}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/* ── launcher ───────────────────────────────────────────────────────────── */

function Launcher({ open, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close the résumé assistant" : "Ask about this résumé"}
      aria-expanded={open}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.94 }}
      // On phones the panel spans the full width, so the launcher would sit on
      // top of the composer — the header's close button covers it there.
      className={`no-print fixed bottom-6 left-6 z-[66] h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-3 text-white shadow-xl shadow-brand/30 sm:h-14 sm:w-14 ${
        open ? "hidden sm:grid" : "grid"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={open ? "close" : "chat"}
          initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.2 }}
          className="absolute grid place-items-center"
        >
          {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
      {!open ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-bg bg-brand-2"
        />
      ) : null}
    </motion.button>
  );
}

function Header({ onClose }) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white">
        <Sparkles className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.9rem] font-semibold leading-tight text-ink">Résumé assistant</p>
        <p className="truncate text-[0.7rem] text-ink-faint">
          Answers drawn from this page — never invented
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line-strong text-ink-faint transition-colors hover:border-brand/45 hover:text-brand"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── messages ───────────────────────────────────────────────────────────── */

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] text-pretty rounded-2xl rounded-br-md bg-gradient-to-br from-brand to-brand-3 px-3.5 py-2 text-[0.84rem] leading-relaxed text-white shadow-md shadow-brand/20">
        {text}
      </p>
    </div>
  );
}

function BotBubble({ reply, onJump, onAsk }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] min-w-0 rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-2.5 shadow-sm">
        {reply.title ? (
          <p className="mb-1 text-[0.78rem] font-semibold text-brand">{reply.title}</p>
        ) : null}
        <p className="text-pretty text-[0.84rem] leading-relaxed text-ink-soft">{reply.text}</p>

        {reply.table ? <ResultTable table={reply.table} /> : null}

        {reply.sources?.length ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {reply.sources.map((s) => (
              <button
                key={s.section}
                type="button"
                data-jump={s.section}
                onClick={() => onJump(s.section)}
                className="inline-flex items-center gap-1 rounded-lg border border-brand/25 bg-brand/10 px-2 py-1 text-[0.68rem] font-medium text-brand transition-colors hover:bg-brand/20"
              >
                <ArrowRight className="h-3 w-3" />
                {s.label}
              </button>
            ))}
          </div>
        ) : null}

        {reply.actions?.length ? <Actions actions={reply.actions} /> : null}

        {reply.suggestions?.length ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {reply.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onAsk(s)}
                className="rounded-lg border border-line-strong px-2 py-1 text-[0.68rem] text-ink-faint transition-colors hover:border-brand/45 hover:text-brand"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.14 }}
            className="h-1.5 w-1.5 rounded-full bg-brand"
          />
        ))}
      </div>
    </div>
  );
}

/* ── table + actions ────────────────────────────────────────────────────── */

function ResultTable({ table }) {
  const { columns, rows, label } = table;
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-line">
      <div className="max-h-56 overflow-auto">
        <table className="w-full border-collapse text-left text-[0.72rem]">
          <thead className="sticky top-0 bg-bg-soft">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="whitespace-nowrap border-b border-line px-2.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-ink-faint"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="align-top even:bg-line/25">
                {columns.map((c) => (
                  <td key={c} className="border-b border-line/60 px-2.5 py-1.5 text-ink-soft">
                    {String(row[c] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-ink-faint">
        {label} · {rows.length} rows
      </p>
    </div>
  );
}

function Actions({ actions }) {
  const [saved, setSaved] = useState(false);

  const exportCsv = (key) => {
    const ds = datasets[key];
    if (!ds) return;
    const csv = toCSV(ds.columns, ds.rows);
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.shortName.replace(/\s+/g, "-").toLowerCase()}-${key}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {actions.map((action) => {
        if (action.type === "export") {
          return (
            <button
              key="export"
              type="button"
              onClick={() => exportCsv(action.dataset)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-2 py-1 text-[0.68rem] font-medium text-ink-soft transition-colors hover:border-brand/45 hover:text-brand"
            >
              <FileDown className="h-3 w-3" />
              {saved ? "Saved" : "Export CSV"}
            </button>
          );
        }
        if (action.type === "resume") {
          return (
            <a
              key="resume"
              href={profile.resumeFile}
              download
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-2 py-1 text-[0.68rem] font-medium text-ink-soft transition-colors hover:border-brand/45 hover:text-brand"
            >
              <Download className="h-3 w-3" />
              Download résumé
            </a>
          );
        }
        if (action.type === "print") {
          return (
            <a
              key="print"
              href={profile.resumeFile}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-2 py-1 text-[0.68rem] font-medium text-ink-soft transition-colors hover:border-brand/45 hover:text-brand"
            >
              <Printer className="h-3 w-3" />
              Open to print
            </a>
          );
        }
        return null;
      })}
    </div>
  );
}

/* ── composer ───────────────────────────────────────────────────────────── */

// React 19 passes `ref` as an ordinary prop, so no forwardRef ceremony needed.
function Composer({ value, onChange, onSubmit, onPick, showChips, ref }) {
  const chips = useMemo(() => SUGGESTIONS.slice(0, 4), []);

  return (
    <div className="border-t border-line px-3 pb-3 pt-2.5">
      {showChips ? (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onPick(c)}
              className="rounded-lg border border-line-strong px-2 py-1 text-[0.68rem] text-ink-faint transition-colors hover:border-brand/45 hover:text-brand"
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex items-center gap-2 rounded-xl border border-line-strong bg-surface px-2.5 py-1.5 focus-within:border-brand/50"
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask about experience, NICE, skills…"
          aria-label="Ask a question about this résumé"
          className="min-w-0 flex-1 bg-transparent text-[0.82rem] text-ink outline-none placeholder:text-ink-faint/70"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-3 text-white transition-opacity disabled:opacity-35"
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
