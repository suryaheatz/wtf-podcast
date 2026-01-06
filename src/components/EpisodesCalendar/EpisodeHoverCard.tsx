import React from "react";
import { Episode } from "../../types/episode";

interface EpisodeHoverCardProps {
  episode: Episode;
  position?: { x: number; y: number };
}

export const EpisodeHoverCard = ({ episode }: EpisodeHoverCardProps): JSX.Element => {
  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="bg-black border border-[#fffefe0d] rounded-2xl p-6 shadow-2xl min-w-[320px] max-w-[400px]">
        <h3 className="text-lg font-bold text-[#2b7fff] mb-2 [font-family:'Arial-Bold',Helvetica]">
          {episode.title}
        </h3>
        <p className="text-sm text-white mb-3 [font-family:'Arial-Regular',Helvetica]">
          {episode.guest}
        </p>
        <div className="flex items-center justify-between text-xs text-[#9e9ea9] [font-family:'Arial-Regular',Helvetica]">
          <span>{episode.duration}</span>
          <span>{episode.releaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        {episode.description && (
          <p className="mt-3 text-sm text-[#9e9ea9] leading-relaxed [font-family:'Arial-Regular',Helvetica]">
            {episode.description}
          </p>
        )}
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
        <div className="border-8 border-transparent border-t-black" />
      </div>
    </div>
  );
};
