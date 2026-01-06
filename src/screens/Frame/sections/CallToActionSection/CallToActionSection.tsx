import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const marketSignalsData = [
  {
    label: "INDIA 1 SIZE",
    value: "120 Million",
    subtitle: "People",
    description:
      "The consuming class (Singapore/Poland/Mexico) driving 85% of premium consumption.",
    hasIcon: true,
  },
  {
    label: "VALUATION MULT.",
    value: "5x / 6x",
    subtitle: "Revenue",
    description:
      "Fashion brands trade at ~5x Revenue. Beauty brands at ~6x Revenue.",
    hasIcon: false,
  },
  {
    label: "PRIVATE MIX",
    value: "7% → 30%",
    subtitle: "Profit Lever",
    description:
      "Increasing private label mix is the only path to sustainable EBITDA.",
    hasIcon: true,
  },
  {
    label: "LOGISTICS REACH",
    value: "₹140",
    subtitle: "per shipment",
    description:
      "Cost to reach 26,000 PIN codes. Distribution is no longer a moat.",
    hasIcon: false,
  },
  {
    label: "MYNTRA SCALE",
    value: "11%",
    subtitle: "Penetration",
    description: "Online fashion penetration grew from 2% to 11% in a decade.",
    hasIcon: true,
  },
  {
    label: "GROSS MARGINS",
    value: "60-70%",
    subtitle: "Required",
    description:
      "Minimum margin needed in Fashion/Beauty to survive CAC and scale.",
    hasIcon: false,
  },
];

export const CallToActionSection = (): JSX.Element => {
  return (
    <section className="flex flex-col gap-6 md:gap-10 pt-12 md:pt-16 pb-0 w-full">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between pb-4 md:pb-5 border-b-[0.67px] border-[#fffefe0d] dark:border-[#fffefe0d] light:border-gray-200 gap-2">
        <h2 className="text-white dark:text-white light:text-gray-900 text-xl md:text-2xl tracking-[-0.60px] leading-8 [font-family:'Arial-Bold',Helvetica] font-bold">
          Market Signals
        </h2>
        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs md:text-sm tracking-[0] leading-5">
          Key data points driving the Indian consumption story
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
        {marketSignalsData.map((signal, index) => (
          <Card
            key={index}
            className="bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded-[14px] border-[0.67px] border-transparent dark:border-transparent light:border-gray-200 overflow-hidden"
          >
            <CardContent className="p-5 md:p-6 flex flex-col gap-3 md:gap-4">
              <div className="flex items-center justify-between">
                <span className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#2b7fff] dark:text-[#2b7fff] light:text-blue-700 text-xs tracking-[0.60px] leading-4">
                  {signal.label}
                </span>
                {signal.hasIcon && (
                  <img className="w-3.5 h-3.5" alt="Icon" src="/icon-4.svg" />
                )}
              </div>

              <div className="[font-family:'Arial-Black',Helvetica] font-black text-white dark:text-white light:text-gray-900 text-2xl md:text-3xl tracking-[-0.75px] leading-9">
                {signal.value}
              </div>

              <div className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#9e9ea9] dark:text-[#9e9ea9] light:text-gray-600 text-xs tracking-[0] leading-4">
                {signal.subtitle}
              </div>

              <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#70707b] dark:text-[#70707b] light:text-gray-600 text-xs tracking-[0] leading-[19.5px]">
                {signal.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
