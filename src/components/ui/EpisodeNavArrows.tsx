import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEpisodeNavigation } from "../../hooks/useEpisodeNavigation";

const btnBase =
  "h-11 w-11 rounded-full bg-black/80 text-white border border-white/10 " +
  "hover:bg-black hover:border-white/20 active:scale-95 transition " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

export default function EpisodeNavArrows() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { prevId, nextId } = useEpisodeNavigation(id ?? null);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Episode prev/next */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className={btnBase}
          onClick={() => prevId && navigate(`/episode/${prevId}`)}
          disabled={!prevId}
          aria-label="Previous episode"
          title="Previous episode"
        >
          <ChevronLeft className="mx-auto" size={18} />
        </button>

        <button
          type="button"
          className={btnBase}
          onClick={() => nextId && navigate(`/episode/${nextId}`)}
          disabled={!nextId}
          aria-label="Next episode"
          title="Next episode"
        >
          <ChevronRight className="mx-auto" size={18} />
        </button>
      </div>

      {/* Browser back/forward */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className={btnBase}
          onClick={() => navigate(-1)}
          aria-label="Back"
          title="Back"
        >
          <ArrowLeft className="mx-auto" size={18} />
        </button>

        <button
          type="button"
          className={btnBase}
          onClick={() => navigate(1)}
          aria-label="Forward"
          title="Forward"
        >
          <ArrowRight className="mx-auto" size={18} />
        </button>
      </div>
    </div>
  );
}
