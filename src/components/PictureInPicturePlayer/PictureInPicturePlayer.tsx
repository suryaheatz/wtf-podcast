import React, { useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2, Volume2, VolumeX, Play, Pause } from "lucide-react";

interface PictureInPicturePlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  startTime?: number;
}

export const PictureInPicturePlayer = ({
  isOpen,
  onClose,
  videoId,
  startTime = 0
}: PictureInPicturePlayerProps): JSX.Element | null => {
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 280 });
  const [size, setSize] = useState({ width: 400, height: 250 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - size.height));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, size]);

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - size.width),
        y: Math.min(prev.y, window.innerHeight - size.height)
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, iframe")) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const togglePlay = () => {
    if (iframeRef.current) {
      const command = isPlaying ? "pauseVideo" : "playVideo";
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: command }),
        "*"
      );
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current) {
      const command = isMuted ? "unMute" : "mute";
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: command }),
        "*"
      );
      setIsMuted(!isMuted);
    }
  };

  if (!isOpen) return null;

  const youtubeUrl = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(startTime)}&autoplay=1&enablejsapi=1&origin=${window.location.origin}`;

  return (
    <div
      ref={playerRef}
      className="fixed z-[9999] shadow-2xl rounded-lg overflow-hidden bg-black border border-white/20 backdrop-blur-sm transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? "300px" : `${size.width}px`,
        height: isMinimized ? "50px" : `${size.height}px`,
        cursor: isDragging ? "grabbing" : "grab"
      }}
      onMouseDown={handleDragStart}
    >
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-xs font-bold tracking-wider">LIVE PODCAST</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize();
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-500/20 hover:text-red-400 transition-colors"
            aria-label="Close player"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <iframe
          ref={iframeRef}
          src={youtubeUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Podcast Player"
        />
      )}

      {isMinimized && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
          <span className="text-white text-xs font-medium">Minimized</span>
        </div>
      )}

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-0 hover:opacity-100"
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsResizing(true);
        }}
      >
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white/40" />
      </div>
    </div>
  );
};
