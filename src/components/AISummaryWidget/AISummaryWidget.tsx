import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';

interface AISummaryWidgetProps {
  summaryPoints: string[];
  episodeTitle?: string;
}

export const AISummaryWidget: React.FC<AISummaryWidgetProps> = ({ summaryPoints, episodeTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedPoints, setDisplayedPoints] = useState<string[]>([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen && currentPointIndex < summaryPoints.length) {
      setIsTyping(true);
      const fullText = summaryPoints[currentPointIndex];
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setCurrentText(fullText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setDisplayedPoints(prev => [...prev, fullText]);
          setCurrentText('');
          setTimeout(() => {
            setCurrentPointIndex(prev => prev + 1);
          }, 300);
        }
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [isOpen, currentPointIndex, summaryPoints]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setDisplayedPoints([]);
    setCurrentPointIndex(0);
    setCurrentText('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setDisplayedPoints([]);
    setCurrentPointIndex(0);
    setCurrentText('');
    setIsTyping(false);
  };

  const isDark = theme === 'dark';

  const triggerStyles = isDark
    ? "ai-insight-button-dark"
    : "ai-insight-button-light";

  const backdropStyles = isDark
    ? "bg-black/60"
    : "bg-black/40";

  const panelBgStyles = isDark
    ? "bg-black/95 border-white/10"
    : "bg-white border-zinc-200 shadow-2xl";

  const headerBorderStyles = isDark
    ? "border-white/10"
    : "border-zinc-200";

  const titleStyles = isDark
    ? "text-white"
    : "text-zinc-900";

  const subtitleStyles = isDark
    ? "text-zinc-400"
    : "text-zinc-600";

  const bulletStyles = isDark
    ? "text-yellow-400"
    : "text-blue-600";

  const textStyles = isDark
    ? "text-zinc-200"
    : "text-zinc-800";

  const closeButtonStyles = isDark
    ? "hover:bg-white/10 text-white/60 hover:text-white"
    : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900";

  const cursorStyles = isDark
    ? "bg-yellow-400"
    : "bg-blue-600";

  return (
    <>
      <Button
        onClick={handleOpen}
        className={`${triggerStyles} group flex items-center gap-2 px-4 py-2 h-auto backdrop-blur-md border rounded-full transition-all duration-300`}
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-bold tracking-wide font-mono">
          AI INSIGHT
        </span>
      </Button>

      {isOpen && (
        <>
          <div
            className={`fixed inset-0 ${backdropStyles} backdrop-blur-sm z-50 transition-opacity duration-300`}
            onClick={handleClose}
          />

          <div className="hidden md:block fixed top-1/2 right-8 -translate-y-1/2 w-[420px] max-h-[80vh] z-50 animate-slide-in-right">
            <div className={`${panelBgStyles} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
              <div className={`flex items-center justify-between p-6 border-b ${headerBorderStyles}`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${bulletStyles}`} />
                  <h3 className={`text-lg font-bold ${titleStyles}`}>AI Executive Summary</h3>
                </div>
                <button
                  onClick={handleClose}
                  className={`p-1.5 rounded-lg transition-colors ${closeButtonStyles}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-100px)]">
                {episodeTitle && (
                  <p className={`text-sm ${subtitleStyles} mb-6`}>
                    Key insights from: <span className={`${titleStyles} font-semibold`}>{episodeTitle}</span>
                  </p>
                )}

                {displayedPoints.map((point, index) => (
                  <div key={index} className="flex gap-3 animate-fade-in">
                    <span className={`${bulletStyles} text-base mt-1 flex-shrink-0`}>✦</span>
                    <p className={`text-sm ${textStyles} leading-relaxed`}>{point}</p>
                  </div>
                ))}

                {currentText && (
                  <div className="flex gap-3">
                    <span className={`${bulletStyles} text-base mt-1 flex-shrink-0`}>✦</span>
                    <p className={`text-sm ${textStyles} leading-relaxed`}>
                      {currentText}
                      {isTyping && showCursor && <span className={`inline-block w-2 h-4 ${cursorStyles} ml-1 animate-pulse`} />}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className={`${panelBgStyles} backdrop-blur-xl border-t rounded-t-3xl max-h-[80vh] overflow-hidden`}>
              <div className={`flex items-center justify-between p-6 border-b ${headerBorderStyles}`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${bulletStyles}`} />
                  <h3 className={`text-lg font-bold ${titleStyles}`}>AI Summary</h3>
                </div>
                <button
                  onClick={handleClose}
                  className={`p-1.5 rounded-lg transition-colors ${closeButtonStyles}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-100px)]">
                {episodeTitle && (
                  <p className={`text-sm ${subtitleStyles} mb-6`}>
                    Key insights from: <span className={`${titleStyles} font-semibold`}>{episodeTitle}</span>
                  </p>
                )}

                {displayedPoints.map((point, index) => (
                  <div key={index} className="flex gap-3 animate-fade-in">
                    <span className={`${bulletStyles} text-base mt-1 flex-shrink-0`}>✦</span>
                    <p className={`text-sm ${textStyles} leading-relaxed`}>{point}</p>
                  </div>
                ))}

                {currentText && (
                  <div className="flex gap-3">
                    <span className={`${bulletStyles} text-base mt-1 flex-shrink-0`}>✦</span>
                    <p className={`text-sm ${textStyles} leading-relaxed`}>
                      {currentText}
                      {isTyping && showCursor && <span className={`inline-block w-2 h-4 ${cursorStyles} ml-1 animate-pulse`} />}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
