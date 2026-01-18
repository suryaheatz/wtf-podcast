import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEpisodeNavigation } from "../../hooks/useEpisodeNavigation";

const btnBase =
  "h-11 w-11 md:h-12 md:w-12 rounded-xl bg-white/10 text-white border border-white/20 " +
  "hover:bg-white/15 hover:border-white/40 active:scale-95 transition " +
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/10";

interface EpisodeNavArrowsProps {
  episodeNumber?: number | null;
}

export default function EpisodeNavArrows({ episodeNumber = null }: EpisodeNavArrowsProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { prevId, nextId } = useEpisodeNavigation(id ?? null);

  return (
    <div className="w-full flex justify-center px-6 pt-6">
      <div className="flex items-center gap-4 bg-[#2b7fff] text-white rounded-2xl px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          className={btnBase}
          onClick={() => prevId && navigate(`/episode/${prevId}`)}
          disabled={!prevId}
          aria-label="Previous episode"
          title="Previous episode"
        >
          <ChevronLeft className="mx-auto" size={20} />
        </button>

        <div className="px-3 md:px-6">
          <span className="text-xs md:text-sm font-semibold tracking-[0.35em] opacity-80">EPISODE</span>
          <div className="text-xl md:text-2xl font-black tracking-[0.2em]">
            {episodeNumber ? String(episodeNumber) : "—"}
          </div>
        </div>

        <button
          type="button"
          className={btnBase}
          onClick={() => nextId && navigate(`/episode/${nextId}`)}
          disabled={!nextId}
          aria-label="Next episode"
          title="Next episode"
        >
          <ChevronRight className="mx-auto" size={20} />
        </button>
      </div>
    </div>
  );
}
