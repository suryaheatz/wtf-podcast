import React, { useEffect } from "react";
import { HomeIcon, ActivityIcon, MessageSquareQuoteIcon, ClipboardListIcon, SparklesIcon, XIcon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onAIClick: () => void;
  activeSection: string;
}

const menuItems = [
  { id: "home", label: "Home", icon: HomeIcon, sectionId: "hero-section" },
  { id: "signals", label: "Market Signals", icon: ActivityIcon, sectionId: "signals-section" },
  { id: "quotes", label: "Voice of Authority", icon: MessageSquareQuoteIcon, sectionId: "quotes-section" },
  { id: "playbook", label: "Founder Playbook", icon: ClipboardListIcon, sectionId: "playbook-section" },
];

export const MobileMenu = ({ isOpen, onClose, onNavigate, onAIClick, activeSection }: MobileMenuProps): JSX.Element => {
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleMenuItemClick = (sectionId: string) => {
    onNavigate(sectionId);
    onClose();
  };

  const handleAIClick = () => {
    onAIClick();
    onClose();
  };

  const isDark = theme === 'dark';

  const backdropStyles = isDark
    ? "bg-black/70"
    : "bg-black/40";

  const panelBgStyles = isDark
    ? "bg-[#1a1a1a]"
    : "bg-white";

  const borderStyles = isDark
    ? "border-white/10"
    : "border-zinc-200";

  const titleStyles = isDark
    ? "text-white"
    : "text-zinc-900";

  const closeButtonStyles = isDark
    ? "text-gray-400 hover:text-white"
    : "text-zinc-600 hover:text-black";

  const menuItemActiveStyles = isDark
    ? "bg-white/10 text-white"
    : "bg-black/5 text-black";

  const menuItemInactiveStyles = isDark
    ? "text-gray-300 hover:bg-white/5 active:bg-white/10"
    : "text-zinc-700 hover:bg-black/5 active:bg-black/10";

  const activeDotStyles = "bg-[#2b7fff]";

  const aiMenuItemStyles = isDark
    ? "text-[#7fa9e3] hover:bg-[#5b7fa8]/20 active:bg-[#5b7fa8]/30"
    : "text-blue-700 hover:bg-blue-500/10 active:bg-blue-500/20";

  const gradientStyles = isDark
    ? "from-[#1a1a1a]"
    : "from-white";

  return (
    <>
      <div
        className={`fixed inset-0 backdrop-blur-sm z-[100] transition-opacity duration-300 ${backdropStyles} ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${panelBgStyles} ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${borderStyles}`}>
          <h3 className={`font-semibold text-lg ${titleStyles}`}>Navigation</h3>
          <button
            onClick={onClose}
            className={`transition-colors p-2 -mr-2 ${closeButtonStyles}`}
            aria-label="Close menu"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          <nav className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.sectionId)}
                  className={`mobile-menu-item w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                    isActive
                      ? menuItemActiveStyles
                      : menuItemInactiveStyles
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-base font-medium">{item.label}</span>
                  {isActive && (
                    <div className={`ml-auto w-2 h-2 rounded-full ${activeDotStyles}`} />
                  )}
                </button>
              );
            })}

            <div className={`h-px my-2 mx-6 ${borderStyles}`} />

            <button
              onClick={handleAIClick}
              className={`mobile-menu-item w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 ${aiMenuItemStyles}`}
            >
              <SparklesIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-base font-medium">Ask KST AI</span>
            </button>
          </nav>
        </div>

        <div className={`h-8 bg-gradient-to-t to-transparent pointer-events-none ${gradientStyles}`} />
      </div>
    </>
  );
};
