import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function TestimonialsCard({
  items,
  className,
  width = 500,
  showNavigation = true,
  showCounter = true,
  autoPlay = false,
  autoPlayInterval = 3000,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeItem = items[activeIndex];

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const handleNext = () => {
    if (activeIndex < items.length - 1) {
      setDirection(1);
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex(activeIndex - 1);
    }
  };

  const rotations = useMemo(() => [4, -2, -9, 7], []);

  if (!items || items.length === 0) return null;

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div
        className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr] grid-rows-[auto_auto_auto] gap-x-12 gap-y-6 w-full max-w-5xl items-center"
        style={{ perspective: "1400px", maxWidth: width ? `${width}px` : "100%" }}
      >
        {showCounter && (
          <div className="col-start-1 md:col-start-2 row-start-1 md:text-right font-mono text-sm text-neutral-500">
            {activeIndex + 1} / {items.length}
          </div>
        )}

        <div className="col-start-1 md:col-start-1 row-start-1 row-span-3 relative w-full aspect-square md:aspect-[4/5] mx-auto z-10">
          <AnimatePresence custom={direction}>
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const offset = index - activeIndex;
              return (
                <motion.div
                  key={item.id}
                  className="absolute inset-0 w-full h-full overflow-hidden border-8 bg-neutral-200 border-white shadow-2xl rounded-2xl"
                  initial={{
                    x: offset * 15,
                    y: Math.abs(offset) * 6,
                    z: -150 * Math.abs(offset),
                    scale: 0.85 - Math.abs(offset) * 0.04,
                    rotateZ: rotations[index % 4],
                    opacity: isActive ? 1 : 0.5,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  animate={
                    isActive
                      ? {
                          x: [offset * 15, direction === 1 ? -200 : 200, 0],
                          y: [Math.abs(offset) * 6, 0, 0],
                          z: [-200, 150, 250],
                          scale: [0.85, 1.05, 1],
                          rotateZ: [rotations[index % 4], -5, 0],
                          opacity: 1,
                          zIndex: 100,
                        }
                      : {
                          x: offset * 15,
                          y: Math.abs(offset) * 6,
                          z: -150 * Math.abs(offset),
                          rotateZ: rotations[index % 4],
                          scale: 0.85 - Math.abs(offset) * 0.04,
                          opacity: 0.55,
                          zIndex: 10 - Math.abs(offset),
                        }
                  }
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="col-start-1 md:col-start-2 row-start-2 flex flex-col justify-center min-h-[160px] relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < activeItem.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-semibold italic mb-6">"{activeItem.description}"</p>
              <h3 className="text-xl font-bold text-primary">{activeItem.title}</h3>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{activeItem.role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {showNavigation && items.length > 1 && (
          <div className="col-start-1 md:col-start-2 row-start-3 flex gap-3 mt-4 md:mt-8">
            <button
              disabled={activeIndex === 0}
              onClick={handlePrev}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm transition-all text-primary hover:bg-primary hover:text-white hover:border-primary",
                activeIndex === 0 ? "opacity-30 cursor-not-allowed hover:bg-white hover:text-primary hover:border-gray-200" : "hover:scale-110 active:scale-95"
              )}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              disabled={activeIndex === items.length - 1}
              onClick={handleNext}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 bg-white shadow-sm transition-all text-primary hover:bg-primary hover:text-white hover:border-primary",
                activeIndex === items.length - 1 ? "opacity-30 cursor-not-allowed hover:bg-white hover:text-primary hover:border-gray-200" : "hover:scale-110 active:scale-95"
              )}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestimonialsCard;
