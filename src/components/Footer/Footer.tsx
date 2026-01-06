import React from "react";
import { LinkedinIcon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export const Footer = (): JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgStyles = isDark
    ? "bg-[linear-gradient(135deg,rgba(24,24,27,1)_0%,rgba(0,0,0,1)_100%)] border-[#fffefe0d]"
    : "bg-zinc-50 border-zinc-200";

  const textStyles = isDark
    ? "text-[#9e9ea9]"
    : "text-zinc-600";

  const nameStyles = isDark
    ? "text-white"
    : "text-zinc-900";

  const linkStyles = isDark
    ? "text-[#9e9ea9] hover:text-[#2b7fff]"
    : "text-zinc-600 hover:text-blue-600";

  return (
    <footer className={`w-full border-t py-6 px-4 md:px-6 lg:px-8 mt-12 ${bgStyles}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1400px] mx-auto">
        <p className={`[font-family:'Arial-Regular',Helvetica] font-normal text-sm tracking-[0] leading-5 text-center md:text-left ${textStyles}`}>
          Made with ❤️ By{" "}
          <span className={`font-bold ${nameStyles}`}>Surya Konijeti</span>
        </p>

        <a
          href="https://www.linkedin.com/in/suryakonijeti/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 transition-colors duration-200 group ${linkStyles}`}
          aria-label="Visit Surya Konijeti's LinkedIn profile"
        >
          <LinkedinIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm tracking-[0] leading-5">
            Connect on LinkedIn
          </span>
        </a>
      </div>
    </footer>
  );
};
