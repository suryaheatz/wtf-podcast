import React, { useState, useEffect } from "react";
import { HomeIcon, ActivityIcon, BookOpenIcon, MessageSquareQuoteIcon, ClipboardListIcon, SparklesIcon } from "lucide-react";

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
    icon: <HomeIcon className="w-5 h-5" />,
    sectionId: "hero-section",
  },
  {
    id: "signals",
    label: "Signals",
    icon: <ActivityIcon className="w-5 h-5" />,
    sectionId: "signals-section",
  },
  {
    id: "chapters",
    label: "Chapters",
    icon: <BookOpenIcon className="w-5 h-5" />,
    sectionId: "chapters-section",
  },
  {
    id: "quotes",
    label: "Quotes",
    icon: <MessageSquareQuoteIcon className="w-5 h-5" />,
    sectionId: "quotes-section",
  },
  {
    id: "playbook",
    label: "Playbook",
    icon: <ClipboardListIcon className="w-5 h-5" />,
    sectionId: "playbook-section",
  },
];

interface FloatingNavProps {
  onAIClick: () => void;
}

export const FloatingNav = ({ onAIClick }: FloatingNavProps): JSX.Element => {
  const [activeSection, setActiveSection] = useState<string>("chapters");

  useEffect(() => {
    const handleScroll = () => {
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

  return (
    <nav
      className="fixed z-40 animate-fade-up floating-nav-bar"
      style={{
        left: "24px",
        top: "50%",
        transform: "translateY(-50%)"
      }}
    >
      <div className="flex flex-col items-center gap-3 px-3 py-4 glassmorphism-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.sectionId)}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              activeSection === item.id
                ? "bg-white text-black shadow-lg scale-105"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/10"
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-800/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
              {item.label}
            </span>
          </button>
        ))}

        <div className="h-px w-8 bg-white/10 my-1" />

        <button
          onClick={onAIClick}
          className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5b7fa8]/40 text-[#7fa9e3] hover:bg-[#5b7fa8]/60 hover:text-[#a3c9ff] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(127,169,227,0.4)]"
          aria-label="Ask AI"
        >
          <SparklesIcon className="w-5 h-5" />
          <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-800/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
            Ask KST AI
          </span>
        </button>
      </div>
    </nav>
  );
};
