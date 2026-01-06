import React, { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Episode } from "../../types/episode";

interface MobileEpisodeViewProps {
  episodes: Episode[];
}

interface MonthGroup {
  month: string;
  year: number;
  episodes: Episode[];
}

export const MobileEpisodeView = ({ episodes }: MobileEpisodeViewProps): JSX.Element => {
  const groupEpisodesByMonth = (): MonthGroup[] => {
    const groups: { [key: string]: MonthGroup } = {};

    episodes.forEach(episode => {
      const date = episode.releaseDate;
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleString('default', { month: 'long' }).toUpperCase();
      const year = date.getFullYear();

      if (!groups[monthKey]) {
        groups[monthKey] = {
          month: monthName,
          year,
          episodes: []
        };
      }

      groups[monthKey].episodes.push(episode);
    });

    return Object.values(groups).sort((a, b) => {
      const aDate = new Date(a.year, a.episodes[0].releaseDate.getMonth());
      const bDate = new Date(b.year, b.episodes[0].releaseDate.getMonth());
      return aDate.getTime() - bDate.getTime();
    });
  };

  const monthGroups = groupEpisodesByMonth();

  return (
    <div className="w-full h-full overflow-y-auto pb-20" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>
        {`
          .mobile-episode-view::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="mobile-episode-view space-y-12 px-6 py-6">
        {monthGroups.map((group, groupIndex) => (
          <MonthSection key={groupIndex} monthGroup={group} />
        ))}
      </div>
    </div>
  );
};

interface MonthSectionProps {
  monthGroup: MonthGroup;
}

const MonthSection = ({ monthGroup }: MonthSectionProps): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-white mb-6 [font-family:'Arial-Bold',Helvetica]">
        {monthGroup.month} {monthGroup.year}
      </h3>

      <div className="relative">
        {monthGroup.episodes.length > 2 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg -ml-2"
            >
              <ChevronLeftIcon className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg -mr-2"
            >
              <ChevronRightIcon className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          {monthGroup.episodes.map((episode, index) => (
            <EpisodeCard key={index} episode={episode} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface EpisodeCardProps {
  episode: Episode;
}

const EpisodeCard = ({ episode }: EpisodeCardProps): JSX.Element => {
  const dayOfWeek = episode.releaseDate.toLocaleString('default', { weekday: 'short' }).toUpperCase();
  const dayOfMonth = episode.releaseDate.getDate();

  return (
    <div className="flex-shrink-0 w-[280px] bg-zinc-900 rounded-2xl border border-[#fffefe0d] overflow-hidden">
      <div className="bg-[#2b7fff] px-6 py-6 text-center">
        <div className="text-sm font-bold text-white/90 mb-2 [font-family:'Arial-Bold',Helvetica]">
          {dayOfWeek}
        </div>
        <div className="text-5xl font-bold text-white [font-family:'Arial-Bold',Helvetica]">
          {dayOfMonth}
        </div>
      </div>

      <div className="p-5">
        <h4 className="text-base font-bold text-white mb-2 line-clamp-2 [font-family:'Arial-Bold',Helvetica]">
          {episode.title}
        </h4>
        <p className="text-sm text-[#9e9ea9] mb-3 [font-family:'Arial-Regular',Helvetica]">
          {episode.guest}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#70707b] [font-family:'Arial-Regular',Helvetica]">
            {episode.duration}
          </span>
        </div>
      </div>
    </div>
  );
};
