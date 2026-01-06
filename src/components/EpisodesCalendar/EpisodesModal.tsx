import React, { useState, useEffect } from "react";
import { XIcon, CalendarIcon } from "lucide-react";
import { Episode } from "../../types/episode";
import { CalendarView } from "./CalendarView";
import { MobileEpisodeView } from "./MobileEpisodeView";
import { currentEpisodeId } from "../../data/episodes";

interface EpisodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
}

export const EpisodesModal = ({ isOpen, onClose, episodes }: EpisodesModalProps): JSX.Element | null => {
  const [hoveredEpisode, setHoveredEpisode] = useState<Episode | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full h-full flex flex-col">
        <div className="flex-shrink-0 border-b border-[#fffefe0d] px-6 md:px-12 py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <CalendarIcon className="w-8 h-8 text-[#2b7fff]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white [font-family:'Arial-Bold',Helvetica]">
                Episode Calendar
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
            >
              <XIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {isMobile ? (
            <MobileEpisodeView episodes={episodes} />
          ) : (
            <div className="w-full h-full overflow-y-auto px-12 py-12">
              <div className="relative">
                <CalendarView
                  episodes={episodes}
                  onDateHover={setHoveredEpisode}
                  hoveredEpisode={hoveredEpisode}
                  currentEpisodeId={currentEpisodeId}
                />
                {hoveredEpisode && (
                  <div className="fixed top-1/2 right-12 transform -translate-y-1/2">
                    <div className="bg-black border border-[#fffefe0d] rounded-2xl p-6 shadow-2xl w-[380px] animate-in fade-in slide-in-from-right-4 duration-200">
                      <h3 className="text-xl font-bold text-[#2b7fff] mb-3 [font-family:'Arial-Bold',Helvetica]">
                        {hoveredEpisode.title}
                      </h3>
                      <p className="text-base text-white mb-4 [font-family:'Arial-Bold',Helvetica]">
                        {hoveredEpisode.guest}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[#9e9ea9] mb-4 [font-family:'Arial-Regular',Helvetica]">
                        <span>{hoveredEpisode.duration}</span>
                        <span>•</span>
                        <span>
                          {hoveredEpisode.releaseDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {hoveredEpisode.description && (
                        <p className="text-sm text-[#9e9ea9] leading-relaxed [font-family:'Arial-Regular',Helvetica]">
                          {hoveredEpisode.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
