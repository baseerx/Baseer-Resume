/**
 * The chatbot's knowledge base.
 *
 * Every answer the assistant gives is derived from this corpus, which is built
 * entirely from `src/data/resume.js` — the same single source of truth the site
 * and the printed résumé render. Nothing is written by hand here, so the
 * assistant cannot drift from the résumé or invent a fact that is not on it.
 *
 * Each document carries:
 *   id       stable key
 *   type     used for intent routing and table lookups
 *   title    shown as the answer heading
 *   section  the anchor the "jump to" link points at
 *   answer   the exact prose returned when the document wins
 *   text     everything searchable about the document
 */

import {
  achievements,
  education,
  experience,
  flagship,
  highlights,
  languages,
  profile,
  projects,
  skillGroups,
  stats,
  tools,
} from "../data/resume.js";

const list = (items) => items.join(", ");

/* ── documents ──────────────────────────────────────────────────────────── */

function profileDocs() {
  return [
    {
      id: "profile",
      type: "profile",
      title: "Professional summary",
      section: "about",
      answer: profile.summary,
      text: [profile.summary, profile.title, profile.roles.join(" "), profile.tagline].join(" "),
      keywords: "about summary bio background who overview introduce yourself profile",
    },
    {
      id: "experience-years",
      type: "stat",
      title: "Years of experience",
      section: "about",
      answer: `${profile.name} has ${profile.experienceYears} years of professional software engineering experience, currently as ${experience[0].role} at ${experience[0].company}.`,
      text: `${profile.experienceYears} years experience seniority how long career total`,
      keywords: "how many years experience long working seniority",
    },
    {
      id: "contact",
      type: "contact",
      title: "Contact details",
      section: "contact",
      answer: `Email ${profile.email}, phone ${profile.phone}. Based in ${profile.location}. LinkedIn: ${profile.linkedin} · GitHub: ${profile.github}`,
      text: `contact email phone reach hire mobile number address location linkedin github ${profile.email} ${profile.phone} ${profile.location} ${profile.address}`,
      keywords: "contact email phone reach out hire get in touch call address where based located",
    },
    {
      id: "availability",
      type: "profile",
      title: "Availability",
      section: "contact",
      answer: profile.available
        ? `Open to opportunities — doctoral research and senior engineering roles. Reach out at ${profile.email}.`
        : "Not currently looking for new roles.",
      text: "available availability open to work hiring opportunities job looking roles vacancy",
      keywords: "available hire open work opportunity job",
    },
    ...stats.map((s, i) => ({
      id: `stat-${i}`,
      type: "stat",
      title: s.label,
      section: "home",
      answer: `${s.label}: ${s.value}${s.suffix}`,
      text: `${s.label} ${s.value}${s.suffix} stat number count`,
      keywords: s.label.toLowerCase(),
    })),
    ...highlights.map((h) => ({
      id: `highlight-${h.title}`,
      type: "highlight",
      title: h.title,
      section: "about",
      answer: `${h.title} — ${h.body}`,
      text: `${h.title} ${h.body}`,
      keywords: "expertise strength specialisation focus core",
    })),
  ];
}

function experienceDocs() {
  return experience.map((role) => ({
    id: `role-${role.id}`,
    type: "experience",
    title: `${role.role} — ${role.company}`,
    section: "experience",
    answer: `${role.role} at ${role.company} (${role.period}, ${role.location}, ${role.type}). ${role.blurb} Key work: ${role.points.slice(0, 3).join(" ")} Stack: ${list(role.tech)}.`,
    text: [
      role.role,
      role.company,
      role.period,
      role.location,
      role.type,
      role.blurb,
      role.points.join(" "),
      role.tech.join(" "),
      role.current ? "current present now latest most recent job" : "previous past former",
    ].join(" "),
    keywords: "experience job role work employer company position worked",
  }));
}

function projectDocs() {
  return projects.map((p) => ({
    id: `project-${p.name}`,
    type: "project",
    title: p.name,
    section: p.flagship ? "nice" : "projects",
    answer: `${p.name} (${p.org}, ${p.category}) — ${p.description}${p.url ? ` Live at ${p.url}.` : " Internal system, no public URL."} Built with ${list(p.tech)}.`,
    text: [p.name, p.org, p.category, p.description, p.tech.join(" "), p.url ?? "internal private"].join(" "),
    keywords: "project product built app portal system delivered work portfolio",
  }));
}

function flagshipDocs() {
  const e = flagship.endorsement;
  return [
    {
      id: "flagship",
      type: "flagship",
      title: `${flagship.acronym} — ${flagship.name}`,
      section: "nice",
      answer: `${flagship.acronym} (${flagship.name}) is ${profile.shortName}'s flagship agentic AI platform, built in-house at ${flagship.org}. ${flagship.summary}`,
      text: [
        flagship.acronym,
        flagship.name,
        flagship.org,
        flagship.positioning,
        flagship.summary,
        flagship.role,
        flagship.tech.join(" "),
        "power sector pakistan media intelligence news",
      ].join(" "),
      keywords: "nice news intelligence collection exchange flagship agentic ai platform power sector",
    },
    ...flagship.coreFunctions.map((fn) => ({
      id: `nice-fn-${fn.title}`,
      type: "nice-function",
      title: `NICE — ${fn.title}`,
      section: "nice",
      answer: `${fn.title}: ${fn.body}`,
      text: `${fn.title} ${fn.body} nice capability function feature`,
      keywords: "nice function capability feature does how works",
    })),
    {
      id: "endorsement",
      type: "letter",
      title: e.title,
      section: "nice",
      answer: `${e.title} (ref ${e.reference}, dated ${e.date}), issued by the ${e.issuer}, ${e.organisation}. Subject: ${e.subject}. It confirms: ${e.contributions.join(", ")}. Quote: "${e.quotes[0]}"`,
      text: [
        e.title,
        e.subject,
        e.reference,
        e.date,
        e.issuer,
        e.organisation,
        e.issuerNote,
        e.quotes.join(" "),
        e.contributions.join(" "),
        "letter endorsement recommendation reference verification proof confirm",
      ].join(" "),
      keywords: "letter endorsement recommendation reference ismo confirmation support verified",
    },
    ...flagship.signals.map((s) => ({
      id: `nice-signal-${s.label}`,
      type: "nice-signal",
      title: `NICE — ${s.label}`,
      section: "nice",
      answer: `${s.label}: ${s.value}. ${flagship.signalsNote}`,
      text: `${s.label} ${s.value} nice metric output signal`,
      keywords: "metric score index sentiment output signal",
    })),
  ];
}

function skillDocs() {
  return [
    ...skillGroups.map((g) => ({
      id: `skills-${g.title}`,
      type: "skills",
      title: `${g.title} skills`,
      section: "skills",
      answer: `${g.title}: ${list(g.skills.map((s) => s.name))}.`,
      text: `${g.title} ${g.skills.map((s) => s.name).join(" ")} skills stack technology proficiency`,
      keywords: "skills stack technologies tech proficiency frameworks programming",
    })),
    {
      id: "tools",
      type: "tools",
      title: "Tools & environments",
      section: "skills",
      answer: `Tools and environments: ${list(tools)}.`,
      text: `tools ide editors environments ${tools.join(" ")}`,
      keywords: "tools ide editor software environment uses",
    },
  ];
}

function educationDocs() {
  return [
    ...education.map((e) => ({
      id: `education-${e.degree}`,
      type: "education",
      title: e.degree,
      section: "education",
      answer: `${e.degree}${e.honour ? ` (${e.honour})` : ""} — ${[e.institution, e.location].filter(Boolean).join(", ")}, ${e.period}. ${e.note}`,
      text: [e.degree, e.institution, e.location, e.period, e.note, e.honour, e.inProgress ? "in progress ongoing current studying phd doctorate doctoral" : "completed"]
        .filter(Boolean)
        .join(" "),
      keywords: "education degree university qualification study academic masters phd msc bs",
    })),
    ...achievements.map((a) => ({
      id: `award-${a.title}-${a.year}`,
      type: "award",
      title: a.title,
      section: "education",
      answer: `${a.title} — ${a.issuer} (${a.year}).`,
      text: `${a.title} ${a.issuer} ${a.year}`,
      keywords: `${a.title} ${a.issuer}`,
    })),
    {
      id: "languages-all",
      type: "language",
      title: "Languages spoken",
      section: "about",
      answer: `Languages: ${languages.map((l) => `${l.name} (${l.level})`).join(", ")}.`,
      text: `languages spoken speak fluency multilingual ${languages.map((l) => `${l.name} ${l.level}`).join(" ")}`,
      keywords: "languages speak spoken fluent multilingual which languages how many languages",
    },
    {
      id: "awards-all",
      type: "award",
      title: "Awards & commendations",
      section: "education",
      answer: `${achievements.length} awards and commendations: ${achievements.map((a) => `${a.title} (${a.issuer}, ${a.year})`).join("; ")}.`,
      text: `awards achievements recognition commendations honours prizes ${achievements.map((a) => `${a.title} ${a.issuer} ${a.year}`).join(" ")}`,
      keywords: "awards achievements recognition commendation honours prizes won received",
    },
    ...languages.map((l) => ({
      id: `language-${l.name}`,
      type: "language",
      title: `${l.name} (language)`,
      section: "about",
      answer: `${l.name} — ${l.level}.`,
      text: `${l.name} ${l.level}`,
      keywords: l.name,
    })),
  ];
}

export const documents = [
  ...profileDocs(),
  ...experienceDocs(),
  ...projectDocs(),
  ...flagshipDocs(),
  ...skillDocs(),
  ...educationDocs(),
];

/* ── tabular datasets ───────────────────────────────────────────────────── */

/**
 * Structured views the assistant can render as a table. `columns` is the full
 * set it knows how to show; the query decides which subset is used.
 */
export const datasets = {
  experience: {
    label: "Experience",
    section: "experience",
    columns: ["role", "company", "period", "location", "type", "tech"],
    rows: experience.map((r) => ({
      role: r.role,
      company: r.company,
      period: r.period,
      location: r.location,
      type: r.type,
      tech: r.tech.join(", "),
    })),
  },
  projects: {
    label: "Projects",
    section: "projects",
    columns: ["name", "org", "category", "tech", "url", "description"],
    rows: projects.map((p) => ({
      name: p.name,
      org: p.org,
      category: p.category,
      tech: p.tech.join(", "),
      url: p.url ?? "—",
      description: p.description,
    })),
  },
  skills: {
    label: "Skills",
    section: "skills",
    columns: ["skill", "group", "level"],
    rows: skillGroups.flatMap((g) =>
      g.skills.map((s) => ({ skill: s.name, group: g.title, level: `${s.level}%` })),
    ),
  },
  education: {
    label: "Education",
    section: "education",
    columns: ["degree", "institution", "period", "location", "honour"],
    rows: education.map((e) => ({
      degree: e.degree,
      institution: e.institution ?? "—",
      period: e.period,
      location: e.location ?? "—",
      honour: e.honour ?? "—",
    })),
  },
  achievements: {
    label: "Awards & commendations",
    section: "education",
    columns: ["title", "issuer", "year"],
    rows: achievements.map((a) => ({ title: a.title, issuer: a.issuer, year: a.year })),
  },
  languages: {
    label: "Languages",
    section: "about",
    columns: ["language", "level"],
    rows: languages.map((l) => ({ language: l.name, level: l.level })),
  },
  tools: {
    label: "Tools & environments",
    section: "skills",
    columns: ["tool"],
    rows: tools.map((t) => ({ tool: t })),
  },
  nice: {
    label: "NICE — core functions",
    section: "nice",
    columns: ["function", "what it does"],
    rows: flagship.coreFunctions.map((f) => ({ function: f.title, "what it does": f.body })),
  },
  contact: {
    label: "Contact",
    section: "contact",
    columns: ["channel", "value"],
    rows: [
      { channel: "Email", value: profile.email },
      { channel: "Phone", value: profile.phone },
      { channel: "Location", value: profile.location },
      { channel: "LinkedIn", value: profile.linkedin },
      { channel: "GitHub", value: profile.github },
    ],
  },
};

export const SECTION_LABELS = {
  home: "Home",
  about: "About",
  experience: "Experience",
  nice: "NICE",
  projects: "Projects",
  skills: "Skills",
  education: "Education",
  contact: "Contact",
};
