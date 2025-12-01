import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Volume2 } from "lucide-react";

export interface TranscriptSegment {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

interface InteractiveTranscriptProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSegmentClick: (time: number) => void;
}

export function InteractiveTranscript({
  segments,
  currentTime,
  onSegmentClick,
}: InteractiveTranscriptProps) {
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const segmentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Find active segment based on current time
    const active = segments.find(
      (seg) => currentTime >= seg.startTime && currentTime <= seg.endTime
    );
    
    if (active && activeSegmentId !== active.id) {
      setActiveSegmentId(active.id);
      // Auto-scroll to active segment only if it's not visible
      const element = segmentRefs.current[active.id];
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        if (!isVisible) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [currentTime, segments, activeSegmentId]);

  const formatTimestamp = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <Volume2 className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">Interactive Transcript</h3>
        <Badge className="bg-purple-100 text-purple-700 border-purple-300">
          Klik untuk melompat ke bagian tersebut
        </Badge>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
        {segments.map((segment) => {
          const isActive = activeSegmentId === segment.id;
          
          return (
            <div
              key={segment.id}
              ref={(el) => (segmentRefs.current[segment.id] = el)}
              onClick={() => onSegmentClick(segment.startTime)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                isActive
                  ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-purple-500 shadow-xl scale-105 text-white"
                  : "bg-white/80 backdrop-blur-sm border-purple-200 hover:border-purple-400 hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    isActive
                      ? "bg-white/30 text-white"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {formatTimestamp(segment.startTime)}
                </span>
                <div className="flex-1">
                  {segment.speaker && (
                    <p
                      className={`text-xs font-bold mb-1 ${
                        isActive ? "text-white/90" : "text-purple-700"
                      }`}
                    >
                      {segment.speaker}
                    </p>
                  )}
                  <p
                    className={`text-sm leading-relaxed ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {segment.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <span>Sedang diputar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-purple-200"></div>
            <span>Klik untuk loncat</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
