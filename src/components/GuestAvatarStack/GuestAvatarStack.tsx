import React, { useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

export interface Guest {
  initials: string;
  name: string;
  title: string;
  bgColor: string;
}

interface GuestAvatarStackProps {
  guests: Guest[];
  maxVisibleMobile?: number;
}

export const GuestAvatarStack = ({ guests, maxVisibleMobile = 2 }: GuestAvatarStackProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleGuestsMobile = isExpanded ? guests : guests.slice(0, maxVisibleMobile);
  const remainingCount = guests.length - maxVisibleMobile;
  const hasMore = remainingCount > 0;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      <div className="hidden md:flex md:flex-wrap md:gap-3">
        {guests.map((guest, index) => (
          <div
            key={index}
            className="flex items-center gap-3 pl-2 pr-5 py-2.5 bg-zinc-900 rounded-full border border-[#fffefe0d] transition-all duration-200 hover:bg-zinc-800"
          >
            <Avatar className={`w-8 h-8 ${guest.bgColor} flex-shrink-0`}>
              <AvatarFallback
                className={`${guest.bgColor} text-white text-xs font-bold [font-family:'Arial-Bold',Helvetica]`}
              >
                {guest.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] text-white font-medium [font-family:'Arial-Regular',Helvetica]">
                {guest.name}
              </span>
              <span className="text-xs text-[#70707b] [font-family:'Arial-Regular',Helvetica] mt-0.5">
                {guest.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="md:hidden flex flex-col gap-2.5">
        <div className="flex flex-wrap gap-2">
          {visibleGuestsMobile.map((guest, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 bg-zinc-900 rounded-full border border-[#fffefe0d] transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-2"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards'
              }}
            >
              <Avatar className={`w-7 h-7 ${guest.bgColor} flex-shrink-0`}>
                <AvatarFallback
                  className={`${guest.bgColor} text-white text-xs font-bold [font-family:'Arial-Bold',Helvetica]`}
                >
                  {guest.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-tight">
                <span className="text-sm text-white font-medium [font-family:'Arial-Regular',Helvetica]">
                  {guest.name}
                </span>
                <span className="text-[11px] text-[#70707b] [font-family:'Arial-Regular',Helvetica] mt-0.5">
                  {guest.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={handleToggle}
            className="text-[#2b7fff] text-sm font-medium [font-family:'Arial-Regular',Helvetica] hover:text-[#5a9fff] active:text-[#1a5fbf] transition-colors self-start underline decoration-[#2b7fff]/30 hover:decoration-[#5a9fff]/50 underline-offset-2"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Show less guests' : `Show ${remainingCount} more guests`}
          >
            {isExpanded ? 'show less' : `${remainingCount} more`}
          </button>
        )}
      </div>
    </div>
  );
};
