import { BadgeCheck, Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/ui/BrandIcons";
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
  tools,
} from "../data/resume";

/**
 * The printable résumé.
 *
 * Every page is an explicit fixed-size box rather than letting content reflow
 * across automatic page breaks — that is what makes the generated PDF
 * deterministic. `scripts/generate-resume-pdf.mjs` asserts that no page
 * overflows its box, so adding content to resume.js can never silently clip
 * or produce a stray blank page; the build fails instead.
 *
 * Roles are split across pages by index so the split stays explicit and
 * reviewable in one place.
 */

const PAGE_ONE_ROLES = 2; // ISMO + NTDC
const TOTAL_PAGES = 3;

export function ResumeDoc() {
  const rolesPageOne = experience.slice(0, PAGE_ONE_ROLES);
  const rolesPageTwo = experience.slice(PAGE_ONE_ROLES);

  return (
    <div className="sheet">
      {/* ── page 1 ─────────────────────────────────────────────────────── */}
      <Page index={1}>
        <Masthead />

        <Section title="Professional Summary" first>
          <p className="summary">{profile.summary}</p>
        </Section>

        <Section title="Core Expertise">
          <div className="expertise">
            {highlights.map((item) => (
              <div className="expertise__cell" key={item.title}>
                <p className="expertise__title">{item.title}</p>
                <p className="expertise__body">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Professional Experience" note={`${profile.experienceYears} years`}>
          {rolesPageOne.map((role) => (
            <Role key={role.id} role={role} />
          ))}
        </Section>
      </Page>

      {/* ── page 2 ─────────────────────────────────────────────────────── */}
      <Page index={2}>
        <Section title="Professional Experience" note="continued" first>
          {rolesPageTwo.map((role) => (
            <Role key={role.id} role={role} />
          ))}
        </Section>

        <Section title="Flagship Project" note="Agentic AI">
          <Flagship />
        </Section>
      </Page>

      {/* ── page 3 ─────────────────────────────────────────────────────── */}
      <Page index={3}>
        <Section title="Technical Skills" first>
          <div className="skills">
            {skillGroups.map((group) => (
              <div className="skills__group" key={group.title}>
                <p className="skills__title">{group.title}</p>
                <div className="skills__list">
                  {group.skills.map((skill) => (
                    <span className="skills__item" key={skill.name}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Selected Projects" note={`${projects.length} delivered`}>
          <div className="projects">
            {projects.map((project) => (
              <div className="proj" key={project.name}>
                <span className="proj__dot" />
                <span className="proj__main">
                  <span className="proj__name">{project.name}</span>
                  <span className="proj__meta">
                    {project.org} · {project.url ? hostOf(project.url) : "Internal system"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education">
          {education.map((item) => (
            <div className="edu" key={item.degree}>
              <div className="edu__head">
                <p className="edu__degree">
                  {item.degree}
                  {item.honour ? <span className="edu__honour">{item.honour}</span> : null}
                </p>
                <span className="edu__year">{item.period}</span>
              </div>
              {item.institution ? (
                <p className="edu__inst">
                  {[item.institution, item.location].filter(Boolean).join(" — ")}
                </p>
              ) : null}
              <p className="edu__note">{item.note}</p>
            </div>
          ))}
        </Section>

        <Section title="Awards & Commendations">
          {achievements.map((item) => (
            <div className="award" key={`${item.title}-${item.year}`}>
              <span>
                <span className="award__name">{item.title}</span>{" "}
                <span className="award__issuer">— {item.issuer}</span>
              </span>
              <span className="award__year">{item.year}</span>
            </div>
          ))}
        </Section>

        <Section title="Languages">
          <div className="langs">
            {languages.map((lang) => (
              <span className="lang" key={lang.name}>
                <span className="lang__name">{lang.name}</span>
                <span className="lang__level">{lang.level}</span>
              </span>
            ))}
          </div>
        </Section>

        <Section title="Tools & Environments">
          <p className="tools">{tools.join("  ·  ")}</p>
        </Section>
      </Page>
    </div>
  );
}

/* ── building blocks ─────────────────────────────────────────────────────── */

function Page({ index, children }) {
  return (
    <div className="page" data-page={index}>
      <div className="page__inner">{children}</div>
      <div className="page__foot">
        <span>{profile.name}</span>
        <span>
          Page {index} of {TOTAL_PAGES}
        </span>
      </div>
    </div>
  );
}

function Section({ title, note, first = false, children }) {
  return (
    <section className={first ? "sec sec--first" : "sec"}>
      <div className="sec__head">
        <h2 className="sec__title">{title}</h2>
        <span className="sec__rule" />
        {note ? <span className="sec__note">{note}</span> : null}
      </div>
      {children}
    </section>
  );
}

function Masthead() {
  return (
    <header>
      <div className="mast">
        <div>
          <h1 className="mast__name">{profile.name}</h1>
          <p className="mast__title">
            {profile.title} · {profile.roles.slice(1).join(" · ")}
          </p>
          <p className="mast__tagline">{profile.tagline}</p>
        </div>
        <img className="mast__photo" src={profile.photo} alt="" />
      </div>

      <div className="contact">
        <ContactItem icon={Phone} text={profile.phone} />
        <ContactItem icon={Mail} text={profile.email} />
        <ContactItem icon={MapPin} text={profile.location} />
        <ContactItem icon={LinkedinIcon} text={stripScheme(profile.linkedin)} />
        <ContactItem icon={GithubIcon} text={stripScheme(profile.github)} />
        {profile.available ? <ContactItem icon={BadgeCheck} text="Open to opportunities" /> : null}
      </div>
    </header>
  );
}

function ContactItem({ icon: Icon, text }) {
  return (
    <span className="contact__item">
      <Icon />
      <span>{text}</span>
    </span>
  );
}

function Role({ role }) {
  return (
    <article className="role">
      <div className="role__head">
        <h3 className="role__title">{role.role}</h3>
        <span className="role__period">{role.period}</span>
      </div>
      <div className="role__sub">
        <p className="role__org">{role.company}</p>
        <span className="role__place">
          {role.location} · {role.type}
        </span>
      </div>
      <p className="role__blurb">{role.blurb}</p>
      <ul className="bullets">
        {role.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className="stack">
        {role.tech.map((tech) => (
          <span className="stack__item" key={tech}>
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}

function Flagship() {
  const { endorsement } = flagship;

  return (
    <>
      <div className="flag">
        <div className="flag__head">
          <p className="flag__name">
            {flagship.acronym} — {flagship.name}
          </p>
          <span className="flag__org">{flagship.org}</span>
        </div>
        <p className="flag__body">{flagship.positioning}</p>

        <div className="fn-grid">
          {flagship.coreFunctions.map((fn) => (
            <span className="fn" key={fn.title}>
              <span className="fn__dot" />
              <span className="fn__text">
                <b>{fn.title}</b>
              </span>
            </span>
          ))}
        </div>

        <div className="stack">
          {flagship.tech.map((tech) => (
            <span className="stack__item" key={tech}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="letter">
        <div className="letter__head">
          <p className="letter__title">{endorsement.title}</p>
          <span className="letter__ref">{endorsement.reference}</span>
        </div>
        <p className="letter__meta">
          {endorsement.issuer}, {endorsement.organisation} · {endorsement.date}
        </p>
        <p className="letter__quote">&ldquo;{endorsement.quotes[0]}&rdquo;</p>
      </div>
    </>
  );
}

/* ── helpers ─────────────────────────────────────────────────────────────── */

function stripScheme(url) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function hostOf(url) {
  return stripScheme(url);
}
