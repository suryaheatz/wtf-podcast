import React, { useMemo, useState } from "react";
import { GuestAvatarStack, Guest } from "../../../../components/GuestAvatarStack";
import { AISummaryWidget } from "../../../../components/AISummaryWidget";
import type { EpisodeWithDetails } from "../../../../types/database";
import { getEpisodeNumberDisplay } from "../../../../lib/episode-utils";
import { useTheme } from "../../../../contexts/ThemeContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEpisodeNavigation } from "../../../../hooks/useEpisodeNavigation";
import { useNavigate } from "react-router-dom";

const guestPalette = [
  "bg-amber-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-zinc-500",
];

const getInitials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
};

const splitSummaryPoints = (content: string) => {
  return content
    .split(/\n+/g)
    .map((line) => line.replace(/^[\s•\u2022\u2023\u25E6\u2043\u2219\-]+/, "").trim())
    .filter(Boolean);
};

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
  const navigate = useNavigate();
  const { prevId, nextId } = useEpisodeNavigation(episode?.id ?? null);

  const guests = useMemo<Guest[]>(() => {
    const result: Guest[] = [];
    const seen = new Set<string>();

    const normalizeName = (value: string) =>
      value.toLowerCase().replace(/[^a-z\s]/g, "").trim();

    const addGuest = (name: string, title: string, colorIndex: number) => {
      const key = name.trim().toLowerCase();
      if (!key || seen.has(key)) return;
      seen.add(key);
      result.push({
        initials: getInitials(name),
        name,
        title,
        bgColor: guestPalette[colorIndex % guestPalette.length],
      });
    };

    const guestBioMap = new Map<string, string>();
    (episode?.guests ?? []).forEach((guest) => {
      if (guest.bio) {
        guestBioMap.set(normalizeName(guest.name), guest.bio);
      }
    });

    const uploaderHosts = episode?.guest_name
      ? episode.guest_name
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
      : [];

    const hostNames = uploaderHosts;
    hostNames.forEach((name, index) => {
      const isHost = normalizeName(name).includes("nikhil kamath");
      const bio = guestBioMap.get(normalizeName(name));
      addGuest(name, bio ?? (isHost ? "Host" : "Guest"), index);
    });

    (episode?.guests ?? []).forEach((guest, index) => {
      const isHost = normalizeName(guest.name).includes("nikhil kamath");
      addGuest(
        guest.name,
        guest.bio || (isHost ? "Host" : "Guest"),
        index + hostNames.length
      );
    });

    const insightSpeakers = (episode?.insights ?? [])
      .map((item) => item.speaker)
      .filter((speaker): speaker is string => Boolean(speaker));

    insightSpeakers.forEach((speaker, index) => {
      const isHost = normalizeName(speaker).includes("nikhil kamath");
      const bio = guestBioMap.get(normalizeName(speaker));
      addGuest(
        speaker,
        bio ?? (isHost ? "Host" : "Guest"),
        index + hostNames.length + (episode?.guests?.length ?? 0)
      );
    });

    return result;
  }, [episode]);

  const summaryPoints = useMemo(() => {
    const summaries = (episode?.insights ?? [])
      .filter((item) => item.type === "tldr_summary" && item.content)
      .flatMap((item) => splitSummaryPoints(item.content ?? ""));

    if (summaries.length > 0) {
      return summaries.slice(0, 6);
    }

    if (episode?.framing) {
      return splitSummaryPoints(episode.framing).slice(0, 3);
    }

    return [];
  }, [episode]);

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
  const navButtonBase = isDark
    ? "w-10 h-10 rounded-xl text-white/90 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
    : "w-10 h-10 rounded-xl text-blue-700 hover:text-blue-900 transition disabled:opacity-40 disabled:cursor-not-allowed";

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
            <div className="flex flex-row flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center bg-blue-600 text-white font-mono text-xs font-bold border border-blue-400/30 tracking-wider rounded-2xl px-2 py-1">
                <button
                  type="button"
                  className={navButtonBase}
                  onClick={() => prevId && navigate(`/episode/${prevId}`)}
                  disabled={!prevId}
                  aria-label="Previous episode"
                >
                  <ChevronLeft className="mx-auto" size={18} />
                </button>

                <div className="px-3 py-2">
                  {episodeDisplay}
                </div>

                <button
                  type="button"
                  className={navButtonBase}
                  onClick={() => nextId && navigate(`/episode/${nextId}`)}
                  disabled={!nextId}
                  aria-label="Next episode"
                >
                  <ChevronRight className="mx-auto" size={18} />
                </button>
              </div>

              {summaryPoints.length > 0 && (
                <AISummaryWidget
                  summaryPoints={summaryPoints}
                  episodeTitle={episode?.title}
                />
              )}
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
            {guests.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                <GuestAvatarStack guests={guests} maxVisibleMobile={2} />
              </div>
            )}
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
