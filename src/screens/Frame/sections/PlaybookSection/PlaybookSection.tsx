import React, { useState } from "react";
import { Check, ChevronDown, ClockIcon } from "lucide-react";
import { useInsightsByType } from "../../../../hooks/usePodcastData";
import { SVGPattern } from "../../../../lib/svg-patterns";
import type { Database } from "../../../../types/database";

type EpisodeInsightRow = Database["public"]["Tables"]["episode_insights"]["Row"];

// 1. Define the Shape of a "Phase" (The Grouped Data)
interface PlaybookItem {
  title: string;
  content: string;
  speaker?: string | null;
  timestamp?: string | null;
  timestampSeconds?: number | null;
  youtubeLink?: string | null;
}

const toYouTubeLink = (
  youtubeVideoId?: string | null,
  seconds?: number | null,
  fallback?: string | null
) => {
  if (typeof fallback === "string" && fallback.startsWith("http")) return fallback;
  if (!youtubeVideoId) return null;
  if (typeof seconds === "number" && Number.isFinite(seconds)) {
    return `https://www.youtube.com/watch?v=${youtubeVideoId}&t=${seconds}s`;
  }
  return `https://www.youtube.com/watch?v=${youtubeVideoId}`;
};

interface PlaybookSectionProps {
  episodeId?: string | null;
  onTimestampClick?: (timestamp: string) => void;
  youtubeVideoId?: string | null;
}

export const PlaybookSection = ({ episodeId = null, youtubeVideoId = null, onTimestampClick }: PlaybookSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleTimestampClick = (timestamp?: string | null) => {
    if (!timestamp || !onTimestampClick) return;
    onTimestampClick(timestamp);
  };

  // ✅ EXACT POSITION: replace your current hook line with this (cast included)
  const { data: rawItems, loading } = useInsightsByType(episodeId, "roadmap_item") as {
    data: EpisodeInsightRow[] | null;
    loading: boolean;
  };

  const items = React.useMemo(() => {
    if (!rawItems || rawItems.length === 0) return [] as PlaybookItem[];

    const sortedItems = [...rawItems].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    return sortedItems
      .filter((item) => item.content)
      .map((item) => {
        const metadata = (item.metadata as any) ?? {};
        return {
          title: item.title || "Playbook Item",
          content: item.content as string,
          speaker: item.speaker ?? null,
          timestamp: item.timestamp_start ?? null,
          timestampSeconds: item.timestamp_seconds ?? null,
          youtubeLink: toYouTubeLink(
            youtubeVideoId,
            item.timestamp_seconds ?? null,
            metadata.youtube_link
          ),
        } as PlaybookItem;
      });
  }, [rawItems, youtubeVideoId]);

  if (loading)
    return (
      <div className="p-20 text-center text-slate-500 dark:text-slate-500 light:text-gray-600">
        Loading Playbook...
      </div>
    );

  return (
    <section className="py-24 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border-t border-white/5 dark:border-white/5 light:border-gray-200">
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
          {items.length === 0 ? (
            <div className="text-slate-400 dark:text-slate-400 light:text-gray-600">
              No playbook items available for this episode.
            </div>
          ) : (
            items.map((item, index) => {
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
                      {item.title}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`w-6 h-6 text-blue-400 dark:text-blue-400 light:text-blue-500 transition-transform duration-300 ${
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
                    <div className="flex items-start space-x-4">
                      <div className="mt-1 flex-shrink-0 text-blue-500/80 dark:text-blue-500/80 light:text-emerald-600 dark:group-hover:text-blue-400 light:group-hover:text-emerald-700 transition-colors">
                        <Check className="w-5 h-5" />
                      </div>
                      <div className="space-y-3">
                        <span className="text-base text-slate-300 dark:text-slate-300 light:text-gray-700 leading-relaxed">
                          {item.content}
                        </span>
                        <div className="text-xs text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 flex flex-wrap gap-3 items-center">
                          <span>Speaker: {item.speaker ?? "unknown"}</span>
                          {item.timestamp && (
                            <button
                              onClick={() => handleTimestampClick(item.timestamp)}
                              className="flex items-center gap-2 px-3 py-1 bg-[#ffffff0d] dark:bg-[#ffffff0d] light:bg-gray-100 rounded-full border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-gray-300 hover:bg-[#2b7fff1a] dark:hover:bg-[#2b7fff1a] light:hover:bg-blue-50 hover:border-[#2b7fff] dark:hover:border-[#2b7fff] light:hover:border-blue-500 transition-all duration-200 cursor-pointer group"
                              aria-label={`Jump to timestamp ${item.timestamp}`}
                            >
                              <ClockIcon className="w-3.5 h-3.5 text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors" />
                              <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors">
                                {item.timestamp}
                              </span>
                            </button>
                          )}
                        
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Always Expanded */}
                <div className="hidden md:block relative p-8 md:p-10">
                  <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start">
                    <div>
                      <h3 className="text-3xl font-bold text-white dark:text-white light:text-gray-900 tracking-tight mb-3">
                        {item.title}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1 flex-shrink-0 text-blue-500/80 dark:text-blue-500/80 light:text-emerald-600 group-hover:text-blue-400 dark:group-hover:text-blue-400 light:group-hover:text-emerald-700 transition-colors">
                          <Check className="w-5 h-5" />
                        </div>
                        <div className="space-y-3">
                          <span className="text-lg text-slate-300 dark:text-slate-300 light:text-gray-700 dark:group-hover:text-slate-200 light:group-hover:text-gray-900 transition-colors leading-relaxed">
                            {item.content}
                          </span>
                          <div className="text-xs text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 flex flex-wrap gap-3 items-center">
                            <span>Speaker: {item.speaker ?? "unknown"}</span>
                            {item.timestamp && (
                              <button
                                onClick={() => handleTimestampClick(item.timestamp)}
                                className="flex items-center gap-2 px-3 py-1 bg-[#ffffff0d] dark:bg-[#ffffff0d] light:bg-gray-100 rounded-full border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-gray-300 hover:bg-[#2b7fff1a] dark:hover:bg-[#2b7fff1a] light:hover:bg-blue-50 hover:border-[#2b7fff] dark:hover:border-[#2b7fff] light:hover:border-blue-500 transition-all duration-200 cursor-pointer group"
                                aria-label={`Jump to timestamp ${item.timestamp}`}
                              >
                                <ClockIcon className="w-3.5 h-3.5 text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors" />
                                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors">
                                  {item.timestamp}
                                </span>
                              </button>
                            )}
                           
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
          )}
        </div>
      </div>
    </section>
  );
};
