import React from "react";
import { ClockIcon } from "lucide-react";

interface QuoteCardProps {
  quote: string;
  author: string;
  timestamp?: string;
  description?: string;
  gradient?: string;
  onTimestampClick?: (timestamp: string) => void;
}

export const QuoteCard = ({
  quote,
  author,
  timestamp,
  description,
  gradient = "from-[#1a1a1a] to-[#2a2a2a]",
  onTimestampClick
}: QuoteCardProps): JSX.Element => {
  const handleTimestampClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timestamp && onTimestampClick) {
      onTimestampClick(timestamp);
    }
  };
  return (
    <div className="w-full h-full">
      <div
        className={`relative w-full h-full bg-gradient-to-br ${gradient} dark:${gradient} light:bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-[#fffefe0d] dark:border-[#fffefe0d] light:border-2 light:border-gray-300 shadow-2xl`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(43,127,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(43,127,255,0.1),transparent_50%)] light:bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]" />

        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
          <div className="flex flex-col items-center gap-6 md:gap-8 max-w-3xl mx-auto text-center">
            {timestamp && (
              <button
                onClick={handleTimestampClick}
                className="flex items-center gap-2 px-4 py-2 bg-[#ffffff0d] dark:bg-[#ffffff0d] light:bg-gray-100 rounded-full border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-gray-300 hover:bg-[#2b7fff1a] dark:hover:bg-[#2b7fff1a] light:hover:bg-blue-50 hover:border-[#2b7fff] dark:hover:border-[#2b7fff] light:hover:border-blue-500 transition-all duration-200 cursor-pointer group"
                aria-label={`Jump to timestamp ${timestamp}`}
              >
                <ClockIcon className="w-4 h-4 text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-sm group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors">
                  {timestamp}
                </span>
              </button>
            )}

            <blockquote className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed tracking-tight">
              "{quote}"
            </blockquote>

            <div className="flex flex-col items-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#2b7fff] dark:via-[#2b7fff] light:via-blue-600 to-transparent opacity-50" />

              <cite className="not-italic [font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-base md:text-lg lg:text-xl tracking-wider uppercase">
                {author}
              </cite>

              {description && (
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 dark:from-black/20 light:from-white/40 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
