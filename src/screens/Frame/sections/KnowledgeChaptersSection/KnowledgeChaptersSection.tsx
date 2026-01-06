import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { PlayIcon } from "lucide-react";

interface Chapter {
  timestamp: string;
  timeInSeconds: number;
  title: string;
  description: string;
}

const chapters: Chapter[] = [
  {
    timestamp: "00:00",
    timeInSeconds: 0,
    title: "Introduction to Consumer Brands",
    description: "Overview of the Indian consumer market and key growth drivers",
  },
  {
    timestamp: "05:30",
    timeInSeconds: 330,
    title: "The 0-20 Cr Phase",
    description: "Product-market fit and building initial community traction",
  },
  {
    timestamp: "12:45",
    timeInSeconds: 765,
    title: "Scaling to 100 Cr",
    description: "Performance marketing strategies and CAC optimization",
  },
  {
    timestamp: "23:15",
    timeInSeconds: 1395,
    title: "Building the Hero SKU",
    description: "How to identify and scale your flagship product",
  },
  {
    timestamp: "34:20",
    timeInSeconds: 2060,
    title: "D2C vs Marketplace Mix",
    description: "Optimizing distribution channels for sustainable growth",
  },
  {
    timestamp: "42:00",
    timeInSeconds: 2520,
    title: "Brand Building at Scale",
    description: "Transitioning from performance marketing to brand marketing",
  },
];

interface KnowledgeChaptersSectionProps {
  onTimestampClick?: (timestamp: string) => void;
}

export const KnowledgeChaptersSection = ({ onTimestampClick }: KnowledgeChaptersSectionProps): JSX.Element => {
  return (
    <section id="chapters-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 pb-12 md:pb-16 w-full">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 w-full gap-2">
        <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
          Episode Chapters
        </h2>

        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5">
          Key topics covered in this episode
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        {chapters.map((chapter, index) => (
          <Card
            key={index}
            className="bg-zinc-900 dark:bg-zinc-900 light:bg-white border-[0.67px] border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 hover:border-blue-500/30 dark:hover:border-blue-500/30 light:hover:border-blue-500 hover:shadow-md dark:hover:shadow-none light:hover:shadow-md rounded-xl overflow-hidden card-interactive interactive-border interactive-glow group cursor-pointer transition-all duration-300"
            onClick={() => onTimestampClick && onTimestampClick(chapter.timestamp)}
          >
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <button
                    className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTimestampClick && onTimestampClick(chapter.timestamp);
                    }}
                  >
                    <PlayIcon className="w-3.5 h-3.5 text-[#2b7fff] dark:text-[#2b7fff] light:text-blue-600 transition-all duration-200 group-hover:text-[#5a9fff] dark:group-hover:text-[#5a9fff] light:group-hover:text-blue-700 group-hover:scale-110" />
                    <span className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#2b7fff] dark:text-[#2b7fff] light:text-blue-600 text-xs md:text-sm tracking-[0] leading-4 transition-colors duration-200 group-hover:text-[#5a9fff] dark:group-hover:text-[#5a9fff] light:group-hover:text-blue-700">
                      {chapter.timestamp}
                    </span>
                  </button>
                </div>

                <h3 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-base md:text-lg tracking-[-0.40px] leading-6 transition-colors duration-200 group-hover:text-[#f0f0f5] dark:group-hover:text-[#f0f0f5] light:group-hover:text-gray-800 mobile-text-stable">
                  {chapter.title}
                </h3>

                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-sm md:text-[15px] tracking-[0] leading-[21.4px] transition-colors duration-200 group-hover:text-[#b8b8c4] dark:group-hover:text-[#b8b8c4] light:group-hover:text-gray-700 mobile-text-stable">
                  {chapter.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
