"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  discoveryNodes,
  experiments,
  notebookEntries,
  profile,
} from "./data";
import { GithubContribution } from "./GithubContribution";

const nav = [
  "profile",
  "observe",
  "experiments",
  "notebook",
  "archive",
  "contact",
] as const;

const navLabels = {
  profile: "PROFILE",
  observe: "OBSERVE",
  experiments: "EXPERIMENT",
  notebook: "NOTEBOOK",
  archive: "ARCHIVE",
  contact: "CONTACT",
};

type Section = (typeof nav)[number];

function mark(text: string) {
  return <span className="mark">{text}</span>;
}

export function Laboratory() {
  const [entered, setEntered] = useState(false);
  const [section, setSection] = useState<Section>("observe");
  const [statusOpen, setStatusOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [caseStudy, setCaseStudy] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const go = (next: Section) => {
    setSection(next);
    setCaseStudy(false);
    setHasNavigated(true);

    setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 20);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "e" && !entered) {
        setEntered(true);
      }

      if (event.key === "Escape") {
        setTerminalOpen(false);
        setStatusOpen(false);
      }

      if (event.key.toLowerCase() === "t" && entered) {
        setTerminalOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [entered]);

  return (
    <main className="lab-shell">
      <AnimatePresence mode="wait">
        {!entered ? (
          <Entry
            key="entry"
            onEnter={() => setEntered(true)}
            onStatus={() => setStatusOpen(!statusOpen)}
            statusOpen={statusOpen}
            onCase={() => {
              setEntered(true);
              setCaseStudy(true);
              setHasNavigated(true);
            }}
          />
        ) : (
          <motion.div
            key="lab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.65,
            }}
          >
            <Header
              section={section}
              onNavigate={go}
              onTerminal={() => setTerminalOpen(true)}
              onHome={() => {
                setTerminalOpen(false);
                setCaseStudy(false);
                setEntered(false);
                setHasNavigated(false);
              }}
            />

            {!hasNavigated && (
              <section className="lab-intro">
                <p className="eyebrow">LABORATORY_07 / OPEN SESSION</p>

                <h1>
                  Make the invisible
                  <br />
                  legible.
                </h1>

                <p>
                  A living record of questions, experiments, failures, and
                  things still in motion.
                </p>

                <button
                  className="text-button"
                  onClick={() => go("experiments")}
                >
                  VIEW ACTIVE EXPERIMENTS <b>↘</b>
                </button>
              </section>
            )}

            <div ref={sectionRef}>
              {caseStudy ? (
                <Viriditas onBack={() => setCaseStudy(false)} />
              ) : (
                <SectionView
                  section={section}
                  onCase={() => setCaseStudy(true)}
                  onNavigate={go}
                />
              )}
            </div>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {terminalOpen && (
          <Terminal
            onClose={() => setTerminalOpen(false)}
            onNavigate={go}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function Entry({
  onEnter,
  onStatus,
  statusOpen,
  onCase,
}: {
  onEnter: () => void;
  onStatus: () => void;
  statusOpen: boolean;
  onCase: () => void;
}) {
  return (
    <motion.section
      className="entry"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="entry-header">
        <div>
          <p className="wordmark">LABORATORY_07</p>
          <span>/// PERSONAL RESEARCH NODE</span>
        </div>

        <div className="initialize">
          SYSTEM INITIALIZED
          <br />
          {mark("● READY")}
        </div>

        <div className="status-wrap">
          <button className="status-button" onClick={onStatus}>
            SYSTEM STATUS
            <br />
            {mark("● OPERATIONAL")}
          </button>

          {statusOpen && (
            <div className="status-popover">
              UPTIME: SESSION ACTIVE
              <br />
              SIGNAL: STABLE
              <br />
              PRIVACY: LOCAL
            </div>
          )}
        </div>
      </header>

      <div className="entry-grid">
        <aside className="entry-left">
          <Orbital onCase={onCase} />

          <nav className="entry-nav">
            {nav.map((item, index) => (
              <button onClick={onEnter} key={item}>
                <i>0{index + 1}</i>

                <span>
                  {navLabels[item]}
                  <small>
                    {
                      [
                        "Meet the researcher",
                        "Understand the subject",
                        "Test a question",
                        "Capture the trace",
                        "Retrieve prior work",
                        "Begin a signal",
                      ][index]
                    }
                  </small>
                </span>

                <b>↗</b>
              </button>
            ))}
          </nav>
        </aside>

        <section className="entry-hero">
          <p className="eyebrow">THE EXPERIMENT / 07.01</p>

          <h1>
            Not a portfolio.
            <br />
            <em>A field station.</em>
          </h1>

          <p className="hero-copy">
            An interactive index of work, questions, and evidence designed to
            reveal how ideas move from observation into form.
          </p>

          <button
            className="enter-button"
            onClick={onEnter}
          >
            <span>ENTER LABORATORY</span>
            <kbd>E</kbd>
            <i>→</i>
          </button>

          <p className="scroll-cue">
            SCROLL TO INITIATE <span>↓</span>
          </p>
        </section>

        <aside className="entry-right">
          <Environment />
          <LiveFeed />

          <div className="coords">
            RESEARCH ORIENTATION
            <br />
            <strong>
              AI / VISION
              <br />
              DATA / SYSTEMS
            </strong>
            <small>PERSONAL RESEARCH NODE</small>
          </div>
        </aside>
      </div>

      <footer className="entry-footer">
        <span>BUILD 07.01 / {new Date().getFullYear()}</span>
        <span>ALL SYSTEMS INTENTIONAL</span>

        <button onClick={onEnter}>
          INITIALIZE EXPERIENCE ↗
        </button>
      </footer>
    </motion.section>
  );
}

type DomainKey = "AI" | "VISION" | "DATA" | "SYSTEMS" | "CREATE";

type ResearchDomain = {
  title: string;
  label: string;
  description: string;
  details: string[];
  status?: string;
  connection?: string;
  activeResearch?: string;
  actionLabel?: string;
};

const researchDomains: Record<DomainKey, ResearchDomain> = {
  AI: {
    title: "AI",
    label: "INTELLIGENCE / LEARNING SYSTEMS",
    description:
      "Exploring how machines can learn patterns, make predictions, and assist human reasoning.",
    details: ["MACHINE LEARNING", "EXPERIMENTATION", "MODEL THINKING", "EVALUATION"],
    status: "EXPLORING",
  },
  VISION: {
    title: "VISION",
    label: "COMPUTER VISION / VISUAL UNDERSTANDING",
    description:
      "Investigating how visual systems extract meaning from images, and where human judgment remains necessary.",
    details: ["IMAGE DATA", "CLASSIFICATION", "DATA QUALITY", "HUMAN JUDGMENT"],
    activeResearch: "VIRIDITAS",
    actionLabel: "OPEN VIRIDITAS →",
  },
  DATA: {
    title: "DATA",
    label: "EVIDENCE / DATA QUALITY",
    description:
      "Treating data preparation as part of the research itself, not merely a step before modeling.",
    details: ["DATASETS", "PREPROCESSING", "LABEL NORMALIZATION", "DUPLICATE LEAKAGE"],
    connection: "VIRIDITAS",
    actionLabel: "EXPLORE VIRIDITAS →",
  },
  SYSTEMS: {
    title: "SYSTEMS",
    label: "STRUCTURE / ENGINEERING",
    description:
      "Building technical structures that keep experiments, interfaces, and ideas understandable.",
    details: ["WEB APPLICATIONS", "DATA PIPELINES", "INTERACTIVE SYSTEMS", "SOFTWARE STRUCTURE"],
    status: "BUILDING",
  },
  CREATE: {
    title: "CREATE",
    label: "INTERACTION / COMMUNICATION",
    description:
      "Turning complex ideas into interfaces, visual systems, and experiences that people can actually understand.",
    details: ["INTERACTION", "VISUAL DESIGN", "EXPERIMENTAL INTERFACES", "COMMUNICATION"],
    status: "MAKING",
  },
};

const researchDomainOrder: DomainKey[] = [
  "AI",
  "VISION",
  "DATA",
  "SYSTEMS",
  "CREATE",
];

const domainLinks: Record<DomainKey, DomainKey[]> = {
  AI: ["VISION", "DATA"],
  VISION: ["AI", "DATA", "CREATE"],
  DATA: ["AI", "VISION", "SYSTEMS"],
  SYSTEMS: ["DATA", "CREATE"],
  CREATE: ["VISION", "SYSTEMS"],
};

function Orbital({ onCase }: { onCase: () => void }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<DomainKey | null>(null);
  const [hovered, setHovered] = useState<DomainKey | null>(null);

  const activeKey = hovered ?? active;
  const selectedDomain = active ? researchDomains[active] : null;
  const isDefaultState = active === null && hovered === null;

  return (
    <div className="orbital-panel orbital-panel--stable">
      <p className="panel-label">RESEARCH NODE 07</p>

      <div className="orbital-stage">
        <div className={`orbital ${reduceMotion ? "reduced-motion" : ""}`} aria-live="polite">
          <div className={`orbit o1 ${activeKey ? "is-linked" : ""}`} />
          <div className={`orbit o2 ${activeKey ? "is-linked" : ""}`} />

          <button
            type="button"
            className="core"
            onClick={() => setActive(null)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActive(null);
              }
            }}
            aria-label="Reset research node"
          >
            07
          </button>

          {researchDomainOrder.map((node, index) => {
            const domain = researchDomains[node];
            const isSelected = active === node;
            const isHovered = hovered === node;
            const isLinked = !!active && domainLinks[active].includes(node);
            const isActive = activeKey === node;

            return (
              <button
                key={node}
                type="button"
                className={`orbit-node node-${index} ${
                  isSelected ? "active" : ""
                } ${isHovered ? "hovered" : ""} ${
                  isLinked ? "linked" : ""
                } ${activeKey && !isActive && !isLinked ? "muted" : ""}`}
                onMouseEnter={() => setHovered(node)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(node)}
                onBlur={() => setHovered(null)}
                onClick={() => setActive(node)}
                aria-label={`Select ${domain.title} research domain`}
                aria-pressed={isSelected}
                data-node={node}
              >
                {node}
              </button>
            );
          })}
        </div>

        <div className="orbital-panel__info-wrap">
          <div className={`orbital-panel__info ${selectedDomain ? "is-visible" : ""}`}>
            {selectedDomain ? (
              <>
                <div className="orbital-panel__meta">
                  <p className="panel-label">FOCUS / {selectedDomain.title}</p>
                  <span className="orbital-status">{selectedDomain.status ?? "ACTIVE"}</span>
                </div>

                <h3 className="orbital-domain-title">{selectedDomain.title}</h3>
                <p className="orbital-domain-label">{selectedDomain.label}</p>
                <p className="orbital-domain-description">{selectedDomain.description}</p>

                <div className="orbital-domain-details">
                  {selectedDomain.details.map((detail) => (
                    <span key={detail}>{detail}</span>
                  ))}
                </div>

                <div className="orbital-domain-footer">
                  {selectedDomain.activeResearch ? (
                    <span className="orbital-meta">ACTIVE RESEARCH / {selectedDomain.activeResearch}</span>
                  ) : null}

                  {selectedDomain.connection ? (
                    <span className="orbital-meta">CONNECTION / {selectedDomain.connection}</span>
                  ) : null}

                  {selectedDomain.actionLabel ? (
                    <button
                      type="button"
                      className="orbital-action"
                      onClick={onCase}
                    >
                      {selectedDomain.actionLabel}
                    </button>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="orbital-panel__empty">
                <p className="panel-label">RESEARCH NODE 07</p>
                <p className="orbital-domain-description">
                  Select a domain to trace how the work moves from question to form.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="tiny">
        {selectedDomain
          ? `FOCUS: ${selectedDomain.title} / ${selectedDomain.label}`
          : "FOCUS: NONE / SELECT A DOMAIN"}
      </p>
    </div>
  );
}

function Environment() {
  return (
    <div className="environment">
      <p className="panel-label">ENVIRONMENT</p>

      <div>
        <span>TIME</span>
        <b>
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </b>
      </div>

      <div>
        <span>CONDITION</span>
        <b>CURIOUS</b>
      </div>

      <div>
        <span>MODE</span>
        <b>EXPLORATION</b>
      </div>
    </div>
  );
}

function LiveFeed() {
  return (
    <div className="feed">
      <p className="panel-label">
        LIVE FEED <span>●</span>
      </p>

      <svg
        viewBox="0 0 260 52"
        role="img"
        aria-label="Live signal waveform"
      >
        <path d="M0 26h17l6-12 10 28 12-39 12 43 11-20 10 4 12-10 13 17 15-25 13 29 13-14 9 2 13-19 11 17 11-8 10 8h32" />
      </svg>

      <small>SIGNAL / FIELD NOTES / CURRENT</small>
    </div>
  );
}

function Header({
  section,
  onNavigate,
  onTerminal,
  onHome,
}: {
  section: Section;
  onNavigate: (section: Section) => void;
  onTerminal: () => void;
  onHome: () => void;
}) {
  return (
    <header className="main-header">
      <button
        className="wordmark home"
        onClick={onHome}
        aria-label="Return to laboratory entry screen"
      >
        LABORATORY_07
      </button>

      <nav>
        {nav.map((item, i) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            className={section === item ? "active" : ""}
          >
            0{i + 1} {navLabels[item]}
          </button>
        ))}
      </nav>

      <button
        className="terminal-toggle"
        onClick={onTerminal}
      >
        TERMINAL <span>⌘T</span>
      </button>
    </header>
  );
}

function SectionView({
  section,
  onCase,
  onNavigate,
}: {
  section: Section;
  onCase: () => void;
  onNavigate: (section: Section) => void;
}) {
  if (section === "profile") {
    return (
      <section className="content-section profile">
        <p className="eyebrow">01 / PROFILE</p>

        <div className="profile-grid">
          <div>
            <p className="eyebrow">RESEARCHER / BUILDER</p>

            <h2>
              {profile.name}
              <br />
              in <em>motion.</em>
            </h2>
          </div>

          <div className="profile-statement">
            <p>{profile.statement}</p>

            <a href={`mailto:${profile.email}`}>
              WRITE TO {profile.email} ↗
            </a>
          </div>
        </div>

        <div className="focus-grid">
          <p className="panel-label">CURRENT FOCUS</p>

          {profile.focus.map((focus, index) => (
            <span key={focus}>
              0{index + 1} / {focus}
            </span>
          ))}

          <p className="panel-label">WORKING PRINCIPLES</p>

          <span>Curiosity with evidence</span>
          <span>Process over performance</span>
          <span>Systems that stay understandable</span>
        </div>

        {/* GITHUB CONTRIBUTION CALENDAR */}
        <GithubContribution username="Pushpak-Cyrus" />
      </section>
    );
  }

  if (section === "observe") {
    return (
      <section className="content-section observe">
        <p className="eyebrow">02 / OBSERVATORY</p>

        <div className="split">
          <h2>
            The practice is
            <br />
            paying attention.
          </h2>

          <div>
            <p>
              {profile.role} {profile.statement}
            </p>

            <dl>
              <dt>CURRENT POSTURE</dt>
              <dd>Learning in public</dd>

              <dt>METHOD</dt>
              <dd>Question → evidence → iteration</dd>
            </dl>
          </div>
        </div>

        <DiscoveryMap
          onViriditas={() => {
            onNavigate("experiments");
            setTimeout(onCase, 100);
          }}
        />
      </section>
    );
  }

  if (section === "experiments") {
    const liveExperiments = experiments.filter(
      (experiment) => experiment.visible !== false
    );

    return (
      <section className="content-section">
        <p className="eyebrow">03 / EXPERIMENTS</p>

        <h2>Questions given form.</h2>

        <div
          className={`experiment-grid ${
            liveExperiments.length === 1
              ? "experiment-grid--single"
              : ""
          }`}
        >
          {liveExperiments.map((experiment) => (
            <article
              className="experiment-card"
              key={experiment.id}
            >
              <div>
                <span>{experiment.code}</span>
                <span className="mark">
                  ● {experiment.status}
                </span>
              </div>

              <h3>{experiment.title}</h3>

              <p>{experiment.summary}</p>

              <ul>
                {experiment.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <button onClick={onCase}>
                OPEN CASE STUDY →
              </button>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section === "notebook") {
    const visibleEntries = notebookEntries.filter(
      (entry) => entry.visible
    );

    return (
      <section className="content-section">
        <p className="eyebrow">04 / NOTEBOOK</p>

        <h2>The trace of thinking.</h2>

        <div className="notebook-list">
          {visibleEntries.map((entry) => (
            <article key={entry.id}>
              <time>{entry.date}</time>

              <h3>{entry.title}</h3>

              <p>{entry.excerpt}</p>

              <span className="draft-status">
                DRAFT / FULL NOTE PENDING
              </span>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section === "archive") {
    return (
      <section className="content-section archive">
        <p className="eyebrow">05 / ARCHIVE</p>

        <h2>What remains useful.</h2>

        <p>
          An evolving record of methods, references, experiments,
          and small tools that continue to influence the work.
        </p>

        <div className="archive-stamp">
          ARCHIVE
          <br />
          <b>COLLECTING / CURATING</b>
          <br />
          WORK IN PROGRESS
        </div>
      </section>
    );
  }

  return (
    <section className="content-section contact">
      <p className="eyebrow">06 / CONTACT</p>

      <h2>Begin a signal.</h2>

      <p>
        If the question is interesting enough, let’s compare notes.
      </p>

      <a href={`mailto:${profile.email}`}>
        {profile.email} <span>↗</span>
      </a>

      <div className="contact-meta">
        <span>AVAILABILITY</span>
        <b>{profile.availability}</b>
      </div>
    </section>
  );
}

function DiscoveryMap({
  onViriditas,
}: {
  onViriditas: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);

  const current = discoveryNodes.find(
    (node) => node.id === active
  );

  return (
    <div className="discovery">
      <div>
        <p className="panel-label">
          KNOWLEDGE / DISCOVERY MAP
        </p>

        <p>
          {current
            ? `${current.label} connects to ${current.links.length} active research threads.`
            : "Hover or focus a node to reveal its connections."}
        </p>
      </div>

      <div className="map-canvas">
        {discoveryNodes.map((node) => (
          <button
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            onMouseEnter={() => setActive(node.id)}
            onFocus={() => setActive(node.id)}
            onMouseLeave={() => setActive(null)}
            onClick={
              node.id === "viriditas"
                ? onViriditas
                : () => setActive(node.id)
            }
            className={`map-node ${
              active === node.id ? "active" : ""
            } ${
              active && current?.links.includes(node.id)
                ? "linked"
                : ""
            }`}
            key={node.id}
          >
            <i />
            {node.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Viriditas({
  onBack,
}: {
  onBack: () => void;
}) {
  const topics = [
    {
      title: "THE QUESTION",
      body: "What can a visual system learn from this collection — and what must remain a human judgment?",
      documented: true,
    },
    {
      title: "DATASET",
      body: "Not yet documented.",
      documented: false,
    },
    {
      title: "PREPROCESSING",
      body: "Not yet documented.",
      documented: false,
    },
    {
      title: "LABEL NORMALIZATION",
      body: "Not yet documented.",
      documented: false,
    },
    {
      title: "DUPLICATE LEAKAGE",
      body: "Not yet documented.",
      documented: false,
    },
    {
      title: "MODEL / PROCESS",
      body: "Not yet documented.",
      documented: false,
    },
  ];

  return (
    <section className="case-study">
      <button className="back" onClick={onBack}>
        ← RETURN TO EXPERIMENTS
      </button>

      <p className="eyebrow">EXP_001 / CASE STUDY</p>

      <h2>VIRIDITAS</h2>

      <p className="case-dek">
        A research record for a computer-vision investigation.
        Verified documentation will be added as the study is
        prepared for publication.
      </p>

      <div className="case-meta">
        <span>DOMAIN / COMPUTER VISION</span>
        <span>STATE / DOCUMENTING</span>
        <span>METHOD / IN REVIEW</span>
      </div>

      <div className="case-grid">
        {topics.map((topic, index) => (
          <article key={topic.title}>
            <span>0{index + 1}</span>

            <h3>{topic.title}</h3>

            <p
              className={
                topic.documented ? "" : "draft-copy"
              }
            >
              {topic.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Terminal({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (section: Section) => void;
}) {
  const [lines, setLines] = useState([
    "LABORATORY_07 terminal — type ‘help’ for available commands.",
  ]);

  const [value, setValue] = useState("");

  const handle = (event: FormEvent) => {
    event.preventDefault();

    const command = value.trim().toLowerCase();

    const routes: Record<string, Section> = {
      profile: "profile",
      about: "observe",
      experiments: "experiments",
      notebook: "notebook",
      archive: "archive",
      contact: "contact",
    };

    if (command === "clear") {
      setLines([]);
    } else if (command === "help") {
      setLines((prev) => [
        ...prev,
        "> help",
        "help · profile · about · experiments · notebook · archive · contact · clear",
      ]);
    } else if (routes[command]) {
      onNavigate(routes[command]);

      setLines((prev) => [
        ...prev,
        `> ${command}`,
        `NAVIGATING TO ${routes[
          command
        ].toUpperCase()}...`,
      ]);
    } else if (command) {
      setLines((prev) => [
        ...prev,
        `> ${command}`,
        "UNKNOWN COMMAND. TYPE ‘help’.",
      ]);
    }

    setValue("");
  };

  return (
    <motion.aside
      className="terminal"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
    >
      <header>
        <span>TERMINAL / LOCAL SESSION</span>

        <button onClick={onClose}>
          CLOSE ×
        </button>
      </header>

      <div className="terminal-lines">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <form onSubmit={handle}>
        <span>›</span>

        <input
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Terminal command"
        />
      </form>
    </motion.aside>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>LABORATORY_07 / THE EXPERIMENT</span>
      <span>DESIGNED AS A LIVING RECORD</span>
      <span>BUILD 07.01</span>
    </footer>
  );
}