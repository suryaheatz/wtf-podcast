import React from "react";
import { CalendarIcon } from "lucide-react";

interface EpisodesButtonProps {
  onClick: () => void;
}

export const EpisodesButton = ({ onClick }: EpisodesButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#2b7fff] hover:bg-[#1e5fcc] text-white px-4 py-6 rounded-l-2xl shadow-2xl transition-all duration-300 hover:px-6 group"
    >
      <div className="flex flex-col items-center gap-2">
        <CalendarIcon className="w-6 h-6" />
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold tracking-wider [font-family:'Arial-Bold',Helvetica] writing-mode-vertical transform rotate-180">
            EPISODES
          </span>
        </div>
      </div>
    </button>
  );
};
