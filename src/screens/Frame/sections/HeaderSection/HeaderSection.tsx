import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { EpisodesModal } from "../../../../components/EpisodesCalendar";
import { useEpisodes } from "../../../../hooks/usePodcastData";
import { HomeIcon, ActivityIcon, BookOpenIcon, MessageSquareQuoteIcon, ClipboardListIcon, SparklesIcon, MenuIcon, Sun, Moon } from "lucide-react";
import { MobileMenu } from "../../../../components/MobileMenu";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";


interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  sectionId: string;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <HomeIcon className="w-4 h-4 md:w-5 md:h-5" />,
    sectionId: "hero-section",
  },
  {
    id: "signals",
    label: "Signals",
    icon: <ActivityIcon className="w-4 h-4 md:w-5 md:h-5" />,
    sectionId: "signals-section",
  },
  {
    id: "chapters",
    label: "Chapters",
    icon: <BookOpenIcon className="w-4 h-4 md:w-5 md:h-5" />,
    sectionId: "chapters-section",
  },
  {
    id: "quotes",
    label: "Quotes",
    icon: <MessageSquareQuoteIcon className="w-4 h-4 md:w-5 md:h-5" />,
    sectionId: "quotes-section",
  },
  {
    id: "playbook",
    label: "Playbook",
    icon: <ClipboardListIcon className="w-4 h-4 md:w-5 md:h-5" />,
    sectionId: "playbook-section",
  },
];

interface HeaderSectionProps {
  onAIClick?: () => void;
}

export const HeaderSection = ({ onAIClick }: HeaderSectionProps): JSX.Element => {
  const { theme, toggleTheme } = useTheme();
  const { data: dbEpisodes, loading: episodesLoading } = useEpisodes('550e8400-e29b-41d4-a716-446655440000');
  const [isEpisodesOpen, setIsEpisodesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("chapters");
  const [showHeader, setShowHeader] = useState(false);
  const navigate = useNavigate();


  const episodes = React.useMemo(() => {
    return dbEpisodes.map(ep => ({
      id: ep.id,
      episodeNumber: ep.episode_number,
      title: ep.title,
      description: ep.description || '',
      guest: ep.guest_name || 'Unknown Guest',
      duration: ep.duration_minutes > 60
        ? `${Math.floor(ep.duration_minutes / 60)}h ${ep.duration_minutes % 60}m`
        : `${ep.duration_minutes}m`,
      releaseDate: new Date(ep.release_date),
      thumbnail: ep.thumbnail_url || undefined,
    }));
  }, [dbEpisodes]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('[data-hero-section]');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setShowHeader(rect.bottom < 0);
      }

      const sections = navItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.sectionId),
      }));

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const isDark = theme === 'dark';

  const headerBgStyles = isDark
    ? "bg-[#000000cc] border-[#fffefe0d]"
    : "bg-white/95 border-zinc-200";

  const logoTextStyles = isDark
    ? "text-white"
    : "text-black";

  const subtitleStyles = isDark
    ? "text-[#9e9ea9]"
    : "text-zinc-600";

  const dividerStyles = isDark
    ? "bg-[#ffffff0d]"
    : "bg-zinc-200";

  const menuButtonStyles = isDark
    ? "text-white hover:bg-white/10"
    : "text-black hover:bg-black/5";

  const navIconActiveStyles = isDark
    ? "bg-white text-black"
    : "bg-black text-white";

  const navIconInactiveStyles = isDark
    ? "text-gray-400 hover:text-gray-200 hover:bg-white/10"
    : "text-zinc-600 hover:text-black hover:bg-black/5";

  const tooltipStyles = isDark
    ? "bg-zinc-800/90 text-white"
    : "bg-white text-black border border-zinc-200";

  const aiButtonStyles = isDark
    ? "bg-[#5b7fa8]/40 text-[#7fa9e3] hover:bg-[#5b7fa8]/60 hover:text-[#a3c9ff]"
    : "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 hover:text-blue-800";

  const themeButtonStyles = isDark
    ? "bg-zinc-900 border-[#fffefe1a] hover:bg-zinc-800"
    : "bg-white border-zinc-200 hover:bg-zinc-50";

  const themeIconStyles = isDark
    ? "text-[#9e9ea9]"
    : "text-zinc-600";

  const episodeButtonStyles = isDark
    ? "bg-zinc-900 border-[#fffefe1a] hover:bg-zinc-800"
    : "bg-white border-zinc-200 hover:bg-zinc-50";

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex w-full items-center justify-between px-6 md:px-12 lg:px-16 xl:px-20 py-3 backdrop-blur-xl border-b shadow-lg transition-all duration-300 ${headerBgStyles}`}
        style={{ minHeight: '64px' }}
        role="banner"
      >
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`md:hidden flex items-center justify-center w-10 h-10 -ml-2 rounded-xl transition-colors ${menuButtonStyles}`}
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center">
              <span className={`[font-family:'Arial-Black',Helvetica] font-black text-lg md:text-xl tracking-[-1.00px] leading-7 whitespace-nowrap ${logoTextStyles}`}>
                WTF
              </span>
              <span className="[font-family:'Arial-Black',Helvetica] font-black text-[#2b7fff] text-lg md:text-xl tracking-[-1.00px] leading-7 whitespace-nowrap">
                KST
              </span>
            </div>

            <div
              className={`flex items-center overflow-hidden transition-all duration-300 ${
                showHeader ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <span className={`[font-family:'Arial-Regular',Helvetica] font-normal text-xs tracking-[0.60px] leading-4 line-clamp-2 max-w-[180px] sm:max-w-[240px] ${subtitleStyles}`}>
                Now reading: Scaling Consumer Brands in India
              </span>
            </div>
          </div>

          <div className={`w-px h-10 hidden md:block ml-2 ${dividerStyles}`} />

          <div className="flex items-center hidden md:flex">
            <span className={`[font-family:'Arial-Regular',Helvetica] font-normal text-xs tracking-[0.60px] leading-4 whitespace-nowrap ${subtitleStyles}`}>
              KNOWLEDGE SYSTEM TANK
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 md:gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.sectionId)}
              className={`group relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl transition-all duration-300 ${
                activeSection === item.id
                  ? `${navIconActiveStyles} shadow-lg scale-105`
                  : navIconInactiveStyles
              }`}
              aria-label={item.label}
            >
              {item.icon}
              <span className={`absolute -bottom-12 left-1/2 -translate-x-1/2 backdrop-blur-sm text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-[60] ${tooltipStyles}`}>
                {item.label}
              </span>
            </button>
          ))}

          <div className={`w-px h-6 mx-1 ${dividerStyles}`} />

          {onAIClick && (
            <button
              onClick={onAIClick}
              className={`group relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] ${aiButtonStyles}`}
              aria-label="Ask AI"
            >
              <SparklesIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className={`absolute -bottom-12 left-1/2 -translate-x-1/2 backdrop-blur-sm text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-[60] ${tooltipStyles}`}>
                Ask KST AI
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleTheme}
            className={`flex items-center justify-center w-[35.33px] h-[35.33px] p-0 rounded-[10px] border-[0.67px] border-solid transition-colors ${themeButtonStyles}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className={`w-[18px] h-[18px] ${themeIconStyles}`} />
            ) : (
              <Moon className={`w-[18px] h-[18px] ${themeIconStyles}`} />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEpisodesOpen(true)}
            className={`flex items-center gap-2 h-[35.33px] px-2 md:px-3 rounded-[10px] border-[0.67px] border-solid transition-colors ${episodeButtonStyles}`}
          >
            <img className="w-[18px] h-[18px]" alt="Icon" src="/icon-8.svg" />
            <span className={`[font-family:'Arial-Regular',Helvetica] font-normal text-xs text-center tracking-[0] leading-4 whitespace-nowrap hidden sm:inline ${subtitleStyles}`}>
              Episodes
            </span>
          </Button>
        </div>
      </header>

      <EpisodesModal
  isOpen={isEpisodesOpen}
  onClose={() => setIsEpisodesOpen(false)}
  episodes={episodes}
  onEpisodeSelect={(ep) => {
    const urlId = ep.episodeNumber ?? ep.id;
    navigate(`/episode/${urlId}`);
  }}
/>


      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={scrollToSection}
        onAIClick={onAIClick || (() => {})}
        activeSection={activeSection}
      />
    </>
  );
};
