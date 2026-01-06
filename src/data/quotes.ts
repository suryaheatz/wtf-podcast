export interface Quote {
  id: number;
  quote: string;
  author: string;
  timestamp?: string;
  description?: string;
  gradient?: string;
}

export const quotes: Quote[] = [
  {
    id: 1,
    quote: "It's easy to start in India, very hard to scale in India.",
    author: "ANANTH NARAYANAN",
    timestamp: "00:11:06",
    description: "Low entry barriers create noise; operational complexity kills scale.",
    gradient: "from-[#1a1a1a] to-[#252525]",
  },
  {
    id: 2,
    quote: "The best consumer brands are built on deep customer obsession, not just marketing spend.",
    author: "ANANTH NARAYANAN",
    timestamp: "00:23:45",
    description: "Understanding your customer's pain points is more valuable than any advertising budget.",
    gradient: "from-[#1a1a2a] to-[#252535]",
  },
  {
    id: 3,
    quote: "Unit economics must work from day one. You can't scale your way out of a broken model.",
    author: "ANANTH NARAYANAN",
    timestamp: "00:34:12",
    description: "Profitability at the unit level is non-negotiable for sustainable growth.",
    gradient: "from-[#1a1a1a] to-[#2a2520]",
  },
  {
    id: 4,
    quote: "Distribution is everything. The best product means nothing if it doesn't reach the customer.",
    author: "ANANTH NARAYANAN",
    timestamp: "00:45:30",
    description: "Multi-channel distribution strategy is key to capturing market share.",
    gradient: "from-[#1a201a] to-[#252a25]",
  },
  {
    id: 5,
    quote: "Brand building is a long game. Performance marketing gives you quick wins but not loyalty.",
    author: "ANANTH NARAYANAN",
    timestamp: "00:56:18",
    description: "Transitioning from performance to brand marketing at the right time is critical.",
    gradient: "from-[#1a1a1a] to-[#2a2020]",
  },
];
