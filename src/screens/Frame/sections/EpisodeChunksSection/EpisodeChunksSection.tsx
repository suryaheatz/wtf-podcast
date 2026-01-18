import { useMemo, useState } from "react";
import type { EpisodeWithDetails } from "../../../../types/database";
import { getEpisodeNumberDisplay } from "../../../../lib/episode-utils";
import { useTheme } from "../../../../contexts/ThemeContext";

interface EpisodeChunksSectionProps {
  episode?: EpisodeWithDetails | null;
  activeChunk?: number;
  onChunkChange?: (chunkNumber: number) => void;
}

const chunkSizeMinutes = 20;

const getTotalChunks = (episode?: EpisodeWithDetails | null): number => {
  const metadata = episode?.metadata;

  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const maybeTotalChunks = (metadata as Record<string, unknown>).total_chunks ?? (metadata as Record<string, unknown>).totalChunks;
    if (typeof maybeTotalChunks === "number" && Number.isFinite(maybeTotalChunks) && maybeTotalChunks > 0) {
      return Math.max(1, Math.floor(maybeTotalChunks));
    }
  }

  const duration = episode?.duration_minutes ?? 0;
  if (duration > 0) {
    return Math.max(1, Math.ceil(duration / chunkSizeMinutes));
  }

  return 1;
};

export const EpisodeChunksSection = ({
  episode,
  activeChunk,
  onChunkChange,
}: EpisodeChunksSectionProps): JSX.Element => {
  const { theme } = useTheme();
  const totalChunks = useMemo(() => getTotalChunks(episode), [episode]);
  const [internalChunk, setInternalChunk] = useState(1);
  const selectedChunk = activeChunk ?? internalChunk;

  const episodeLabel = getEpisodeNumberDisplay(episode?.episode_number, episode?.title);

  const tabs = Array.from({ length: totalChunks }, (_, index) => index + 1);

  const isDark = theme === "dark";

  const titleStyles = isDark ? "text-white/80" : "text-gray-900";
  const subtitleStyles = isDark ? "text-[#9e9ea9]" : "text-gray-600";
  const borderStyles = isDark ? "border-[#fffefe0d]" : "border-gray-200";
  const tabTextInactive = isDark ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900";
  const tabTextActive = isDark ? "text-white" : "text-gray-900";
  const panelBg = isDark ? "bg-zinc-900" : "bg-white";
  const panelBorder = isDark ? "border-[#fffefe0d]" : "border-gray-200";
  const panelText = isDark ? "text-zinc-200" : "text-gray-800";
  const accent = isDark ? "bg-[#2b7fff]" : "bg-blue-600";

  return (
    <section id="chunks-section" className="flex flex-col items-start gap-6 md:gap-8 pt-12 md:pt-16 pb-8 w-full">
      <header className={`flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b w-full gap-2 ${borderStyles}`}>
        <h2 className={`[font-family:'Arial-Bold',Helvetica] font-bold text-xl md:text-2xl tracking-[-0.60px] leading-8 ${titleStyles}`}>
          Episode Chunks
        </h2>
        <p className={`[font-family:'Arial-Regular',Helvetica] font-normal text-xs md:text-sm tracking-[0] leading-5 ${subtitleStyles}`}>
          {episodeLabel} is broken into {totalChunks} chunks
        </p>
      </header>

      <div className="w-full">
        <div className={`border-b ${borderStyles}`}>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {tabs.map((chunk) => {
              const isActive = chunk === selectedChunk;
              return (
                <button
                  key={chunk}
                  type="button"
                  onClick={() => {
                    onChunkChange?.(chunk);
                    if (activeChunk === undefined) {
                      setInternalChunk(chunk);
                    }
                  }}
                  className={`relative py-3 text-sm font-semibold tracking-[0] transition-colors ${isActive ? tabTextActive : tabTextInactive}`}
                  aria-selected={isActive}
                  role="tab"
                >
                  Chunk {chunk}
                  {isActive && (
                    <span
                      className={`absolute left-0 right-0 -bottom-px h-0.5 ${accent}`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={`mt-6 rounded-2xl border p-6 ${panelBg} ${panelBorder}`}>
          <div className="flex flex-col gap-2">
            <span className={`text-xs uppercase tracking-[0.22em] ${subtitleStyles}`}>Active Chunk</span>
            <h3 className={`text-2xl font-black tracking-[-0.8px] ${panelText}`}>
              Chunk {selectedChunk} of {totalChunks}
            </h3>
            <p className={`text-sm leading-6 ${subtitleStyles}`}>
              This chunk is part of {episodeLabel}. Select a tab to browse the episode segments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
