import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

export const StickyHeroElements = (): JSX.Element => {
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('[data-hero-section]');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setShowElements(rect.top < 64);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-[45] transition-all duration-300 ${
        showElements ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      aria-hidden={!showElements}
    >
      <div className="w-full bg-black/95 backdrop-blur-xl border-b border-[#fffefe0d] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <div className="px-6 md:px-12 lg:px-16 xl:px-20 py-3 max-w-[1600px] mx-auto">
          <Badge className="w-fit flex items-center gap-2 bg-[#2b7fff1a] text-[#2b7fff] border-[#2b7fff33] rounded-full px-3 py-1.5 hover:bg-[#2b7fff1a]">
            <img className="w-3 h-3" alt="Icon" src="/icon-13.svg" />
            <span className="text-xs font-bold tracking-[0.60px] [font-family:'Arial-Bold',Helvetica]">
              KNOWLEDGE SYSTEM
            </span>
          </Badge>

          <h1 className="mt-3 text-xl md:text-2xl lg:text-3xl font-black tracking-[-1.50px] leading-tight [font-family:'Arial-Black',Helvetica] pb-2 gradient-text cursor-default">
            Scaling Consumer Brands in India
          </h1>
        </div>
      </div>
    </div>
  );
};
