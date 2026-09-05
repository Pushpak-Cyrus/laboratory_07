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
  { id: "future-02", code: "EXP_002", title: "UNNAMED SIGNAL", type: "Future experiment", summary: "", tags: ["Systems", "Prototype"], status: "DRAFT", visible: false },
  { id: "future-03", code: "EXP_003", title: "FIELD NOTES", type: "Future experiment", summary: "", tags: ["Creative tech"], status: "DRAFT", visible: false },
];

export const notebookEntries = [
  { id: "observation-before-optimization", date: "DRAFT", title: "Observation before optimization", excerpt: "", visible: false },
  { id: "what-failure-teaches", date: "DRAFT", title: "What failure teaches", excerpt: "The full note is being prepared.", visible: true, published: false },
  { id: "signal-noise", date: "DRAFT", title: "Signal / noise", excerpt: "", visible: false },
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
