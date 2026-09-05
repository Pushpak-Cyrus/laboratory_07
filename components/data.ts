export const profile = {
  name: "Pushpak",
  role: "Builder exploring AI, computer vision, data, and intelligent systems.",
  email: "kumarpushpak1309@gmail.com",
  availability: "Open to internships, collaborations, and ambitious problems.",
  statement: "I use experiments to turn curiosity into useful systems. I care about clear questions, careful data, and work that earns its conclusions.",
  focus: ["Artificial intelligence", "Computer vision", "Machine learning", "Data systems"],
};

export type ResearchDomain = {
  id: "AI" | "VISION" | "DATA" | "SYSTEMS" | "CREATE";
  title: string;
  label: string;
  description: string;
  details: string[];
  status?: string;
  activeResearch?: string;
  connection?: string;
  actionLabel?: string;
  condition: string;
  mode: string;
};

export const researchDomains: ResearchDomain[] = [
  {
    id: "AI",
    title: "AI",
    label: "INTELLIGENCE / LEARNING SYSTEMS",
    description:
      "Exploring how machines can learn patterns, make predictions, and assist human reasoning.",
    details: ["MACHINE LEARNING", "EXPERIMENTATION", "MODEL THINKING", "EVALUATION"],
    status: "EXPLORING",
    condition: "EXPLORING",
    mode: "MODEL THINKING",
  },
  {
    id: "VISION",
    title: "VISION",
    label: "COMPUTER VISION / VISUAL UNDERSTANDING",
    description:
      "Investigating how visual systems extract meaning from images, and where human judgment remains necessary.",
    details: ["IMAGE DATA", "CLASSIFICATION", "DATA QUALITY", "HUMAN JUDGMENT"],
    activeResearch: "VIRIDITAS",
    actionLabel: "OPEN VIRIDITAS →",
    condition: "INVESTIGATING",
    mode: "VISUAL ANALYSIS",
  },
  {
    id: "DATA",
    title: "DATA",
    label: "EVIDENCE / DATA QUALITY",
    description:
      "Treating data preparation as part of the research itself, not merely a step before modeling.",
    details: ["DATASETS", "PREPROCESSING", "LABEL NORMALIZATION", "DUPLICATE LEAKAGE"],
    connection: "VIRIDITAS",
    actionLabel: "EXPLORE VIRIDITAS →",
    condition: "QUESTIONING",
    mode: "DATA AUDIT",
  },
  {
    id: "SYSTEMS",
    title: "SYSTEMS",
    label: "STRUCTURE / ENGINEERING",
    description:
      "Building technical structures that keep experiments, interfaces, and ideas understandable.",
    details: ["WEB APPLICATIONS", "DATA PIPELINES", "INTERACTIVE SYSTEMS", "SOFTWARE STRUCTURE"],
    status: "BUILDING",
    condition: "BUILDING",
    mode: "SYSTEM DESIGN",
  },
  {
    id: "CREATE",
    title: "CREATE",
    label: "INTERACTION / COMMUNICATION",
    description:
      "Turning complex ideas into interfaces, visual systems, and experiences that people can actually understand.",
    details: ["INTERACTION", "VISUAL DESIGN", "EXPERIMENTAL INTERFACES", "COMMUNICATION"],
    status: "MAKING",
    condition: "MAKING",
    mode: "EXPERIMENTAL FORM",
  },
];

export const observationSteps = [
  {
    step: "OBSERVATION",
    description: "Start with what is actually visible.",
  },
  {
    step: "QUESTION",
    description: "Turn curiosity into something testable.",
  },
  {
    step: "EVIDENCE",
    description: "Use data, references, and results to constrain the answer.",
  },
  {
    step: "EXPERIMENT",
    description: "Build something that can challenge the assumption.",
  },
  {
    step: "INTERPRETATION",
    description: "Ask what the result actually means.",
  },
  {
    step: "FORM",
    description: "Turn the useful insight into a system, interface, or artifact.",
  },
];

export const experiments = [
  { id: "viriditas", code: "EXP_001", title: "VIRIDITAS", type: "Computer vision / research", summary: "A study in seeing the living world more clearly.", tags: ["Vision", "Data", "Ecology"], status: "ACTIVE" },
  { id: "future-02", code: "EXP_002", title: "UNNAMED SIGNAL", type: "Future experiment", summary: "DRAFT / CONCEPT", tags: ["Systems", "Prototype"], status: "DRAFT", visible: false },
  { id: "future-03", code: "EXP_003", title: "FIELD NOTES", type: "Future experiment", summary: "DRAFT / DORMANT", tags: ["Creative tech"], status: "DRAFT", visible: false },
];

export const notebookEntries = [
  { id: "observation-before-optimization", date: "FIELD NOTE / 001", title: "Observation before optimization", excerpt: "The full note is being prepared.", visible: true, published: false, type: "OBSERVATION", status: "DOCUMENTING" },
  { id: "what-failure-teaches", date: "FIELD NOTE / 002", title: "What failure teaches", excerpt: "The full note is being prepared.", visible: true, published: false, type: "FAILURE", status: "UNRESOLVED" },
  { id: "signal-noise", date: "FIELD NOTE / 003", title: "Signal / noise", excerpt: "The full note is being prepared.", visible: true, published: false, type: "REFLECTION", status: "ACTIVE" },
];

export const discoveryNodes = [
  { id: "ai", label: "AI", x: 15, y: 30, links: ["vision", "ml", "viriditas"] },
  { id: "vision", label: "COMPUTER VISION", x: 39, y: 18, links: ["ai", "data", "viriditas"] },
  { id: "ml", label: "MACHINE LEARNING", x: 55, y: 43, links: ["ai", "data", "systems"] },
  { id: "data", label: "DATA", x: 72, y: 25, links: ["vision", "ml", "viriditas"] },
  { id: "systems", label: "SYSTEMS", x: 79, y: 67, links: ["ml", "creative"] },
  { id: "creative", label: "CREATIVE TECH", x: 35, y: 74, links: ["systems", "viriditas"] },
  { id: "viriditas", label: "VIRIDITAS", x: 54, y: 62, links: ["ai", "vision", "data", "creative"] },
];
