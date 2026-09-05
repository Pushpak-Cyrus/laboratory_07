"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  discoveryNodes,
  experiments,
  notebookEntries,
  observationSteps,
  profile,
  researchDomains,
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

function ResearchTrail({ trail }: { trail: string[] }) {
  return (
    <div className="research-trail" aria-live="polite">
      <p className="panel-label">TRACE / CURRENT SESSION</p>
      <div className="research-trail__items">
        {trail.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            {index < trail.length - 1 ? <i>→</i> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

type SessionEvent = {
  time: string;
  type: string;
  message: string;
};

export function Laboratory() {
  const [entered, setEntered] = useState(false);
  const [section, setSection] = useState<Section>("observe");
  const [statusOpen, setStatusOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [caseStudy, setCaseStudy] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [trail, setTrail] = useState<string[]>(["ENTRY"]);
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([
    { time: "20:41", type: "SYSTEM", message: "SESSION INITIALIZED" },
    { time: "20:42", type: "NODE", message: "RESEARCH NODE 07 ACTIVE" },
  ]);

  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const addEvent = (type: string, message: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setSessionEvents((prev) => [{ time, type, message }, ...prev].slice(0, 5));
  };

  const addTrail = (next: string) => {
    setTrail((prev) => {
      const last = prev[prev.length - 1];
      if (last === next) return prev;
      return [...prev, next].slice(-6);
    });
  };

  const go = (next: Section) => {
    setSection(next);
    setCaseStudy(false);
    setHasNavigated(true);
    addTrail(next.toUpperCase());
    addEvent("SECTION", `${next.toUpperCase()} ACCESSED`);

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
            onNavigate={(next) => {
              setEntered(true);
              setHasNavigated(true);
              go(next);
            }}
            onStatus={() => setStatusOpen(!statusOpen)}
            statusOpen={statusOpen}
            onCase={() => {
              setEntered(true);
              setCaseStudy(true);
              setHasNavigated(true);
              addEvent("CASE", "VIRIDITAS OPENED");
            }}
            sessionEvents={sessionEvents}
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
                setTrail(["ENTRY"]);
              }}
            />

            <ResearchTrail trail={trail} />

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
  onNavigate,
  onStatus,
  statusOpen,
  onCase,
  sessionEvents,
}: {
  onEnter: () => void;
  onNavigate: (section: Section) => void;
  onStatus: () => void;
  statusOpen: boolean;
  onCase: () => void;
  sessionEvents: SessionEvent[];
}) {
  const [focus, setFocus] = useState<"AI" | "VISION" | "DATA" | "SYSTEMS" | "CREATE" | null>(null);
  const activeDomain = focus ? researchDomains.find((domain) => domain.id === focus) ?? null : null;

  return (
    <motion.section
      className="entry"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="entry-header">
        <div>
          <p className="wordmark">LABORATORY_07</p>
          <span>{"///"} PERSONAL RESEARCH NODE</span>
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
          <Orbital onCase={onCase} onDomainChange={setFocus} />

          <nav className="entry-nav">
            {nav.map((item, index) => (
              <button onClick={() => onNavigate(item)} key={item}>
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
          <Environment
            condition={activeDomain?.condition ?? "CURIOUS"}
            mode={activeDomain?.mode ?? "EXPLORATION"}
          />
          <LiveFeed events={sessionEvents} />

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

function Orbital({
  onCase,
  onDomainChange,
}: {
  onCase: () => void;
  onDomainChange?: (domain: DomainKey | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<DomainKey | null>(null);
  const [hovered, setHovered] = useState<DomainKey | null>(null);

  const activeKey = hovered ?? active;
  const selectedDomain = active ? researchDomains.find((domain) => domain.id === active) ?? null : null;

  const handleSelection = (node: DomainKey | null) => {
    setActive(node);
    onDomainChange?.(node);
  };

  return (
    <div className="orbital-panel orbital-panel--stable">
      <p className="panel-label">RESEARCH NODE 07</p>

      <div className={`orbital-visual ${reduceMotion ? "reduced-motion" : ""}`} aria-live="polite">
        <div className={`orbit o1 ${activeKey ? "is-linked" : ""}`} />
        <div className={`orbit o2 ${activeKey ? "is-linked" : ""}`} />

        <button
          type="button"
          className="core"
          onClick={() => handleSelection(null)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleSelection(null);
            }
          }}
          aria-label="Reset research node"
        >
          07
        </button>

        {researchDomainOrder.map((node, index) => {
          const domain = researchDomains.find((entry) => entry.id === node) ?? researchDomains[0];
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
              onClick={() => handleSelection(node)}
              aria-label={`Select ${domain.title} research domain`}
              aria-pressed={isSelected}
              data-node={node}
            >
              {node}
            </button>
          );
        })}
      </div>

      <div className="orbital-info">
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
                  <button type="button" className="orbital-action" onClick={onCase}>
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

      <p className="tiny">
        {selectedDomain
          ? `FOCUS: ${selectedDomain.title} / ${selectedDomain.label}`
          : "FOCUS: NONE / SELECT A DOMAIN"}
      </p>
    </div>
  );
}

function Environment({
  condition,
  mode,
}: {
  condition?: string;
  mode?: string;
}) {
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
        <b>{condition ?? "CURIOUS"}</b>
      </div>

      <div>
        <span>MODE</span>
        <b>{mode ?? "EXPLORATION"}</b>
      </div>
    </div>
  );
}

function LiveFeed({ events }: { events: SessionEvent[] }) {
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

      <ul className="live-feed-list">
        {events.map((event) => (
          <li key={`${event.time}-${event.message}`}>
            <span>{event.time}</span>
            <strong>{event.type}</strong>
            <em>{event.message}</em>
          </li>
        ))}
      </ul>
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
  const [selectedStep, setSelectedStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  if (section === "profile") {
    return (
      <motion.section
        className="content-section profile"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reveal}
      >
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.05 }}>
          01 / PROFILE
        </motion.p>

        <motion.div className="profile-grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.08 }}>
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
        </motion.div>

        <motion.div className="focus-grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.12 }}>
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
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.18 }}>
          <GithubContribution username="Pushpak-Cyrus" />
        </motion.div>
      </motion.section>
    );
  }

  if (section === "observe") {
    const activeStep = observationSteps[selectedStep];

    return (
      <motion.section
        className="content-section observe"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reveal}
      >
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.05 }}>
          02 / OBSERVATORY
        </motion.p>

        <motion.div className="split" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.08 }}>
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
        </motion.div>

        <motion.div className="research-process" aria-label="Research process" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.12 }}>
          {observationSteps.map((step, index) => (
            <button
              key={step.step}
              type="button"
              className={selectedStep === index ? "active" : ""}
              onClick={() => setSelectedStep(index)}
              aria-pressed={selectedStep === index}
            >
              {step.step}
            </button>
          ))}
        </motion.div>

        <motion.div className="research-process-copy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.16 }}>
          <strong>{activeStep.step}</strong>
          <br />
          {activeStep.description}
        </motion.div>

        <DiscoveryMap
          onViriditas={() => {
            onNavigate("experiments");
            setTimeout(onCase, 100);
          }}
        />
      </motion.section>
    );
  }

  if (section === "experiments") {
    const liveExperiments = experiments.filter(
      (experiment) => experiment.visible !== false
    );

    return (
      <motion.section
        className="content-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reveal}
      >
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.05 }}>
          03 / EXPERIMENTS
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.08 }}>Questions given form.</motion.h2>

        <motion.div
          className={`experiment-grid ${
            liveExperiments.length === 1
              ? "experiment-grid--single"
              : ""
          }`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...reveal, delay: 0.12 }}
        >
          {liveExperiments.map((experiment, index) => (
            <motion.article
              className="experiment-card"
              key={experiment.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...reveal, delay: 0.14 + index * 0.05 }}
              whileHover={reduceMotion ? undefined : { y: -3 }}
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
            </motion.article>
          ))}
        </motion.div>
      </motion.section>
    );
  }

  if (section === "notebook") {
    const visibleEntries = notebookEntries.filter(
      (entry) => entry.visible
    );

    return (
      <motion.section
        className="content-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reveal}
      >
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.05 }}>
          04 / NOTEBOOK
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.08 }}>The trace of thinking.</motion.h2>

        <motion.div className="notebook-list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.12 }}>
          {visibleEntries.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...reveal, delay: 0.14 + index * 0.05 }}
              whileHover={reduceMotion ? undefined : { y: -2 }}
            >
              <time>{entry.date}</time>

              <h3>{entry.title}</h3>

              <p>{entry.excerpt}</p>

              <span className="draft-status">
                DRAFT / FULL NOTE PENDING
              </span>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>
    );
  }

  if (section === "archive") {
    return (
      <motion.section
        className="content-section archive"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reveal}
      >
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.05 }}>
          05 / ARCHIVE
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.08 }}>What remains useful.</motion.h2>

        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.12 }}>
          An evolving record of methods, references, experiments,
          and small tools that continue to influence the work.
        </motion.p>

        <motion.div className="archive-stamp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.16 }}>
          ARCHIVE
          <br />
          <b>COLLECTING / CURATING</b>
          <br />
          WORK IN PROGRESS
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="content-section contact"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reveal}
    >
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.05 }}>
        06 / CONTACT
      </motion.p>

      <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.08 }}>Begin a signal.</motion.h2>

      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.12 }}>
        If the question is interesting enough, let’s compare notes.
      </motion.p>

      <motion.a href={`mailto:${profile.email}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.16 }} whileHover={reduceMotion ? undefined : { y: -2 }}>
        {profile.email} <span>↗</span>
      </motion.a>

      <motion.div className="contact-meta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...reveal, delay: 0.2 }}>
        <span>AVAILABILITY</span>
        <b>{profile.availability}</b>
      </motion.div>
    </motion.section>
  );
}

function DiscoveryMap({
  onViriditas,
}: {
  onViriditas: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const current = discoveryNodes.find(
    (node) => node.id === active
  );

  return (
    <motion.div
      className="discovery"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
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

      <motion.div
        className="map-canvas"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {discoveryNodes.map((node, index) => (
          <motion.button
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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.25, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileFocus={reduceMotion ? undefined : { y: -2 }}
          >
            <i />
            {node.label}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Viriditas({
  onBack,
}: {
  onBack: () => void;
}) {
  const reduceMotion = useReducedMotion();
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
    <motion.section
      className="case-study"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button className="back" onClick={onBack} whileHover={reduceMotion ? undefined : { y: -2 }}>
        ← RETURN TO EXPERIMENTS
      </motion.button>

      <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ... (reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }), delay: 0.05 }}>
        EXP_001 / CASE STUDY
      </motion.p>

      <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ... (reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }), delay: 0.08 }}>VIRIDITAS</motion.h2>

      <motion.p className="case-dek" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ... (reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }), delay: 0.12 }}>
        A research record for a computer-vision investigation.
        Verified documentation will be added as the study is
        prepared for publication.
      </motion.p>

      <motion.div className="case-meta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ... (reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }), delay: 0.16 }}>
        <span>DOMAIN / COMPUTER VISION</span>
        <span>STATE / DOCUMENTING</span>
        <span>METHOD / IN REVIEW</span>
      </motion.div>

      <motion.div className="case-grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ... (reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }), delay: 0.2 }}>
        {topics.map((topic, index) => (
          <motion.article
            key={topic.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ... (reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }), delay: 0.22 + index * 0.05 }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
          >
            <span>0{index + 1}</span>

            <h3>{topic.title}</h3>

            <p
              className={
                topic.documented ? "" : "draft-copy"
              }
            >
              {topic.body}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
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
      observe: "observe",
      experiments: "experiments",
      notebook: "notebook",
      archive: "archive",
      contact: "contact",
      viriditas: "experiments",
    };

    if (command === "clear") {
      setLines([]);
    } else if (command === "help") {
      setLines((prev) => [
        ...prev,
        "> help",
        "help · profile · observe · experiments · notebook · archive · contact · status · trace · viriditas · clear",
      ]);
    } else if (command === "status") {
      setLines((prev) => [
        ...prev,
        "> status",
        "SYSTEM · OPERATIONAL",
        "NODE · 07",
        "ACTIVE EXPERIMENT · VIRIDITAS",
        "RESEARCH STATE · DOCUMENTING",
      ]);
    } else if (command === "trace") {
      setLines((prev) => [
        ...prev,
        "> trace",
        "CURRENT SESSION",
        "ENTRY → OBSERVE → VISION → VIRIDITAS",
      ]);
    } else if (command === "viriditas") {
      onNavigate("experiments");
      setLines((prev) => [
        ...prev,
        "> viriditas",
        "OPENING EXP_001 / VIRIDITAS...",
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