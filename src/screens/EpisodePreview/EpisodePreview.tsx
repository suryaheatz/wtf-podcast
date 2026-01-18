import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CallToActionSection } from "../Frame/sections/CallToActionSection";
import { DosAndDontsSection } from "../Frame/sections/DosAndDontsSection";
import { HeaderSection } from "../Frame/sections/HeaderSection";
import { HeroSection } from "../Frame/sections/HeroSection";
import { KnowledgeChaptersSection } from "../Frame/sections/KnowledgeChaptersSection";
import { MarketSignalsSection } from "../Frame/sections/MarketSignalsSection";
import { PlaybookSection } from "../Frame/sections/PlaybookSection";
import { VoiceOfAuthoritySection } from "../Frame/sections/VoiceOfAuthoritySection";
import { AIChat } from "../../components/AIChat";
import { Footer } from "../../components/Footer";
import { PictureInPicturePlayer } from "../../components/PictureInPicturePlayer";
import { SectionDivider } from "../../components/ui/section-divider";
import { useEpisodeWithDetails } from "../../hooks/usePodcastData";
import { Button } from "../../components/ui/button";
import EpisodeNavArrows from "../../components/ui/EpisodeNavArrows";


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

const EpisodePreview = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPIPOpen, setIsPIPOpen] = useState(false);
  const [pipStartTime, setPipStartTime] = useState(0);

  const { data: episode, loading, error } = useEpisodeWithDetails(id || null);

  const handleTimestampClick = (timestamp: string) => {
    const seconds = timeToSeconds(timestamp);
    setPipStartTime(seconds);
    setIsPIPOpen(true);
  };

  const youtubeVideoId = episode?.youtube_video_id || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-300 text-lg">Loading episode preview...</p>
        </div>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-3xl font-bold text-white mb-4">Episode Not Found</h1>
          <p className="text-slate-400 mb-8">
            The episode you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/admin">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Admin
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-black dark:bg-black light:bg-white min-h-screen">
       <EpisodeNavArrows />
      <div className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                ← Back to Admin
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-600"></div>
            <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-semibold">
              DRAFT PREVIEW
            </span>
          </div>
          <Button onClick={() => setIsAIChatOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            Ask AI
          </Button>
        </div>
      </div>

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
          episodeId={episode?.id}
        />
        <SectionDivider />
        <DosAndDontsSection />
        <SectionDivider />
        <PlaybookSection
          onTimestampClick={handleTimestampClick}
          episodeId={episode?.id}
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

export default EpisodePreview;
