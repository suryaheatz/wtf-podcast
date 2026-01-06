import React, { useState } from "react";
import { GuestAvatarStack, Guest } from "../../../../components/GuestAvatarStack";
import { AISummaryWidget } from "../../../../components/AISummaryWidget";
import type { EpisodeWithDetails } from "../../../../types/database";
import { getEpisodeNumberDisplay } from "../../../../lib/episode-utils";
import { useTheme } from "../../../../contexts/ThemeContext";

const experts: Guest[] = [
  {
    initials: "KB",
    name: "Kishore Biyani",
    title: "The OG of Retail",
    bgColor: "bg-amber-500",
  },
  {
    initials: "AN",
    name: "Ananth Narayanan",
    title: "Scale Operator",
    bgColor: "bg-blue-500",
  },
  {
    initials: "RS",
    name: "Raj Shamani",
    title: "Content Capitalist",
    bgColor: "bg-emerald-500",
  },
  {
    initials: "NK",
    name: "Nikhil Kamath",
    title: "Investigator",
    bgColor: "bg-zinc-500",
  },
];

const summaryPoints = [
  "The 'India 1' Thesis: Only ~30M households (120M people) drive 60-70% of all value-added consumption.",
  "The 0-20-100 Rule: 0-20Cr is built on Product & Community. 20-100Cr is Performance Marketing. 100Cr+ requires Offline.",
  "Content Strategy: Use the 'ECG' format (Evergreen, Controversial, Growth) to build attention without ad spend.",
];

interface HeroSectionProps {
  episode?: EpisodeWithDetails | null;
  loading?: boolean;
}

const HeroSkeleton = (): JSX.Element => {
  return (
    <section
      id="hero-section"
      className="w-[100vw] relative left-[50%] -ml-[50vw] -mr-[50vw] min-h-[60vh] overflow-hidden bg-black"
      data-hero-section
    >
      <div className="absolute inset-0 z-0 bg-zinc-900 animate-pulse" />

      <div className="mx-auto max-w-[1600px] relative z-10 px-6 md:px-12 lg:px-16 xl:px-20 h-full flex flex-col justify-center py-8 md:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col max-w-full lg:max-w-[821px]">
            <div className="flex flex-row items-center gap-4 mb-6">
              <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse" />
              <div className="h-8 w-32 bg-zinc-800 rounded-full animate-pulse" />
            </div>

            <div className="space-y-3 mb-6">
              <div className="h-12 bg-zinc-800 rounded animate-pulse w-full" />
              <div className="h-12 bg-zinc-800 rounded animate-pulse w-5/6" />
            </div>

            <div className="space-y-2 mb-6">
              <div className="h-6 bg-zinc-800 rounded animate-pulse w-full" />
              <div className="h-6 bg-zinc-800 rounded animate-pulse w-4/5" />
            </div>

            <div className="flex gap-3">
              <div className="h-12 w-48 bg-zinc-800 rounded-full animate-pulse" />
              <div className="h-12 w-48 bg-zinc-800 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const HeroSection = ({ episode, loading }: HeroSectionProps): JSX.Element => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { theme } = useTheme();

  if (loading) {
    return <HeroSkeleton />;
  }

  const thumbnailUrl = episode?.youtube_video_id && !imageError
    ? `https://img.youtube.com/vi/${episode.youtube_video_id}/maxresdefault.jpg`
    : null;

  const episodeDisplay = getEpisodeNumberDisplay(episode?.episode_number, episode?.title);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const isDark = theme === 'dark';

  return (
    <section
      id="hero-section"
      className={`w-[100vw] relative left-[50%] -ml-[50vw] -mr-[50vw] min-h-[60vh] overflow-hidden ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
      data-hero-section
      role="banner"
      aria-label="Episode hero section"
    >
      {/* BACKGROUND LAYER - Full viewport width */}
      <div className="absolute inset-0 z-0">
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded
                  ? isDark ? 'opacity-60' : 'opacity-40'
                  : 'opacity-0'
              }`}
              alt={`${episode?.title || 'Episode'} thumbnail`}
              loading="eager"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {isDark ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/20 to-white/50" />
              </>
            )}
          </>
        ) : (
          <div className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-br from-zinc-900 via-black to-zinc-900'
              : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
          }`} />
        )}

        {/* Decorative blue glow - top right */}
        <div className={`absolute -top-40 right-0 w-[300px] md:w-[400px] lg:w-[600px] h-[300px] md:h-[400px] lg:h-[600px] rounded-full blur-3xl ${
          isDark
            ? '[background:radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.2)_0%,rgba(0,0,0,0)_70%)] opacity-30'
            : '[background:radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.15)_0%,rgba(255,255,255,0)_70%)] opacity-40'
        }`} />
      </div>

      {/* CONTENT CONTAINER - Constrained to maintain alignment */}
      <div className="mx-auto max-w-[1600px] relative z-10 px-6 md:px-12 lg:px-16 xl:px-20 h-full flex flex-col justify-center py-8 md:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col max-w-full lg:max-w-[821px]">
            {/* METADATA ROW */}
            <div className="flex flex-row items-center gap-4 mb-6">
              <div className="bg-blue-600 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-sm border border-blue-400/30 tracking-wider">
                {episodeDisplay}
              </div>

              <AISummaryWidget
                summaryPoints={summaryPoints}
                episodeTitle={episode?.title}
              />
            </div>

            {/* HEADLINE */}
            <h1 className={`hero-title text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 max-w-4xl tracking-[-1.50px] [font-family:'Arial-Black',Helvetica] cursor-default transition-all duration-300 ${
              isDark
                ? 'text-white drop-shadow-2xl'
                : 'text-zinc-900'
            }`}>
              {episode?.title || 'Scaling Consumer Brands in India'}
            </h1>

            {/* DESCRIPTION */}
            <p className={`max-w-full md:max-w-[672px] text-base md:text-lg leading-relaxed md:leading-[29.2px] [font-family:'Times_New_Roman-Regular',Helvetica] mb-6 ${
              isDark
                ? 'text-zinc-100 drop-shadow-lg'
                : 'text-zinc-700'
            }`}>
              {episode?.description || 'A definitive masterclass on Indian consumption. Kishore Biyani breaks down the \'India 1\' demographic, Ananth Narayanan reveals the unit economics of scaling, and Raj Shamani decodes the science of attention.'}
            </p>

            {/* GUESTS ROW */}
            <div className="flex flex-wrap gap-4 mt-4">
              <GuestAvatarStack guests={experts} maxVisibleMobile={2} />
            </div>
          </div>

          {/* DECORATIVE GLOW (Desktop only) */}
          <div className="hidden lg:block relative w-full lg:w-[400px]" aria-hidden="true">
            <div className="absolute -top-40 left-11 w-[300px] md:w-[400px] lg:w-[543px] h-[300px] md:h-[400px] lg:h-[543px] rounded-full rotate-45 blur-3xl [background:radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_70%)] opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
};
