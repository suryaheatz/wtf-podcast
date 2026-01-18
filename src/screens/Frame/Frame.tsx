import React, { useState } from "react";
import { CallToActionSection } from "./sections/CallToActionSection";
import { DosAndDontsSection } from "./sections/DosAndDontsSection";
import { HeaderSection } from "./sections/HeaderSection";
import { HeroSection } from "./sections/HeroSection";
import { KnowledgeChaptersSection } from "./sections/KnowledgeChaptersSection";
import { MarketSignalsSection } from "./sections/MarketSignalsSection";
import { PlaybookSection } from "./sections/PlaybookSection";
import { VoiceOfAuthoritySection } from "./sections/VoiceOfAuthoritySection";
import { AIChat } from "../../components/AIChat";
import { Footer } from "../../components/Footer";
import { PictureInPicturePlayer } from "../../components/PictureInPicturePlayer";
import { SectionDivider } from "../../components/ui/section-divider";
import { useEpisodeWithDetails } from "../../hooks/usePodcastData";
import { currentEpisodeId } from "../../data/episodes";

const timeToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(":");
  if (parts.length === 2) {
    const [min, sec] = parts.map(Number);
    return min * 60 + sec;
  } else if (parts.length === 3) {
    const [hr, min, sec] = parts.map(Number);
    return hr * 3600 + min * 60 + sec;
  }
  return 0;
};

export const Frame = (): JSX.Element => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPIPOpen, setIsPIPOpen] = useState(false);
  const [pipStartTime, setPipStartTime] = useState(0);

  const { data: episode, loading, error } = useEpisodeWithDetails(currentEpisodeId);

  const handleTimestampClick = (timestamp: string) => {
    const seconds = timeToSeconds(timestamp);
    setPipStartTime(seconds);
    setIsPIPOpen(true);
  };

  const youtubeVideoId = episode?.youtube_video_id || "hjiZ11lKCrU";

  return (
    <div className="w-full flex flex-col bg-black dark:bg-black light:bg-white min-h-screen">
      <HeaderSection onAIClick={() => setIsAIChatOpen(true)} />

      <HeroSection episode={episode} loading={loading} />

      <main className="flex flex-col w-full items-center px-6 md:px-12 lg:px-16 xl:px-20 pb-16 md:pb-20 max-w-[1600px] mx-auto overflow-x-hidden -mt-4 md:-mt-6">
        <div className="w-full py-4 md:py-6">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fffefe0d] to-transparent dark:via-[#fffefe0d] light:via-gray-200" />
        </div>
        <CallToActionSection />
        <SectionDivider />
        <MarketSignalsSection />
        <SectionDivider />
        <KnowledgeChaptersSection onTimestampClick={handleTimestampClick} />
        <SectionDivider />
        <VoiceOfAuthoritySection
          onTimestampClick={handleTimestampClick}
          episodeId={episode?.id ?? currentEpisodeId}
        />
        <SectionDivider />
        <DosAndDontsSection />
        <SectionDivider />
        <PlaybookSection
          onTimestampClick={handleTimestampClick}
          episodeId={episode?.id ?? currentEpisodeId}
          youtubeVideoId={youtubeVideoId}
        />
      </main>
      <Footer />
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      <PictureInPicturePlayer
        isOpen={isPIPOpen}
        onClose={() => setIsPIPOpen(false)}
        videoId={youtubeVideoId}
        startTime={pipStartTime}
      />
    </div>
  );
};
