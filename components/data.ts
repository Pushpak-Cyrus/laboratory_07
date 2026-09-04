export const profile = {
  name: "YOUR NAME",
  role: "Researcher / builder / curious human",
  origin: "Replace with your city, country",
  email: "hello@example.com",
  availability: "Open to thoughtful collaborations",
};

export const experiments = [
  { id: "viriditas", code: "EXP_001", title: "VIRIDITAS", type: "Computer vision / research", summary: "A study in seeing the living world more clearly.", tags: ["Vision", "Data", "Ecology"], status: "ACTIVE" },
  { id: "future-02", code: "EXP_002", title: "UNNAMED SIGNAL", type: "Future experiment", summary: "Reserve this space for a project that is still becoming.", tags: ["Systems", "Prototype"], status: "DORMANT" },
  { id: "future-03", code: "EXP_003", title: "FIELD NOTES", type: "Future experiment", summary: "A place for a personal tool, exploration, or collaboration.", tags: ["Creative tech"], status: "DORMANT" },
];

export const notebookEntries = [
  { date: "YYYY.MM.DD", title: "A note worth keeping", excerpt: "Replace this with a small observation, question, or useful lesson." },
  { date: "YYYY.MM.DD", title: "What failed, specifically", excerpt: "The notebook makes process visible — not just polished outcomes." },
  { date: "YYYY.MM.DD", title: "Signal / noise", excerpt: "A fragment from your ongoing practice." },
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
