import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useInsightsByType } from "../../../../hooks/usePodcastData";
import { currentEpisodeId } from "../../../../data/episodes";
import { SVGPattern } from "../../../../lib/svg-patterns";
import type { Database } from "../../../../types/database";

type EpisodeInsightRow = Database["public"]["Tables"]["episode_insights"]["Row"];

// 1. Define the Shape of a "Phase" (The Grouped Data)
interface PlaybookPhase {
  title: string;    // "0 — 20 Cr"
  subtitle: string; // "PRODUCT & COMMUNITY"
  items: string[];  // checklist items
}

// Fallback Data (Matches your screenshot)
const HARDCODED_PHASES: PlaybookPhase[] = [
  {
    title: "0 — 20 Cr",
    subtitle: "PRODUCT & COMMUNITY",
    items: [
      "Target a 'Micro-Niche' (e.g., Toilet Seat Sprays, Pet Accessories)",
      "Maintain 80% Marketplace / 20% D2C mix for cash flow",
      "Do NOT spend on Performance Marketing yet",
    ],
  },
];

// Map DB stage -> UI phase labels
const STAGE_META: Record<string, { title: string; subtitle: string }> = {
  "0-20_cr": { title: "0 — 20 Cr", subtitle: "PRODUCT & COMMUNITY" },
  "20-100_cr": { title: "20 — 100 Cr", subtitle: "MARKETING & BRAND" },
  "100cr_plus": { title: "100 Cr +", subtitle: "SCALE & EFFICIENCY" },
  unknown: { title: "Unknown Stage", subtitle: "" },
};

export const PlaybookSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // ✅ EXACT POSITION: replace your current hook line with this (cast included)
  const { data: rawItems, loading } = useInsightsByType(currentEpisodeId, "roadmap_item") as {
    data: EpisodeInsightRow[] | null;
    loading: boolean;
  };

  const phases = React.useMemo(() => {
    if (!rawItems || rawItems.length === 0) return HARDCODED_PHASES;

    const groups: Record<string, PlaybookPhase> = {};

    // sort by display_order (exists in DB)
    const sortedItems = [...rawItems].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    for (const item of sortedItems) {
      const stage = (item.metadata as any)?.stage ?? "unknown";
      const stageInfo = STAGE_META[stage] ?? STAGE_META.unknown;

      const groupKey = stage; // stable key

      if (!groups[groupKey]) {
        groups[groupKey] = {
          title: stageInfo.title,
          subtitle: stageInfo.subtitle,
          items: [],
        };
      }

      if (item.content) groups[groupKey].items.push(item.content);
    }

    // preserve stage order
    const stageOrder = ["0-20_cr", "20-100_cr", "100cr_plus", "unknown"];
    return stageOrder.filter((k) => groups[k]).map((k) => groups[k]);
  }, [rawItems]);

  if (loading)
    return (
      <div className="p-20 text-center text-slate-500 dark:text-slate-500 light:text-gray-600">
        Loading Playbook...
      </div>
    );

  return (
    <section className="py-24 bg-zinc-950 dark:bg-zinc-950 light:bg-amber-50 border-t border-white/5 dark:border-white/5 light:border-gray-200">
      <div className="w-full px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white dark:text-white light:text-gray-900 mb-4">
            The Playbook
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-gray-600">
            Bite size lessons to play the game
          </p>
        </div>

        <div className="space-y-4 md:space-y-8 w-full">
          {phases.map((phase, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-white/5 dark:border-white/5 light:border-gray-200 hover:border-blue-500/30 dark:hover:border-blue-500/30 light:hover:border-blue-500 transition-all duration-500"
              >
                <SVGPattern category="tactics" id={`pattern-playbook-${index}`} opacity={0.05} />

                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent dark:from-blue-500/5 light:from-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Mobile: Clickable Header */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="md:hidden w-full text-left p-6 flex items-center justify-between relative z-10"
                >
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 tracking-tight mb-2">
                      {phase.title}
                    </h3>
                    <div className="inline-flex items-center space-x-2">
                      <div className="h-px w-6 bg-blue-500 dark:bg-blue-500 light:bg-amber-600" />
                      <span className="text-xs font-bold text-blue-400 dark:text-blue-400 light:text-amber-700 tracking-widest uppercase">
                        {phase.subtitle}
                      </span>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-6 h-6 text-blue-400 dark:text-blue-400 light:text-amber-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mobile: Collapsible Content */}
                <div
                  className={`md:hidden overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  <div className="p-6 pt-0 space-y-4 relative z-10">
                    {phase.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-4">
                        <div className="mt-1 flex-shrink-0 text-blue-500/80 dark:text-blue-500/80 light:text-emerald-600 dark:group-hover:text-blue-400 light:group-hover:text-emerald-700 transition-colors">
                          <Check className="w-5 h-5" />
                        </div>
                        <span className="text-base text-slate-300 dark:text-slate-300 light:text-gray-700 leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop: Always Expanded */}
                <div className="hidden md:block relative p-8 md:p-10">
                  <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start">
                    <div>
                      <h3 className="text-3xl font-bold text-white dark:text-white light:text-gray-900 tracking-tight mb-3">
                        {phase.title}
                      </h3>
                      <div className="inline-flex items-center space-x-2">
                        <div className="h-px w-6 bg-blue-500 dark:bg-blue-500 light:bg-amber-600" />
                        <span className="text-xs font-bold text-blue-400 dark:text-blue-400 light:text-amber-700 tracking-widest uppercase">
                          {phase.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {phase.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start space-x-4">
                          <div className="mt-1 flex-shrink-0 text-blue-500/80 dark:text-blue-500/80 light:text-emerald-600 group-hover:text-blue-400 dark:group-hover:text-blue-400 light:group-hover:text-emerald-700 transition-colors">
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="text-lg text-slate-300 dark:text-slate-300 light:text-gray-700 dark:group-hover:text-slate-200 light:group-hover:text-gray-900 transition-colors leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
