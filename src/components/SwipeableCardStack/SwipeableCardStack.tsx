import React, { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface SwipeableCardStackProps {
  children: React.ReactNode[];
  onCardChange?: (index: number) => void;
  autoPlayInterval?: number;
  showArrows?: boolean;
}

export const SwipeableCardStack = ({
  children,
  onCardChange,
  autoPlayInterval = 0,
  showArrows = true
}: SwipeableCardStackProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlayInterval > 0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalCards = React.Children.count(children);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (onCardChange) {
      onCardChange(currentIndex);
    }
  }, [currentIndex, onCardChange]);

  useEffect(() => {
    if (isAutoPlaying && autoPlayInterval > 0) {
      autoPlayTimerRef.current = setInterval(() => {
        nextCard();
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, autoPlayInterval, currentIndex]);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    setDragOffset(0);
    setIsAutoPlaying(false);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - startXRef.current;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;

    if (dragOffset > threshold) {
      prevCard();
    } else if (dragOffset < -threshold) {
      nextCard();
    }

    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevCard();
    } else if (e.key === "ArrowRight") {
      nextCard();
    }
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const position = (index - currentIndex + totalCards) % totalCards;

    if (position === 0) {
      return {
        transform: `translateX(${dragOffset}px) scale(1) translateZ(0)`,
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto",
        transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
      };
    } else if (position === 1) {
      return {
        transform: `translateX(${Math.min(dragOffset * 0.3, 0)}px) scale(0.95) translateZ(0)`,
        opacity: 0.7,
        zIndex: 20,
        pointerEvents: "none",
        transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
      };
    } else if (position === 2) {
      return {
        transform: `translateX(${Math.min(dragOffset * 0.15, 0)}px) scale(0.9) translateZ(0)`,
        opacity: 0.4,
        zIndex: 10,
        pointerEvents: "none",
        transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
      };
    } else {
      return {
        transform: "translateX(0) scale(0.85) translateZ(0)",
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
        transition: "transform 0.3s ease, opacity 0.3s ease",
      };
    }
  };

  return (
    <div className="w-full relative">
      <div
        ref={containerRef}
        className="relative w-full touch-pan-y select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Swipeable card stack"
        aria-live="polite"
      >
        <div className="relative w-full" style={{ minHeight: "400px" }}>
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full cursor-grab active:cursor-grabbing"
              style={getCardStyle(index)}
              aria-hidden={index !== currentIndex}
            >
              {child}
            </div>
          ))}
        </div>

        {showArrows && totalCards > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevCard();
              }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 hover:border-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Previous card"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextCard();
              }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 hover:border-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Next card"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {totalCards > 1 && (
        <>
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalCards }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 h-2 bg-[#2b7fff]"
                    : "w-2 h-2 bg-[#ffffff33] hover:bg-[#ffffff66]"
                } rounded-full`}
                aria-label={`Go to card ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>

          {autoPlayInterval > 0 && (
            <div className="flex justify-center items-center gap-3 mt-2">
              <span className="text-sm text-[#9e9ea9] [font-family:'Arial-Regular',Helvetica]">
                Auto-Play
              </span>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAutoPlaying ? "bg-[#2b7fff]" : "bg-[#ffffff1a]"
                }`}
                aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
                role="switch"
                aria-checked={isAutoPlaying}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAutoPlaying ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}
        </>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Card {currentIndex + 1} of {totalCards}
      </div>
    </div>
  );
};
