import React from "react";
import { SwipeableCardStack } from "../../../../components/SwipeableCardStack";
import { QuoteCard } from "../../../../components/QuoteCard";
import { useQuotes } from "../../../../hooks/usePodcastData";

interface VoiceOfAuthoritySectionProps {
  onTimestampClick: (timestamp: string) => void;
  podcastId?: string;
  episodeId?: string | null;
}

export const VoiceOfAuthoritySection = ({
  onTimestampClick,
  podcastId = '550e8400-e29b-41d4-a716-446655440000',
  episodeId = null,
}: VoiceOfAuthoritySectionProps): JSX.Element => {
  const { data: quotes, loading, error } = useQuotes(episodeId || undefined, episodeId ? undefined : podcastId);

  if (loading) {
    return (
      <section id="quotes-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 pb-12 md:pb-16 w-full">
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 w-full gap-2">
          <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
            Voice of Authority
          </h2>
          <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5">
            Loading quotes...
          </p>
        </header>
        <div className="w-full flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="quotes-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 pb-12 md:pb-16 w-full">
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 w-full gap-2">
          <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
            Voice of Authority
          </h2>
        </header>
        <div className="w-full flex items-center justify-center py-12">
          <p className="text-red-500 dark:text-red-500 light:text-red-700">Error loading quotes: {error.message}</p>
        </div>
      </section>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <section id="quotes-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 pb-12 md:pb-16 w-full">
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 w-full gap-2">
          <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
            Voice of Authority
          </h2>
        </header>
        <div className="w-full">
          <SwipeableCardStack autoPlayInterval={5000}>
            <QuoteCard
              key="fallback-quote"
              quote={`"An idle mind is the devil's workshop" is a proverb meaning that when people have nothing productive to do, they are more likely to think bad thoughts, get into trouble, or engage in mischief, as the mind naturally fills with negative or wasteful ideas if not occupied with good work or noble pursuits`}
              author="PROVERB"
              gradient="from-[#1a1a1a] to-[#252525]"
              onTimestampClick={onTimestampClick}
            />
          </SwipeableCardStack>
        </div>
      </section>
    );
  }

  return (
    <section id="quotes-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 pb-12 md:pb-16 w-full">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 w-full gap-2">
        <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
          Voice of Authority
        </h2>

        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5">
          Key insights from industry leaders • Swipe to explore
        </p>
      </header>

      <div className="w-full">
        <SwipeableCardStack autoPlayInterval={5000}>
          {quotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote.quote_text}
              author={quote.author}
              timestamp={quote.timestamp || undefined}
              description={quote.description || undefined}
              gradient={quote.gradient}
              onTimestampClick={onTimestampClick}
            />
          ))}
        </SwipeableCardStack>
      </div>
    </section>
  );
};
