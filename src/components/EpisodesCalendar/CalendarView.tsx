import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Episode } from "../../types/episode";

interface CalendarViewProps {
  episodes: Episode[];
  onDateHover?: (episode: Episode | null) => void;
  hoveredEpisode: Episode | null;
  currentEpisodeId?: string;
  onEpisodeSelect?: (episode: Episode) => void;
}


export const CalendarView = ({
  episodes,
  onDateHover,
  hoveredEpisode,
  currentEpisodeId,
  onEpisodeSelect,
}: CalendarViewProps): JSX.Element => {

  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getEpisodeForDate = (day: number): Episode | undefined => {
    return episodes.find(ep => {
      const epDate = ep.releaseDate;
      return (
        epDate.getDate() === day &&
        epDate.getMonth() === currentDate.getMonth() &&
        epDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={previousMonth}
          className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-2xl font-bold text-white [font-family:'Arial-Bold',Helvetica]">
          {monthName}
        </h2>
        <button
          onClick={nextMonth}
          className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-bold text-[#70707b] [font-family:'Arial-Bold',Helvetica]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {calendarDays.map((day, index) => {
          const episode = day ? getEpisodeForDate(day) : null;
          const isHovered = hoveredEpisode && episode && hoveredEpisode.id === episode.id;
          const isCurrent = episode && episode.id === currentEpisodeId;

          return (
            <div
              key={index}
              className="aspect-square relative"
              onMouseEnter={() => episode && onDateHover?.(episode)}
            >
              {day ? (
                <div
                className={`w-full h-full flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  episode
                    ? isCurrent
                      ? `bg-gradient-to-br from-emerald-500 to-emerald-600 ring-4 ring-emerald-400/50 shadow-lg shadow-emerald-500/30 cursor-pointer scale-105 hover:scale-110 ${isHovered ? 'ring-4 ring-emerald-300' : ''}`
                      : `bg-[#2b7fff] hover:bg-[#1e5fcc] cursor-pointer ${isHovered ? 'ring-2 ring-white scale-105' : ''}`
                    : 'bg-transparent'
                }`}
                onClick={() => episode && onEpisodeSelect?.(episode)}
                role={episode ? "button" : undefined}
                tabIndex={episode ? 0 : -1}
                onKeyDown={(e) => {
                  if (!episode) return;
                  if (e.key === "Enter" || e.key === " ") onEpisodeSelect?.(episode);
                }}
              >
              
                  <span
                    className={`text-2xl font-bold [font-family:'Arial-Bold',Helvetica] ${
                      episode ? 'text-white' : 'text-[#52525c]'
                    }`}
                  >
                    {day}
                  </span>
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-emerald-500 animate-pulse" />
                  )}
                </div>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-500 to-emerald-600 ring-2 ring-emerald-400/50" />
            <span className="text-sm text-white [font-family:'Arial-Regular',Helvetica]">
              Current Episode
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#2b7fff]" />
            <span className="text-sm text-white [font-family:'Arial-Regular',Helvetica]">
              Available Episodes
            </span>
          </div>
        </div>
        <span className="text-sm text-[#70707b] [font-family:'Arial-Regular',Helvetica]">
          {episodes.length} Episodes Total
        </span>
      </div>
    </div>
  );
};
