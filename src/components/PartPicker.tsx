import React from "react";
import { ChevronDown, Check } from "lucide-react";

type PartPickerProps = {
  total: number; // number of parts
  activeIndex: number; // 0-based
  onSelect: (index: number) => void;
  label?: string; // "Part" / "Chapter" etc
};

export function PartPicker({
  total,
  activeIndex,
  onSelect,
  label = "Part",
}: PartPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Bottom-sheet drag state
  const sheetRef = React.useRef<HTMLDivElement | null>(null);
  const drag = React.useRef({
    startY: 0,
    lastY: 0,
    lastT: 0,
    vy: 0, // px/ms
    active: false,
  });

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const closeSheet = React.useCallback(() => setOpen(false), []);
  const openSheet = React.useCallback(() => setOpen(true), []);

  // ESC closes
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeSheet]);

  // Prevent body scroll when open (best practice for sheets)
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const setSheetTranslate = (y: number) => {
    const el = sheetRef.current;
    if (!el) return;
    el.style.transform = `translateY(${y}px)`;
  };

  const setSheetTransition = (enabled: boolean) => {
    const el = sheetRef.current;
    if (!el) return;
    el.style.transition = enabled
      ? "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)" // springy-ish
      : "none";
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!sheetRef.current) return;
    // only left mouse / touch / pen
    if (e.pointerType === "mouse" && e.button !== 0) return;

    drag.current.active = true;
    drag.current.startY = e.clientY;
    drag.current.lastY = e.clientY;
    drag.current.lastT = performance.now();
    drag.current.vy = 0;

    // capture pointer so we keep receiving move/up
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setSheetTransition(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const now = performance.now();
    const dy = e.clientY - drag.current.startY;

    // velocity (px/ms)
    const dt = now - drag.current.lastT;
    if (dt > 0) {
      drag.current.vy = (e.clientY - drag.current.lastY) / dt;
    }
    drag.current.lastY = e.clientY;
    drag.current.lastT = now;

    // Only allow dragging DOWN (positive dy)
    const translate = clamp(dy, 0, 600);
    setSheetTranslate(translate);
  };

  const onPointerUp = (_e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;

    const el = sheetRef.current;
    if (!el) return;

    // Decide close vs snap back
    const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    const currentY = Number.isFinite(matrix.m42) ? matrix.m42 : 0;

    const closeByDistance = currentY > 140;
    const closeByVelocity = drag.current.vy > 0.9; // fast flick down

    setSheetTransition(true);

    if (closeByDistance || closeByVelocity) {
      // animate out
      const outY = Math.max(window.innerHeight, 900);
      setSheetTranslate(outY);
      // after animation, actually close + reset transform
      window.setTimeout(() => {
        closeSheet();
        // reset for next open
        setSheetTransition(false);
        setSheetTranslate(0);
      }, 280);
    } else {
      // snap back
      setSheetTranslate(0);
      window.setTimeout(() => setSheetTransition(false), 320);
    }
  };

  // When opening: reset any leftover translate and animate in
  React.useEffect(() => {
    if (!open) return;

    const el = sheetRef.current;
    if (!el) return;

    // Start from below and slide up
    setSheetTransition(false);
    setSheetTranslate(Math.max(window.innerHeight, 900));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSheetTransition(true);
        setSheetTranslate(0);
        window.setTimeout(() => setSheetTransition(false), 340);
      });
    });
  }, [open]);

  const items = React.useMemo(() => {
    return Array.from({ length: Math.max(1, total) }, (_, i) => i);
  }, [total]);

  return (
    <div className="w-full">
      {/* Trigger (full width) */}
      <button
        type="button"
        onClick={openSheet}
        className="
          w-full flex items-center justify-between
          px-4 py-3
          rounded-2xl border
          bg-white dark:bg-zinc-900 light:bg-white
          border-gray-200 dark:border-[#fffefe1a] light:border-gray-200
          text-gray-900 dark:text-white light:text-gray-900
          shadow-sm
          hover:bg-zinc-50 dark:hover:bg-zinc-800 light:hover:bg-zinc-50
          transition-colors
        "
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className="flex flex-col items-start min-w-0">
          <span className="text-xs tracking-[0.22em] uppercase text-gray-500 dark:text-[#9e9ea9] light:text-gray-600">
            {label}
          </span>
          <span className="text-sm font-semibold truncate">
            {label} {activeIndex + 1} of {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-[#9e9ea9] light:text-gray-600 hidden sm:inline">
            Select
          </span>
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-[#9e9ea9] light:text-gray-600" />
        </div>
      </button>

      {/* Bottom Sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[80]"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} picker`}
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={closeSheet}
            aria-label="Close"
          />

          {/* Sheet */}
          <div
            ref={sheetRef}
            className="
              absolute left-0 right-0 bottom-0
              rounded-t-[28px]
              bg-white dark:bg-zinc-950 light:bg-white
              border-t border-gray-200 dark:border-[#fffefe1a] light:border-gray-200
              shadow-[0_-18px_60px_rgba(0,0,0,0.18)]
              will-change-transform
            "
            style={{
              transform: "translateY(0px)",
              // safe area for iPhone
              paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
            }}
          >
            {/* Drag handle + header */}
            <div
              className="px-5 pt-3 pb-2"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300 dark:bg-zinc-700 light:bg-gray-300" />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs tracking-[0.22em] uppercase text-gray-500 dark:text-[#9e9ea9] light:text-gray-600">
                    Choose {label}
                  </span>
                  <span className="text-base font-black tracking-[-0.4px] text-gray-900 dark:text-white light:text-gray-900">
                    {label} {activeIndex + 1} of {total}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeSheet}
                  className="
                    px-3 py-2 rounded-xl
                    text-sm font-semibold
                    text-gray-700 dark:text-zinc-200 light:text-gray-700
                    hover:bg-gray-100 dark:hover:bg-zinc-800 light:hover:bg-gray-100
                    transition-colors
                  "
                >
                  Done
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[62vh] overflow-auto px-3 pb-4">
              <div className="flex flex-col gap-1">
                {items.map((idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSelect(idx);
                        // Keep sheet open for rapid selection? Apple usually closes on pick.
                        // We'll close immediately to reduce extra steps.
                        closeSheet();
                      }}
                      className={`
                        w-full flex items-center justify-between
                        px-4 py-3 rounded-2xl
                        border transition-colors
                        ${
                          isActive
                            ? "border-blue-500/40 bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-500/10"
                            : "border-gray-200 dark:border-[#fffefe1a] light:border-gray-200 bg-white dark:bg-zinc-950 light:bg-white"
                        }
                        hover:bg-gray-50 dark:hover:bg-zinc-900 light:hover:bg-gray-50
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black
                            ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 dark:bg-zinc-900 light:bg-gray-100 text-gray-900 dark:text-white light:text-gray-900"
                            }
                          `}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white light:text-gray-900">
                            {label} {idx + 1}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-[#9e9ea9] light:text-gray-600">
                            {idx === 0
                              ? "Start"
                              : idx === total - 1
                                ? "Final"
                                : "Segment"}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 light:text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
