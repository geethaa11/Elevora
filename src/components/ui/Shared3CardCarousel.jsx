import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Layers, LayoutGrid } from "lucide-react";

export function Shared3CardCarousel({
  items = [],
  renderCard,
  title = "",
  showToggle = true,
  defaultMode = "stack", // 'stack' or 'grid'
  emptyMessage = "No cards available.",
}) {
  // Persist view mode preference in localStorage
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem("elevora_view_mode");
      return saved === "grid" || saved === "stack" ? saved : defaultMode;
    } catch {
      return defaultMode;
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  // Mouse Drag & Touch Swipe Physics state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const isHorizontalDragRef = useRef(null);
  const dragOffsetRef = useRef(0);
  const didDragRef = useRef(false);

  const progressIntervalRef = useRef(null);
  const containerRef = useRef(null);

  const AUTO_PLAY_INTERVAL = 5000; // 5 seconds
  const PROGRESS_TICK = 50;

  const total = items.length;

  // Persist mode changes
  const handleSetMode = (newMode) => {
    setMode(newMode);
    setProgress(0);
    try {
      localStorage.setItem("elevora_view_mode", newMode);
    } catch (e) {
      // ignore storage errors
    }
  };

  // Reset index if items change significantly
  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(0);
    }
  }, [total, currentIndex]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Circular index helpers
  const getPrevIndex = useCallback((index) => (index - 1 + total) % total, [total]);
  const getNextIndex = useCallback((index) => (index + 1) % total, [total]);

  // Slide navigation with timer reset
  const goToSlide = useCallback((newIndex) => {
    setCurrentIndex(newIndex);
    setProgress(0);
    setDragOffset(0);
    dragOffsetRef.current = 0;
  }, []);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    goToSlide((currentIndex + 1) % total);
  }, [currentIndex, total, goToSlide]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    goToSlide((currentIndex - 1 + total) % total);
  }, [currentIndex, total, goToSlide]);

  // Auto-play interval & smooth 5s progress ticker
  useEffect(() => {
    if (mode !== "stack" || isPaused || isDragging || shouldReduceMotion || total <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const startTime = Date.now();
    const startProgress = progress;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, startProgress + (elapsed / AUTO_PLAY_INTERVAL) * 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current);
        handleNext();
      }
    }, PROGRESS_TICK);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [mode, currentIndex, isPaused, isDragging, shouldReduceMotion, total, handleNext, progress]);

  // Pointer/Mouse Drag Handlers for Desktop & Touch Swipe for Mobile
  const handlePointerDown = (e) => {
    if (mode !== "stack" || total <= 1) return;
    setIsDragging(true);
    setIsPaused(true);
    didDragRef.current = false;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartYRef.current = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    isHorizontalDragRef.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || mode !== "stack") return;

    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = currentX - dragStartXRef.current;
    const deltaY = currentY - dragStartYRef.current;

    // Lock direction on first significant movement
    if (isHorizontalDragRef.current === null) {
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        isHorizontalDragRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalDragRef.current) {
      if (Math.abs(deltaX) > 6) {
        didDragRef.current = true;
      }
      // Damped horizontal translation
      const clampedOffset = Math.max(-180, Math.min(180, deltaX));
      dragOffsetRef.current = clampedOffset;
      setDragOffset(clampedOffset);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const finalOffset = dragOffsetRef.current;
    const DRAG_THRESHOLD = 45; // pixels to trigger slide transition

    if (finalOffset < -DRAG_THRESHOLD) {
      handleNext();
    } else if (finalOffset > DRAG_THRESHOLD) {
      handlePrev();
    } else {
      // Spring back
      setDragOffset(0);
    }

    dragOffsetRef.current = 0;
    // Resume auto-play after short grace period
    setTimeout(() => {
      setIsPaused(false);
    }, 1200);
  };

  // Prevent drag from triggering clicks inside cards
  const handleCardContainerClick = (e) => {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (mode !== "stack") return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  if (!items || items.length === 0) {
    return <div className="text-center py-8 text-neutral-400 text-sm">{emptyMessage}</div>;
  }

  const prevIndex = getPrevIndex(currentIndex);
  const nextIndex = getNextIndex(currentIndex);

  const prevItem = items[prevIndex];
  const currItem = items[currentIndex];
  const nextItem = items[nextIndex];

  // Drag physics styling for Current Card
  const dragRotation = (dragOffset / 180) * 3; // max ±3 deg rotation
  const dragScale = isDragging ? 0.98 : 1.02;

  return (
    <div className="flex flex-col gap-5 w-full my-2">
      {/* Header bar: Title & Stack/Grid Toggle Control */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {title ? (
          <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FFD700]" />
            <span>{title}</span>
          </h2>
        ) : (
          <div />
        )}

        {showToggle && (
          <div className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/90 p-1 backdrop-blur select-none">
            <button
              onClick={() => handleSetMode("stack")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                mode === "stack"
                  ? "bg-[#D4AF37] text-neutral-950 font-bold shadow-md shadow-[#D4AF37]/20"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              }`}
              title="Interactive Stack Carousel Mode"
            >
              <Layers className="h-3.5 w-3.5" />
              Stack Mode
            </button>
            <button
              onClick={() => handleSetMode("grid")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                mode === "grid"
                  ? "bg-[#D4AF37] text-neutral-950 font-bold shadow-md shadow-[#D4AF37]/20"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              }`}
              title="Standard Responsive Grid Mode"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Grid Mode
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: GRID MODE */}
      {mode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300 ease-in-out">
          {items.map((item, index) => (
            <React.Fragment key={item.id || index}>
              {renderCard(item, true, index)}
            </React.Fragment>
          ))}
        </div>
      ) : (
        /* MODE 2: REUSABLE STACK CAROUSEL WITH MOUSE DRAG & TOUCH SWIPE */
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!isDragging) setIsPaused(false);
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label={title || "Interactive Card Carousel"}
          className="relative w-full max-w-7xl mx-auto flex flex-col gap-6 overflow-x-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-2xl py-2 transition-all duration-300 ease-in-out"
        >
          {/* Top Arrow Navigation Bar */}
          <div className="flex items-center justify-between w-full px-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 font-medium text-neutral-300">
              <span>
                Card <strong className="text-[#FFD700]">{currentIndex + 1}</strong> of {total}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous card"
                className="flex items-center justify-center p-2 rounded-full border border-neutral-700 bg-surface/90 text-neutral-200 hover:border-[#D4AF37] hover:text-[#FFD700] hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-200 active:scale-95 shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next card"
                className="flex items-center justify-center p-2 rounded-full border border-neutral-700 bg-surface/90 text-neutral-200 hover:border-[#D4AF37] hover:text-[#FFD700] hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-200 active:scale-95 shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 3-Card Carousel Track with Mouse Drag & Touch Physics */}
          <div
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="relative w-full min-h-[360px] sm:min-h-[380px] flex items-center justify-center py-2 select-none cursor-grab active:cursor-grabbing"
          >
            <div className="w-full flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
              
              {/* PREVIOUS CARD (Left preview - 45% opacity, scale 0.88, offset) */}
              <div
                onClick={(e) => {
                  handleCardContainerClick(e);
                  if (!didDragRef.current) handlePrev();
                }}
                className="hidden md:flex flex-col flex-1 max-w-[340px] rounded-2xl border border-neutral-800 bg-surface/40 p-4 cursor-pointer opacity-45 scale-[0.88] hover:opacity-75 transition-all duration-350 ease-out shadow-sm pointer-events-auto"
                style={{
                  transform: `translateX(${dragOffset * 0.3}px) scale(0.88)`,
                  transition: isDragging || shouldReduceMotion ? "none" : "all 350ms cubic-bezier(0.25, 0.8, 0.25, 1)",
                }}
              >
                {prevItem && renderCard(prevItem, false, prevIndex)}
              </div>

              {/* CURRENT CARD (Center primary - bright 100% opacity, scale 1.02, embossed gold glow border) */}
              <div
                onClickCapture={handleCardContainerClick}
                className="flex flex-col w-full max-w-[460px] rounded-2xl z-20 pointer-events-auto"
                style={{
                  opacity: 1,
                  transform: `translateX(${dragOffset}px) rotate(${dragRotation}deg) scale(${dragScale})`,
                  boxShadow: "0 14px 40px rgba(212, 175, 55, 0.28), 0 0 2px #D4AF37",
                  border: "1.5px solid rgba(212, 175, 55, 0.8)",
                  borderRadius: "1rem",
                  transition: isDragging || shouldReduceMotion ? "none" : "all 350ms cubic-bezier(0.25, 0.8, 0.25, 1)",
                }}
              >
                {currItem && renderCard(currItem, true, currentIndex)}
              </div>

              {/* NEXT CARD (Right preview - 45% opacity, scale 0.88, offset) */}
              <div
                onClick={(e) => {
                  handleCardContainerClick(e);
                  if (!didDragRef.current) handleNext();
                }}
                className="hidden md:flex flex-col flex-1 max-w-[340px] rounded-2xl border border-neutral-800 bg-surface/40 p-4 cursor-pointer opacity-45 scale-[0.88] hover:opacity-75 transition-all duration-350 ease-out shadow-sm pointer-events-auto"
                style={{
                  transform: `translateX(${dragOffset * 0.3}px) scale(0.88)`,
                  transition: isDragging || shouldReduceMotion ? "none" : "all 350ms cubic-bezier(0.25, 0.8, 0.25, 1)",
                }}
              >
                {nextItem && renderCard(nextItem, false, nextIndex)}
              </div>

            </div>
          </div>

          {/* Footer Indicators: 5s Progress Bar & Pagination Dots */}
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Subtle 5-second Progress Fill Bar */}
            <div className="w-full max-w-xs h-1 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {items.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to card ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-[#FFD700] shadow-sm shadow-[#FFD700]/50"
                      : "w-2.5 bg-neutral-700 hover:bg-neutral-500"
                  }`}
                />
              ))}
            </div>

            {/* Status Hint */}
            {(isPaused || isDragging) && (
              <span className="text-[11px] text-[#D4AF37] font-medium tracking-wide animate-pulse">
                ⏸ Auto-play paused (User interaction active)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Shared3CardCarousel;
