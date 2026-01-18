import { CheckCircle2Icon, XCircleIcon, ClockIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { useInsightsByType } from "../../../../hooks/usePodcastData";
import type { EpisodeInsight } from "../../../../types/database";

interface DosAndDontsSectionProps {
  episodeId?: string | null;
  onTimestampClick?: (timestamp: string) => void;
}

export const DosAndDontsSection = ({ episodeId = null, onTimestampClick }: DosAndDontsSectionProps): JSX.Element => {
  const { data: rawItems, loading, error } = useInsightsByType(episodeId, "roadmap_item");

  const { dos, donts } = React.useMemo(() => {
    const items = (rawItems ?? []) as EpisodeInsight[];
    const dos: EpisodeInsight[] = [];
    const donts: EpisodeInsight[] = [];

    for (const item of items) {
      const metadata = (item.metadata as any) ?? {};
      if (metadata.polarity === "do") dos.push(item);
      if (metadata.polarity === "dont") donts.push(item);
    }

    return { dos, donts };
  }, [rawItems]);

  if (loading) {
    return (
      <section id="playbook-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 w-full">
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 w-full gap-2">
          <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
            Dos and Don'ts
          </h2>
        </header>
        <div className="w-full text-center text-slate-400 dark:text-slate-400 light:text-gray-600">
          Loading do's and don'ts...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="playbook-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 w-full">
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 w-full gap-2">
          <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
            Dos and Don'ts
          </h2>
        </header>
        <div className="w-full text-center text-red-500 dark:text-red-500 light:text-red-700">
          Error loading do's and don'ts.
        </div>
      </section>
    );
  }
  return (
    <section id="playbook-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 w-full">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 w-full gap-2">
        <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white/80 dark:text-white/80 light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
          Dos and Don'ts
        </h2>

        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5">
          Essential guidelines for scaling consumer brands in India
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
        <Card className="bg-gradient-to-br from-emerald-950/40 to-zinc-900 dark:from-emerald-950/40 dark:to-zinc-900 light:from-emerald-50 light:to-white border-[0.67px] border-emerald-900/30 dark:border-emerald-900/30 light:border light:border-emerald-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100">
                <CheckCircle2Icon className="w-6 h-6 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
              </div>
              <h3 className="[font-family:'Arial-Bold',Helvetica] font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-900 text-lg md:text-xl tracking-[0] leading-6">
                DO THESE
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {dos.length === 0 ? (
                <div className="text-sm text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600">
                  No do items available for this episode.
                </div>
              ) : dos.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-white border border-emerald-900/20 dark:border-emerald-900/20 light:border-emerald-100 hover:border-emerald-800/40 dark:hover:border-emerald-800/40 light:hover:border-emerald-400 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-100 flex items-center justify-center mt-0.5 group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/20 light:group-hover:bg-emerald-200 transition-colors duration-200">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500 dark:text-emerald-500 light:text-emerald-600" />
                  </div>
                  <div className="flex-1 android-flex-fix">
                    <h4 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-sm md:text-base tracking-[0] leading-5 mb-1.5 mobile-text-stable">
                      {item.title || "Do"}
                    </h4>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5 mobile-text-stable">
                      {item.content || item.context || ""}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600">
                      <span>Speaker: {item.speaker ?? "unknown"}</span>
                      {item.timestamp_start && onTimestampClick && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTimestampClick(item.timestamp_start as string);
                          }}
                          className="flex items-center gap-2 px-3 py-1 bg-[#ffffff0d] dark:bg-[#ffffff0d] light:bg-gray-100 rounded-full border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-gray-300 hover:bg-[#2b7fff1a] dark:hover:bg-[#2b7fff1a] light:hover:bg-blue-50 hover:border-[#2b7fff] dark:hover:border-[#2b7fff] light:hover:border-blue-500 transition-all duration-200 cursor-pointer group"
                          aria-label={`Jump to timestamp ${item.timestamp_start}`}
                        >
                          <ClockIcon className="w-3.5 h-3.5 text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors" />
                          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors">
                            {item.timestamp_start}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-950/40 to-zinc-900 dark:from-red-950/40 dark:to-zinc-900 light:from-rose-50 light:to-white border-[0.67px] border-red-900/30 dark:border-red-900/30 light:border light:border-rose-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 dark:bg-red-500/20 light:bg-rose-100">
                <XCircleIcon className="w-6 h-6 text-red-400 dark:text-red-400 light:text-rose-600" />
              </div>
              <h3 className="[font-family:'Arial-Bold',Helvetica] font-bold text-red-400 dark:text-red-400 light:text-rose-900 text-lg md:text-xl tracking-[0] leading-6">
                DON'T DO THESE
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {donts.length === 0 ? (
                <div className="text-sm text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600">
                  No don't items available for this episode.
                </div>
              ) : donts.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-white border border-red-900/20 dark:border-red-900/20 light:border-rose-100 hover:border-red-800/40 dark:hover:border-red-800/40 light:hover:border-rose-400 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 dark:bg-red-500/10 light:bg-rose-100 flex items-center justify-center mt-0.5 group-hover:bg-red-500/20 dark:group-hover:bg-red-500/20 light:group-hover:bg-rose-200 transition-colors duration-200">
                    <XCircleIcon className="w-4 h-4 text-red-500 dark:text-red-500 light:text-rose-600" />
                  </div>
                  <div className="flex-1 android-flex-fix">
                    <h4 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-sm md:text-base tracking-[0] leading-5 mb-1.5 mobile-text-stable">
                      {item.title || "Don't"}
                    </h4>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5 mobile-text-stable">
                      {item.content || item.context || ""}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600">
                      <span>Speaker: {item.speaker ?? "unknown"}</span>
                      {item.timestamp_start && onTimestampClick && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTimestampClick(item.timestamp_start as string);
                          }}
                          className="flex items-center gap-2 px-3 py-1 bg-[#ffffff0d] dark:bg-[#ffffff0d] light:bg-gray-100 rounded-full border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-gray-300 hover:bg-[#2b7fff1a] dark:hover:bg-[#2b7fff1a] light:hover:bg-blue-50 hover:border-[#2b7fff] dark:hover:border-[#2b7fff] light:hover:border-blue-500 transition-all duration-200 cursor-pointer group"
                          aria-label={`Jump to timestamp ${item.timestamp_start}`}
                        >
                          <ClockIcon className="w-3.5 h-3.5 text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors" />
                          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs group-hover:text-[#2b7fff] dark:group-hover:text-[#2b7fff] light:group-hover:text-blue-700 transition-colors">
                            {item.timestamp_start}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
