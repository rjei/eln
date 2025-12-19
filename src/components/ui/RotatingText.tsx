import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  staggerDuration?: number;
  loop?: boolean;
  auto?: boolean;
  className?: string;
  textClassName?: string;
  onTextChange?: (index: number) => void;
}

export function RotatingText({
  texts,
  rotationInterval = 2000,
  staggerDuration = 0.03,
  loop = true,
  auto = true,
  className = "",
  textClassName = "",
  onTextChange,
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      const isAtEnd = prev === texts.length - 1;
      const nextIdx = isAtEnd ? (loop ? 0 : prev) : prev + 1;
      if (nextIdx !== prev) {
        onTextChange?.(nextIdx);
      }
      return nextIdx;
    });
  }, [texts.length, loop, onTextChange]);

  useEffect(() => {
    if (!auto) return;

    const interval = setInterval(next, rotationInterval);
    return () => clearInterval(interval);
  }, [auto, rotationInterval, next]);

  const currentText = texts[currentIndex];
  
  // Split by lines first to preserve line breaks
  const lines = currentText.split('\n');

  return (
    <div className={`${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className={textClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="inline-block w-full">
              {line.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="inline-flex mr-1">
                  {word.split("").map((char, charIndex) => {
                    const totalCharsBeforeLine = lines.slice(0, lineIndex).join(' ').length;
                    const totalCharsInLine = line.split(" ").slice(0, wordIndex).join(' ').length;
                    const globalCharIndex = totalCharsBeforeLine + totalCharsInLine + charIndex;
                    
                    return (
                      <motion.span
                        key={`${lineIndex}-${wordIndex}-${charIndex}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 300,
                          delay: globalCharIndex * staggerDuration,
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
