import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useInsightsByType } from '../../../../hooks/usePodcastData';
import { currentEpisodeId } from '../../../../data/episodes';
import type { EpisodeInsight } from '../../../../types/database';
import { SVGPattern } from '../../../../lib/svg-patterns';

// Fallback data in case DB is empty (prevents broken UI during development)
const HARDCODED_FALLBACK = [
  {
    title: 'INDIA 1 SIZE',
    metric_value: '120 Million',
    metric_unit: 'People',
    content: 'The consuming class (Singapore/Poland/Mexico) driving 85% of premium consumption.',
    trend_direction: 'up',
    category_tag: 'MARKET SIZE',
  },
  {
    title: 'HERO SKU RULE',
    metric_value: '30%',
    metric_unit: 'Revenue Share',
    content: 'One product should drive 30% of total revenue for D2C brands at scale.',
    trend_direction: 'up',
    category_tag: 'PRODUCT STRATEGY',
  },
  {
    title: 'MARKETPLACE MIX',
    metric_value: '80/20',
    metric_unit: 'Split Ratio',
    content: 'Maintain 80% marketplace, 20% D2C for optimal cash flow in early stages.',
    trend_direction: 'neutral',
    category_tag: 'CHANNEL STRATEGY',
  },
];

export const MarketSignalsSection = () => {
  // 1. Fetch Data from Supabase
  const { data: metrics, loading, error } = useInsightsByType(currentEpisodeId, 'metric');

  // 2. Determine what to show (DB Data OR Fallback)
  const displayMetrics = (metrics && metrics.length > 0) ? metrics : HARDCODED_FALLBACK;

  // 3. Helper to render the correct arrow based on database value
  const renderTrendIcon = (direction: string | null | undefined) => {
    switch (direction) {
      case 'up':
        return <ArrowUpRight className="w-5 h-5 text-emerald-500" />;
      case 'down':
        return <ArrowDownRight className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-slate-500" />;
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 dark:text-slate-500 light:text-gray-600">Loading Market Signals...</div>;

  return (
    <section id="signals-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 w-full">
      {/* Section Header */}
      <header className="pt-0 pb-4 md:pb-5 px-0 flex flex-col md:flex-row items-start md:items-end justify-between w-full border-b-[0.67px] border-solid border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 gap-2">
        <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
          Market Signals
        </h2>
        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5">
          Key data points driving the conversation
        </p>
      </header>

      {/* The Grid - Horizontal scroll on mobile, grid on desktop */}
      <div className="w-full overflow-x-auto md:overflow-x-visible -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 min-w-max md:min-w-0 md:w-full snap-x snap-mandatory md:snap-none">
          {displayMetrics.map((metric: any, index: number) => (
            <div
              key={index}
              className="group relative overflow-hidden p-5 md:p-6 rounded-xl md:rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-white border border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 hover:border-blue-500/30 dark:hover:border-blue-500/30 light:hover:border-blue-500 transition-all duration-300 min-w-[280px] md:min-w-0 snap-center"
            >
              <SVGPattern category={metric.category_tag} id={`pattern-signal-${index}`} opacity={0.06} />
            <div className="flex justify-between items-start mb-4 md:mb-6">
              {/* BLUE LABEL (Mapped from 'title') */}
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-[#2b7fff] dark:text-[#2b7fff] light:text-blue-700 uppercase">
                {metric.title}
              </span>

              {/* TREND ARROW (✅ CRITICAL: Mapped from 'trend_direction') */}
              <div className="bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-100 p-1 md:p-1.5 rounded-lg group-hover:bg-zinc-800 dark:group-hover:bg-zinc-800 light:group-hover:bg-gray-200 transition-colors">
                {renderTrendIcon(metric.trend_direction)}
              </div>
            </div>

            {/* BIG VALUE (Mapped from 'metric_value') */}
            <div className="mb-1 md:mb-2">
              <span className="text-2xl md:text-4xl font-bold text-white dark:text-white light:text-gray-900 tracking-tight">
                {metric.metric_value}
              </span>
            </div>

            {/* UNIT (Mapped from 'metric_unit') */}
            <div className="mb-3 md:mb-4 text-xs md:text-sm text-zinc-500 dark:text-zinc-500 light:text-gray-600 font-medium">
              {metric.metric_unit}
            </div>

            {/* DESCRIPTION (Mapped from 'content') */}
            <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-700 leading-relaxed border-t border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 pt-3 md:pt-4 mt-3 md:mt-4">
              {metric.content}
            </p>

            {/* CATEGORY TAG (✅ CRITICAL: Mapped from 'category_tag') */}
            {metric.category_tag && (
              <div className="mt-3 md:mt-4">
                <span className="inline-block px-2 py-1 text-[9px] md:text-[10px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-500 light:text-gray-600 bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-100 rounded uppercase">
                  {metric.category_tag}
                </span>
              </div>
            )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
