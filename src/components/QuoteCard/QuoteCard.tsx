import React from "react";
import { ClockIcon } from "lucide-react";

interface QuoteCardProps {
  quote: string;
  author: string;
  timestamp?: string;
  description?: string;
  onTimestampClick?: (timestamp: string) => void;
}

export const QuoteCard = ({
  quote,
  author,
  timestamp,
  description,
  onTimestampClick,
}: QuoteCardProps): JSX.Element => {
  const handleTimestampClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timestamp && onTimestampClick) onTimestampClick(timestamp);
  };

  // ✅ HARD-CODED THEME VARIANTS (Tailwind-safe)
  const LIGHT_GRADIENT = "bg-gradient-to-br from-white to-gray-100";
  const DARK_GRADIENT = "dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:to-[#2a2a2a]";

  return (
    <div className="w-full h-full">
      <div
        className={[
          "relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border shadow-2xl",
          LIGHT_GRADIENT,
          DARK_GRADIENT,
          "border-gray-300 dark:border-[#fffefe0d]",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(43,127,255,0.10),transparent_50%)]" />

        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
          <div className="flex flex-col items-center gap-6 md:gap-8 max-w-3xl mx-auto text-center">
            {timestamp && (
              <button
                onClick={handleTimestampClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer group
                           bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-blue-500
                           dark:bg-[#ffffff0d] dark:border-[#ffffff1a] dark:hover:bg-[#2b7fff1a] dark:hover:border-[#2b7fff]"
                aria-label={`Jump to timestamp ${timestamp}`}
              >
                <ClockIcon className="w-4 h-4 text-gray-700 group-hover:text-blue-700 dark:text-[#9e9ea9] dark:group-hover:text-[#2b7fff] transition-colors" />
                <span className="text-sm text-gray-700 group-hover:text-blue-700 dark:text-[#9e9ea9] dark:group-hover:text-[#2b7fff] transition-colors">
                  {timestamp}
                </span>
              </button>
            )}

            <blockquote className="font-bold text-gray-900 dark:text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed tracking-tight">
              “{quote}”
            </blockquote>

            <div className="flex flex-col items-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50 dark:via-[#2b7fff]" />

              <cite className="not-italic font-bold text-gray-900 dark:text-white text-base md:text-lg lg:text-xl tracking-wider uppercase">
                {author}
              </cite>

              {description && (
                <p className="text-gray-700 dark:text-[#9e9ea9] text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/40 to-transparent dark:from-black/20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
