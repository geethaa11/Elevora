import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Layers, LayoutGrid, Sparkles } from "lucide-react";

export function TwoCardSwipeStack({
  items = [],
  renderCard,
  emptyMessage = "No cards remaining.",
  onViewChange,
  showToggle = true,
  title = "",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState("stack"); // 'stack' or 'grid'

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitingDirection, setExitingDirection] = useState(null); // 'left' or 'right'

  const startXRef = useRef(0);
  const dragXRef = useRef(0);
  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 110; // px to trigger swipe complete

  useEffect(() => {
    // Reset index if items list changes length significantly
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0);
    }
  }, [items.length]);

  const handlePointerDown = (e) => {
    // Don't trigger drag on interactive buttons/links inside card
    if (e.target.closest("button, a, input, select")) return;

    setIsDragging(true);
    startXRef.current = e.clientX;
    dragXRef.current = 0;
    setDragX(0);
    setExitingDirection(null);

    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - startXRef.current;
    dragXRef.current = delta;
    setDragX(delta);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    const delta = dragXRef.current;

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      // Trigger swipe transition complete
      const direction = delta > 0 ? "right" : "left";
      setExitingDirection(direction);

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setDragX(0);
        setExitingDirection(null);
      }, 240);
    } else {
      // Spring back to center
      setDragX(0);
    }

    if (cardRef.current && cardRef.current.hasPointerCapture(e.pointerId)) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setExitingDirection("left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setDragX(0);
        setExitingDirection(null);
      }, 200);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setDragX(0);
      setExitingDirection(null);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setDragX(0);
    setExitingDirection(null);
  };

  if (!items || items.length === 0) {
    return <div className="text-center py-8 text-neutral-400">{emptyMessage}</div>;
  }

  // Calculate interpolation ratio (0 to 1) based on current dragX distance
  const progress = Math.min(1, Math.abs(dragX) / SWIPE_THRESHOLD);

  const card1 = items[currentIndex];
  const card2 = items[currentIndex + 1];

  const isStackEnd = currentIndex >= items.length;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header bar with title and View Mode Toggle */}
      <div className="flex items-center justify-between gap-4">
        {title ? (
          <h2 className="font-display text-xl font-bold text-neutral-50 flex items-center gap-2">
            <span>{title}</span>
          </h2>
        ) : <div />}

        {showToggle && (
          <div className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/90 p-1 backdrop-blur">
            <button
              onClick={() => {
                setViewMode("stack");
                if (onViewChange) onViewChange("stack");
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "stack"
                  ? "bg-[#D4AF37] text-neutral-950 font-bold shadow-md shadow-[#D4AF37]/20"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Swipe Stack
            </button>
            <button
              onClick={() => {
                setViewMode("grid");
                if (onViewChange) onViewChange("grid");
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-[#D4AF37] text-neutral-950 font-bold shadow-md shadow-[#D4AF37]/20"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Grid View
            </button>
          </div>
        )}
      </div>

      {viewMode === "grid" ? (
        /* Grid View Fallback */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <React.Fragment key={item.id || index}>
              {renderCard(item, false, index)}
            </React.Fragment>
          ))}
        </div>
      ) : (
        /* Two-Card Swipeable Stack View */
        <div className="flex flex-col items-center gap-4 w-full my-2">
          {/* Controls Bar & Stack Counter */}
          <div className="flex items-center justify-between w-full max-w-md px-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 font-medium text-neutral-300">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>
                Card <strong className="text-[#FFD700]">{Math.min(currentIndex + 1, items.length)}</strong> of {items.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center justify-center p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-[#D4AF37]/50 hover:text-[#FFD700] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="Previous Card"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= items.length - 1}
                className="flex items-center justify-center p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-[#D4AF37]/50 hover:text-[#FFD700] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="Next Card"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors"
                title="Reset Stack"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card Stack Container */}
          {isStackEnd ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 w-full max-w-md rounded-xl border border-neutral-800 bg-surface/60 text-center backdrop-blur">
              <div className="h-12 w-12 rounded-full bg-[#D4AF37]/15 flex items-center justify-center border border-[#D4AF37]/30 text-[#FFD700]">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-100">You've reached the end!</h3>
              <p className="text-xs text-neutral-400">All available cards in this stack have been reviewed.</p>
              <button
                onClick={handleReset}
                className="mt-2 flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-[#FFD700] transition-colors shadow-lg shadow-[#D4AF37]/20"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset & Browse Again
              </button>
            </div>
          ) : (
            <div className="relative w-full max-w-md min-h-[380px] flex justify-center items-start select-none touch-none py-2">
              {/* CARD 2 (Background / Next Up Card) */}
              {card2 && (
                <div
                  className="absolute top-0 w-full transition-all ease-out z-10 pointer-events-none"
                  style={{
                    opacity: 0.45 + progress * 0.55, // Interpolates 0.45 -> 1.0 synced to drag progress
                    transform: `translateY(${12 * (1 - progress)}px) scale(${0.95 + progress * 0.05})`, // Interpolates scale(0.95 -> 1.0)
                    transition: isDragging ? "none" : "all 0.28s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  }}
                >
                  <div className="rounded-xl border border-neutral-800 shadow-sm opacity-90">
                    {renderCard(card2, false, currentIndex + 1)}
                  </div>
                </div>
              )}

              {/* CARD 1 (Active / Front Card) */}
              {card1 && (
                <div
                  ref={cardRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="relative top-0 w-full z-20 cursor-grab active:cursor-grabbing touch-pan-y"
                  style={{
                    opacity: exitingDirection
                      ? 0
                      : 1 - progress * 0.95, // Interpolates 1.0 -> 0.05 on drag away
                    transform: exitingDirection
                      ? `translateX(${exitingDirection === "right" ? "120%" : "-120%"}) rotate(${
                          exitingDirection === "right" ? "12deg" : "-12deg"
                        })`
                      : `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
                    transition: isDragging
                      ? "none"
                      : exitingDirection
                      ? "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)"
                      : "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Subtle Gold Glow and Active Border for Active Card Only */}
                  <div
                    className="rounded-xl transition-all duration-300"
                    style={{
                      boxShadow: "0 0 24px rgba(212, 175, 55, 0.22), 0 0 1px #D4AF37",
                      border: "1px solid rgba(212, 175, 55, 0.65)",
                    }}
                  >
                    {renderCard(card1, true, currentIndex)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Swipe Hint Footer */}
          {!isStackEnd && (
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium tracking-wide">
              <span>← Swipe left or right to inspect next card →</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TwoCardSwipeStack;
