import { ClockIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";

export const FounderDirectivesSection = (): JSX.Element => {
  return (
    <section id="quotes-section" className="flex flex-col items-start gap-6 md:gap-10 pt-12 md:pt-16 pb-0 w-full">
      <header className="pt-0 pb-4 md:pb-5 px-0 flex flex-col md:flex-row items-start md:items-end justify-between w-full border-b-[0.67px] border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 gap-2">
        <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8">
          Voice of Authority
        </h2>

        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5">
          Key moments that defined the conversation
        </p>
      </header>

      <Card className="w-full rounded-2xl md:rounded-3xl overflow-hidden border-[0.67px] border-[#fffefe0d] dark:border-[#fffefe0d] light:border-2 light:border-gray-300 bg-[linear-gradient(135deg,rgba(24,24,27,1)_0%,rgba(0,0,0,1)_100%)] dark:bg-[linear-gradient(135deg,rgba(24,24,27,1)_0%,rgba(0,0,0,1)_100%)] light:bg-white">
        <CardContent className="relative p-0 min-h-[350px] md:min-h-[445.33px]">
          <div className="absolute top-4 md:top-[17px] right-4 md:right-[65px]">
            <Badge
              variant="secondary"
              className="bg-[#ffffff1a] text-[#9e9ea9] hover:bg-[#ffffff1a] px-2 py-1 text-xs [font-family:'Arial-Regular',Helvetica] font-normal"
            >
              Auto-Play
            </Badge>
          </div>

          <div className="absolute top-12 md:top-[65px] left-1/2 -translate-x-1/2 w-full max-w-[768px] flex flex-col gap-5 md:gap-8 items-center px-4 md:px-8">
            <img className="w-10 h-10 md:w-12 md:h-12" alt="Quote icon" src="/icon.svg" />

            <blockquote className="w-full [font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-white dark:text-white light:text-gray-900 text-xl md:text-2xl lg:text-3xl text-center tracking-[0] leading-tight md:leading-[48.8px]">
              "It's easy to start in India, very hard to scale in India."
            </blockquote>

            <div className="flex flex-col items-center gap-2 md:gap-3 w-full">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-1">
                <span className="[font-family:'Arial-Bold',Helvetica] font-bold text-white dark:text-white light:text-gray-900 text-xs md:text-sm tracking-[0.70px] leading-5">
                  ANANTH NARAYANAN
                </span>

                <Badge
                  variant="secondary"
                  className="bg-[#ffffff1a] dark:bg-[#ffffff1a] light:bg-gray-100 text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 hover:bg-[#ffffff1a] dark:hover:bg-[#ffffff1a] light:hover:bg-gray-200 rounded-full px-3 py-1 flex items-center gap-1"
                >
                  <ClockIcon className="w-2.5 h-2.5" />
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[11px] tracking-[0] leading-[16.5px]">
                    00:11:06
                  </span>
                </Badge>
              </div>

              <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm text-center tracking-[0] leading-[22.8px]">
                Low entry barriers create noise; operational complexity kills
                scale.
              </p>
            </div>
          </div>

          <img
            className="absolute bottom-8 md:bottom-[64px] left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-[1343px] h-8 md:h-11"
            alt="Audio waveform visualization"
            src="/container-1.svg"
          />
        </CardContent>
      </Card>
    </section>
  );
};
