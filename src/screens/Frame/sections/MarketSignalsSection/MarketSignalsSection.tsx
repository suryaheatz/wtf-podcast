import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useInsightsByType } from "../../../../hooks/usePodcastData";
import type { EpisodeInsightRow } from "../../../../types/database";
import { SVGPattern } from "../../../../lib/svg-patterns";
import { StackedScrollCards } from "../../../../components/StackedScrollCards";

interface MarketSignalsSectionProps {
  episodeId?: string | null;
  chunkNumber?: number | null;
  chunkSizeMinutes?: number;
}

const getChunkRange = (chunkNumber?: number | null, chunkSizeMinutes = 20) => {
  if (!chunkNumber || chunkNumber < 1) return null;
  const start = (chunkNumber - 1) * chunkSizeMinutes * 60;
  const end = chunkNumber * chunkSizeMinutes * 60;
  return { start, end };
};

export const MarketSignalsSection = ({
  episodeId = null,
  chunkNumber = null,
  chunkSizeMinutes = 20,
}: MarketSignalsSectionProps) => {
  const { data: metrics, loading, error } = useInsightsByType(episodeId, "metric");
  const chunkRange = getChunkRange(chunkNumber, chunkSizeMinutes);

  // Measure sticky header height so cards never overlap it
  const [headerHeight, setHeaderHeight] = React.useState(96);

  React.useEffect(() => {
    const el = document.getElementById("site-header");
    if (!el) return;

    const update = () => setHeaderHeight(el.getBoundingClientRect().height + 12);

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const displayMetrics = React.useMemo(() => {
    const list = (metrics ?? []) as EpisodeInsightRow[];
    if (!chunkRange) return list;

    return list.filter((metric) => {
      const seconds = metric.timestamp_seconds;
      if (typeof seconds !== "number") return false;
      return seconds >= chunkRange.start && seconds < chunkRange.end;
    });
  }, [metrics, chunkRange]);

  const renderTrendIcon = (direction: string | null | undefined) => {
    switch (direction) {
      case "up":
        return <ArrowUpRight className="w-5 h-5 text-emerald-500" />;
      case "down":
        return <ArrowDownRight className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500 dark:text-slate-500 light:text-gray-600">
        Loading Market Signals...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-500 light:text-red-700">
        Error loading Market Signals.
      </div>
    );
  }

  return (
    <section
      id="signals-section"
      className="scroll-mt-24 flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 w-full"
    >
      <header className="pt-0 pb-4 md:pb-5 px-0 flex flex-col md:flex-row items-start md:items-end justify-between w-full border-b-[0.67px] border-solid border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 gap-2">
        <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
          Market Signals
        </h2>
        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5">
          Key data points driving the conversation
        </p>
      </header>

      {/* MOBILE */}
      <div className="md:hidden w-full">
        <div className="mx-auto w-full max-w-6xl px-6">
          {displayMetrics.length === 0 ? (
            <div className="text-slate-400 dark:text-slate-400 light:text-gray-600">
              No market signals available for this episode.
            </div>
          ) : (
            <StackedScrollCards topOffset={headerHeight}>
              {displayMetrics.map((metric: EpisodeInsightRow, index: number) => (
                <div
                  key={index}
                  className="
                    group relative overflow-hidden p-5 rounded-2xl
                    bg-zinc-900/50 dark:bg-zinc-900 light:bg-white
                    border border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200
                    transition-all duration-300 shadow-sm
                  "
                >
                  <SVGPattern
                    category={metric.category_tag}
                    id={`pattern-signal-mobile-${index}`}
                    opacity={0.06}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/10 dark:to-black/10 light:to-black/[0.04]" />

                  <div className="relative min-w-0 break-words [overflow-wrap:anywhere]">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold tracking-wider text-[#2b7fff] dark:text-[#2b7fff] light:text-blue-700 uppercase">
                        {metric.title}
                      </span>
                      <div className="bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-100 p-1.5 rounded-lg transition-colors">
                        {renderTrendIcon(metric.trend_direction)}
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white dark:text-white light:text-gray-900 tracking-tight">
                        {metric.metric_value}
                      </span>
                    </div>

                    <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-500 light:text-gray-600 font-medium">
                      {metric.metric_unit}
                    </div>

                    <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-700 leading-relaxed border-t border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 pt-4 mt-4">
                      {metric.content}
                    </p>

                    {metric.category_tag && (
                      <div className="mt-4">
                        <span className="inline-block px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-500 light:text-gray-600 bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-100 rounded uppercase">
                          {metric.category_tag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </StackedScrollCards>
          )}
        </div>
      </div>

      {/* DESKTOP/TABLET */}
      <div className="hidden md:block w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {displayMetrics.length === 0 ? (
            <div className="text-slate-400 dark:text-slate-400 light:text-gray-600">
              No market signals available for this episode.
            </div>
          ) : (
            displayMetrics.map((metric: EpisodeInsightRow, index: number) => (
              <div
                key={index}
                className="
                  group relative overflow-hidden p-6 rounded-2xl
                  bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-white
                  border border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200
                  hover:border-blue-500/30 dark:hover:border-blue-500/30 light:hover:border-blue-500
                  transition-all duration-300
                "
              >
                <SVGPattern
                  category={metric.category_tag}
                  id={`pattern-signal-${index}`}
                  opacity={0.06}
                />

                <div className="min-w-0 break-words [overflow-wrap:anywhere]">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold tracking-wider text-[#2b7fff] dark:text-[#2b7fff] light:text-blue-700 uppercase">
                      {metric.title}
                    </span>

                    <div className="bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-100 p-1.5 rounded-lg group-hover:bg-zinc-800 dark:group-hover:bg-zinc-800 light:group-hover:bg-gray-200 transition-colors">
                      {renderTrendIcon(metric.trend_direction)}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white dark:text-white light:text-gray-900 tracking-tight">
                      {metric.metric_value}
                    </span>
                  </div>

                  <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-500 light:text-gray-600 font-medium">
                    {metric.metric_unit}
                  </div>

                  <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-gray-700 leading-relaxed border-t border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 pt-4 mt-4">
                    {metric.content}
                  </p>

                  {metric.category_tag && (
                    <div className="mt-4">
                      <span className="inline-block px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-500 light:text-gray-600 bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-gray-100 rounded uppercase">
                        {metric.category_tag}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
