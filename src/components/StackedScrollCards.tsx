import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StackedScrollCardsProps = {
  children: React.ReactNode[];
  /** offset from top so pinned stack sits below sticky header */
  topOffset?: number;
  /**
   * Optional override: total pinned distance in viewport-heights
   * Example: 2.2 means ~2.2 * viewportHeight
   */
  scrollLengthVh?: number;
};

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function StackedScrollCards({
  children,
  topOffset = 96,
  scrollLengthVh,
}: StackedScrollCardsProps) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const cardEls = React.useRef<HTMLDivElement[]>([]);
  cardEls.current = [];

  const addCardRef = (el: HTMLDivElement | null) => {
    if (el) cardEls.current.push(el);
  };

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const cards = cardEls.current;
    if (!wrapper || !stage || cards.length === 0) return;

    // Honor reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // kill any triggers on this wrapper (HMR safety)
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === wrapper) t.kill();
      });

      const mm = gsap.matchMedia();

      // Base absolute positioning for "deck"
      const setupPositions = () => {
        gsap.set(stage, { position: "relative" });

        cards.forEach((card) => {
          gsap.set(card, {
            position: "absolute",
            left: "50%",
            top: 0,
            xPercent: -50,
            y: 0,
            willChange: "transform",
          });
        });
      };

      setupPositions();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (mctx) => {
          const { isMobile } = mctx.conditions as { isMobile: boolean; isDesktop: boolean };

          // ---- Tunables (safe defaults) ----
          const stackTopGap = 10; // gap below the pinned top
          const pilePeek = isMobile ? 16 : 18; // how much the next card peeks behind
          const pileRotate = isMobile
            ? [-7, 6, -5, 5, -4, 4, -3, 3]
            : [-6, 5, -4, 4, -3, 3, -2, 2];

          // For readability once a card "unstacks"
          const unstackSpacingExtra = isMobile ? 18 : 22; // extra space between cards

          // Prevent jitter: progress is monotonic while scrolling DOWN
          const maxProgressRef = { current: 0 };

          const measure = () => {
            const rect = cards[0].getBoundingClientRect();
            const cardH = Math.max(240, rect.height || 0);
            const cardW = rect.width || stage.getBoundingClientRect().width;

            // spacing for unstacked cards (downward)
            const unstackGap = cardH + unstackSpacingExtra;

            // stage needs to be tall enough for final unstacked layout
            const stageHeight = stackTopGap + cardH + unstackGap * (cards.length - 1) + 24;

            return { cardH, cardW, unstackGap, stageHeight };
          };

          // Count-aware pin duration (keeps it tight for 2 cards, still smooth for 6+)
          const getEndDistance = (vh: number) => {
            const n = cards.length;
            if (typeof scrollLengthVh === "number") return vh * scrollLengthVh;

            // tuned: 2 cards ≈ 1.0–1.2vh; 6 cards ≈ 2.0–2.6vh
            if (isMobile) return vh * Math.max(0.95, n * 0.42);
            return vh * Math.max(0.8, n * 0.28);
          };

          // pin starts below sticky header
          const startStr = () => `top top+=${topOffset}`;

          // Initial (visible immediately): stacked deck at the top
          const applyInitialDeck = () => {
            const { unstackGap, stageHeight } = measure();

            // ensure wrapper has enough space post-pin (prevents overlap with next section)
            gsap.set(stage, { height: stageHeight });

            cards.forEach((card, i) => {
              const pileIndex = Math.min(i, 6);
              gsap.set(card, {
                zIndex: 100 - i,
                x: 0,
                y: stackTopGap + pileIndex * pilePeek,
                rotate: pileRotate[i % pileRotate.length],
                scale: 1 - pileIndex * 0.015,
                opacity: 1, // IMPORTANT: no opacity blending
              });
            });

            // return for update calculations
            return { unstackGap };
          };

          const { unstackGap } = applyInitialDeck();

          const trigger = ScrollTrigger.create({
            trigger: wrapper,
            start: startStr,
            end: () => `+=${getEndDistance(window.innerHeight)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.9,
            anticipatePin: 1,
            onRefresh: () => {
              // keep deck consistent on refresh
              maxProgressRef.current = 0;
              applyInitialDeck();
            },
            onUpdate: (self) => {
              // monotonic progress when scrolling down => no “unstack then restack” jitter
              if (self.direction > 0) {
                maxProgressRef.current = Math.max(maxProgressRef.current, self.progress);
              } else {
                // scrolling up: allow it to restack naturally
                maxProgressRef.current = self.progress;
              }

              const pGlobal = maxProgressRef.current;

              const total = cards.length;
              const per = 1 / total;

              // animate each card i from "pile" => "unstacked below"
              cards.forEach((card, i) => {
                const pileIndex = Math.min(i, 6);

                const pileY = stackTopGap + pileIndex * pilePeek;
                const finalY = stackTopGap + i * (unstackGap);

                // each card gets its own segment of progress
                const start = i * per;
                const local = clamp01((pGlobal - start) / per);

                // ease a bit (no pop)
                const t = local * local * (3 - 2 * local); // smoothstep

                const y = lerp(pileY, finalY, t);
                const rot = lerp(pileRotate[i % pileRotate.length], 0, t);
                const scale = lerp(1 - pileIndex * 0.015, 1, t);

                gsap.set(card, {
                  x: 0,
                  y,
                  rotate: rot,
                  scale,
                  opacity: 1,
                  zIndex: 100 - i,
                });
              });
            },
          });

          return () => {
            trigger.kill();
          };
        }
      );

      return () => mm.revert();
    }, wrapperRef);

    return () => ctx.revert();
  }, [children.length, topOffset, scrollLengthVh]);

  return (
    <div ref={wrapperRef} className="w-full">
      <div ref={stageRef} className="relative w-full">
        {children.map((child, i) => (
          <div
            key={i}
            ref={addCardRef}
            // IMPORTANT: width constraints here; outer section supplies gutters
            className="w-full max-w-[640px] mx-auto"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
