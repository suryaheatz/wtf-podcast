import { useMemo, useState } from "react";
import type { EpisodeWithDetails } from "../../../../types/database";
import { getEpisodeNumberDisplay } from "../../../../lib/episode-utils";
import { useTheme } from "../../../../contexts/ThemeContext";
import { PartPicker } from "../../../../components/PartPicker";

interface EpisodeChunksSectionProps {
  episode?: EpisodeWithDetails | null;
  activeChunk?: number;
  onChunkChange?: (chunkNumber: number) => void;
}

const chunkSizeMinutes = 20;

const getTotalChunks = (episode?: EpisodeWithDetails | null): number => {
  const metadata = episode?.metadata;

  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const maybeTotalChunks =
      (metadata as Record<string, unknown>).total_chunks ??
      (metadata as Record<string, unknown>).totalChunks;
    if (
      typeof maybeTotalChunks === "number" &&
      Number.isFinite(maybeTotalChunks) &&
      maybeTotalChunks > 0
    ) {
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

  const episodeLabel = getEpisodeNumberDisplay(
    episode?.episode_number,
    episode?.title
  );

  const isDark = theme === "dark";

  const titleStyles = isDark ? "text-white/80" : "text-gray-900";
  const subtitleStyles = isDark ? "text-[#9e9ea9]" : "text-gray-600";
  const borderStyles = isDark ? "border-[#fffefe0d]" : "border-gray-200";

  // We keep "chunk" naming in state + callbacks (backend semantics),
  // but show "Chapter" labels in the UI.
  const uiLabel = "Chapter";

  return (
    <section
      id="chunks-section"
      className="flex flex-col items-start gap-6 md:gap-8 pt-12 md:pt-16 pb-8 w-full"
    >
      <header
        className={`flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b w-full gap-2 ${borderStyles}`}
      >
        <h2
          className={`[font-family:'Arial-Bold',Helvetica] font-bold text-xl md:text-2xl tracking-[-0.60px] leading-8 ${titleStyles}`}
        >
          Episode Chapters
        </h2>
        <p
          className={`[font-family:'Arial-Regular',Helvetica] font-normal text-xs md:text-sm tracking-[0] leading-5 ${subtitleStyles}`}
        >
          {episodeLabel} is broken into {totalChunks} chapters
        </p>
      </header>

      <div className="w-full">
        {/* Full-width selector aligned with the rest of your UI (use your page gutters) */}
        <div className="w-full">
          <PartPicker
            total={totalChunks}
            activeIndex={Math.max(0, selectedChunk - 1)} // PartPicker expects 0-based
            onSelect={(index) => {
              const chunkNumber = index + 1; // keep backend semantics
              onChunkChange?.(chunkNumber);
              if (activeChunk === undefined) setInternalChunk(chunkNumber);
            }}
            label={uiLabel}
          />
        </div>

        {/* Removed: the "Active Chunk" info panel (the struck-through card in your screenshot) */}
      </div>
    </section>
  );
};
