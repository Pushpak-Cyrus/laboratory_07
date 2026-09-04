export const profile = {
  name: "Pushpak",
  role: "Builder exploring AI, computer vision, data, and intelligent systems.",
  email: "kumarpushpak1309@gmail.com",
  availability: "Open to internships, collaborations, and ambitious problems.",
  statement: "I use experiments to turn curiosity into useful systems. I care about clear questions, careful data, and work that earns its conclusions.",
  focus: ["Artificial intelligence", "Computer vision", "Machine learning", "Data systems"],
};

export const experiments = [
  { id: "viriditas", code: "EXP_001", title: "VIRIDITAS", type: "Computer vision / research", summary: "A study in seeing the living world more clearly.", tags: ["Vision", "Data", "Ecology"], status: "ACTIVE" },
  { id: "future-02", code: "EXP_002", title: "UNNAMED SIGNAL", type: "Future experiment", summary: "Reserve this space for a project that is still becoming.", tags: ["Systems", "Prototype"], status: "DORMANT" },
  { id: "future-03", code: "EXP_003", title: "FIELD NOTES", type: "Future experiment", summary: "A place for a personal tool, exploration, or collaboration.", tags: ["Creative tech"], status: "DORMANT" },
];

export const notebookEntries = [
  { date: "IN PROGRESS", title: "Observation before optimization", excerpt: "A useful system begins by seeing the problem clearly enough to ask a better question." },
  { date: "IN PROGRESS", title: "What failure teaches", excerpt: "Failed experiments are not discarded; they become evidence for the next decision." },
  { date: "IN PROGRESS", title: "Signal / noise", excerpt: "The practice is separating a compelling idea from an idea that can survive contact with data." },
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
