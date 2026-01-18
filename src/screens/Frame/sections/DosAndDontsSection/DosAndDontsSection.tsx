import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const dosAndDonts = {
  dos: [
    {
      title: "Focus on India 1 Demographic",
      description: "Target the top 30M households that drive 60-70% of consumption value.",
    },
    {
      title: "Build Product-Market Fit First",
      description: "0-20Cr phase must be built on authentic product reviews and community, not ads.",
    },
    {
      title: "Maintain 80/20 Distribution Mix",
      description: "Keep 80% marketplace and 20% D2C split for healthy cash flow in early stages.",
    },
    {
      title: "Create Your Hero SKU",
      description: "Identify and double down on your flagship product that drives majority of revenue.",
    },
    {
      title: "Use ECG Content Strategy",
      description: "Balance Evergreen, Controversial, and Growth content to build organic attention.",
    },
    {
      title: "Invest in Supply Chain Early",
      description: "Offline distribution becomes critical post-100Cr; prepare infrastructure beforehand.",
    },
  ],
  donts: [
    {
      title: "Don't Use Performance Marketing Too Early",
      description: "Burning cash on ads before PMF artificially inflates growth and destroys unit economics.",
    },
    {
      title: "Don't Target All 1.4 Billion People",
      description: "Mass market approach dilutes brand positioning. Focus beats reach in consumer brands.",
    },
    {
      title: "Don't Skip Community Building",
      description: "Brands that scale without authentic community face customer retention issues later.",
    },
    {
      title: "Don't Ignore Unit Economics",
      description: "Growing revenue without profitable unit economics is building a house of cards.",
    },
    {
      title: "Don't Over-Index on D2C Only",
      description: "Pure D2C models struggle with scale. Marketplaces provide necessary distribution reach.",
    },
    {
      title: "Don't Delay Offline Strategy",
      description: "Waiting until 100Cr to think about offline means losing 2 years of market development.",
    },
  ],
};

export const DosAndDontsSection = (): JSX.Element => {
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
              {dosAndDonts.dos.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-white border border-emerald-900/20 dark:border-emerald-900/20 light:border-emerald-100 hover:border-emerald-800/40 dark:hover:border-emerald-800/40 light:hover:border-emerald-400 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-100 flex items-center justify-center mt-0.5 group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/20 light:group-hover:bg-emerald-200 transition-colors duration-200">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500 dark:text-emerald-500 light:text-emerald-600" />
                  </div>
                  <div className="flex-1 android-flex-fix">
                    <h4 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-sm md:text-base tracking-[0] leading-5 mb-1.5 mobile-text-stable">
                      {item.title}
                    </h4>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5 mobile-text-stable">
                      {item.description}
                    </p>
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
              {dosAndDonts.donts.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-white border border-red-900/20 dark:border-red-900/20 light:border-rose-100 hover:border-red-800/40 dark:hover:border-red-800/40 light:hover:border-rose-400 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 dark:bg-red-500/10 light:bg-rose-100 flex items-center justify-center mt-0.5 group-hover:bg-red-500/20 dark:group-hover:bg-red-500/20 light:group-hover:bg-rose-200 transition-colors duration-200">
                    <XCircleIcon className="w-4 h-4 text-red-500 dark:text-red-500 light:text-rose-600" />
                  </div>
                  <div className="flex-1 android-flex-fix">
                    <h4 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-sm md:text-base tracking-[0] leading-5 mb-1.5 mobile-text-stable">
                      {item.title}
                    </h4>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5 mobile-text-stable">
                      {item.description}
                    </p>
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
