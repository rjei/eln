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
  translation?: string;
}

interface InteractiveTranscriptProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSegmentClick: (time: number) => void;
  onWordClick?: (word: string) => void;
}

export function InteractiveTranscript({
  segments,
  currentTime,
  onSegmentClick,
  onWordClick,
}: InteractiveTranscriptProps) {
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const segmentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [tooltipData, setTooltipData] = useState<{ definition?: string; example?: string; exampleId?: string; exampleIdError?: string } | null>(null);
  const defCache = useRef<Map<string, { definition?: string; example?: string; exampleId?: string; exampleIdError?: string }>>(new Map());

  useEffect(() => {
    // Choose the last segment whose startTime <= currentTime + epsilon
    const eps = 0.4; // seconds tolerance
    let active: TranscriptSegment | undefined;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.startTime <= currentTime + eps) {
        active = seg;
      } else {
        break;
      }
    }

    // update active segment id (null if none)
    setActiveSegmentId(active ? active.id : null);

    // Scroll transcript container so active segment is visible (compute relative positions)
    if (active) {
      const element = segmentRefs.current[active.id];
      const container = containerRef.current;
      if (element && container) {
        const elRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const overTop = elRect.top < containerRect.top + 8; // small padding
        const overBottom = elRect.bottom > containerRect.bottom - 8;

        if (overTop || overBottom) {
          const offset = elRect.top - containerRect.top - (container.clientHeight / 2 - elRect.height / 2);
          container.scrollBy({ top: offset, behavior: "smooth" });
        }
      }
    }
  }, [currentTime, segments]);

  // Ensure wheel events over the transcript container scroll it and do not bubble to body (Edge fix)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Let native scrolling handle wheel/touch events. Removing custom wheel handler
    // avoids interfering with browser/OS scrolling behavior (Edge/touchpad issues).
    return;
  }, []);

  const formatTimestamp = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Volume2 className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-bold text-black">Interactive Transcript</h3>
        <Badge className="bg-purple-100 text-purple-700 border-purple-300">
          Klik untuk melompat ke bagian tersebut
        </Badge>
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        aria-label="Interactive transcript scroll"
        style={{ touchAction: "pan-y" }}
        className="relative flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50"
        onWheel={(e) => { e.stopPropagation(); }}
        onTouchMove={(e) => { e.stopPropagation(); }}
      >
        <div className="space-y-3">
          {segments.map((segment) => {
            const isActive = activeSegmentId === segment.id;

            return (
              <div
                key={segment.id}
                ref={(el) => (segmentRefs.current[segment.id] = el)}
                className={`p-3 rounded-lg transition-all duration-300 border-2 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-purple-500 shadow-xl scale-105"
                    : "bg-white/80 backdrop-blur-sm border-purple-200"
                }`}
              >
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div onClick={() => onSegmentClick(segment.startTime)} className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${isActive ? "bg-white/30 text-black" : "bg-purple-100 text-purple-700"}`}>
                        {formatTimestamp(segment.startTime)}
                      </span>
                      {segment.speaker && (
                        <span className={`text-xs font-semibold ${isActive ? "text-black" : "text-purple-700"}`}>
                          {segment.speaker}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${isActive ? "text-black font-semibold" : "text-black"}`}>
                      {segment.text.split(/(\s+)/).map((w, i) => {
                        if (w.trim() === "") return <span key={i}>{w}</span>;
                        const clean = w.replace(/[.,!?;:()\[\]"]+/g, "");
                        return (
                          <span
                            key={i}
                            className="hover:underline hover:text-primary cursor-pointer relative"
                            onClick={(e) => { e.stopPropagation(); onWordClick?.(clean); }}
                            onMouseEnter={(e) => {
                              const rect = (e.target as HTMLElement).getBoundingClientRect();
                              const containerRect = containerRef.current?.getBoundingClientRect();
                              if (containerRect) {
                                setTooltipPos({ x: rect.left - containerRect.left, y: rect.bottom - containerRect.top });
                              }
                              setHoveredWord(clean);
                              // try cache first
                              const cached = defCache.current.get(clean.toLowerCase());
                              if (cached) {
                                setTooltipData(cached);
                                return;
                              }
                              // fetch definition and try to translate example to Indonesian
                              (async () => {
                                  try {
                                  const wordToQuery = clean.toLowerCase();
                                  const dictUrl = (w: string) => `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`;
                                  let res = await fetch(dictUrl(wordToQuery));
                                  // if not found, try a fallback removing apostrophes (we're -> were)
                                  if (!res.ok) {
                                    // eslint-disable-next-line no-console
                                    console.debug('Dictionary lookup failed, trying fallback without apostrophes', wordToQuery);
                                    const fallback = wordToQuery.replace(/[’']/g, '');
                                    if (fallback !== wordToQuery) {
                                      res = await fetch(dictUrl(fallback));
                                    }
                                  }

                                  if (!res.ok) throw new Error('no-def');
                                  const json = await res.json();
                                  const meaning = json[0]?.meanings?.[0];
                                  const def = meaning?.definitions?.[0]?.definition;
                                  const example = meaning?.definitions?.[0]?.example;
                                  const data: any = { definition: def, example };
                                  // if example exists, try translate to Indonesian via LibreTranslate
                                  if (example) {
                                    // Try translating via dev-server proxy '/translate' to avoid CORS in dev.
                                    // Will retry once on failure and record an error message for user.
                                    // eslint-disable-next-line no-console
                                    console.debug('Translating example via /translate proxy', example);
                                    try {
                                      const doTranslate = async () => {
                                        return await fetch('/translate', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ q: example, source: 'en', target: 'id', format: 'text' }),
                                        });
                                      };

                                      let tRes = await doTranslate();
                                      if (!tRes.ok) {
                                        // one retry
                                        // eslint-disable-next-line no-console
                                        console.debug('First translate attempt failed, retrying', tRes.status, tRes.statusText);
                                        tRes = await doTranslate();
                                      }

                                      if (tRes.ok) {
                                        const ctype = tRes.headers.get('content-type') || '';
                                        if (ctype.includes('application/json')) {
                                          const tJson = await tRes.json();
                                          data.exampleId = tJson.translatedText || tJson.translated_text || tJson.result || '';
                                          // eslint-disable-next-line no-console
                                          console.debug('Translation result', data.exampleId);
                                        } else {
                                          // unexpected non-JSON response (HTML/redirect); read a short snippet
                                          const txt = await tRes.text();
                                          const snippet = txt.slice(0, 200).replace(/\s+/g, ' ');
                                          data.exampleIdError = `Unexpected response: ${snippet}`;
                                          // eslint-disable-next-line no-console
                                          console.warn('Translation returned non-JSON response', snippet);
                                        }
                                      } else {
                                        // record human-friendly error
                                        data.exampleIdError = `HTTP ${tRes.status}`;
                                        // eslint-disable-next-line no-console
                                        console.warn('Translation request failed', tRes.status, tRes.statusText);
                                      }
                                    } catch (e: any) {
                                      data.exampleIdError = e?.message || 'network error';
                                      // eslint-disable-next-line no-console
                                      console.warn('Translation error', e);
                                    }
                                  }
                                  defCache.current.set(clean.toLowerCase(), data);
                                  setTooltipData(data);
                                  } catch (err: any) {
                                  // eslint-disable-next-line no-console
                                  console.debug('Dictionary lookup/translation failed for', clean.toLowerCase(), err?.message || err);
                                  defCache.current.set(clean.toLowerCase(), { definition: undefined, example: undefined });
                                  setTooltipData({ definition: undefined, example: undefined, exampleIdError: err?.message || 'lookup failed' });
                                }
                              })();
                            }}
                            onMouseLeave={() => { setHoveredWord(null); setTooltipData(null); setTooltipPos(null); }}
                          >
                            {w}
                          </span>
                        );
                      })}
                    </p>
                  </div>

                  <div onClick={() => onSegmentClick(segment.startTime)} className="cursor-pointer">
                    <div className="mb-2 text-xs text-black">Terjemahan</div>
                    <p className={`text-sm leading-relaxed ${isActive ? "text-black italic" : "text-black italic"}`}>
                      {segment.translation || "-"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* tooltip */}
        {hoveredWord && tooltipPos && (
          <div
            className="absolute z-50 w-64 p-3 bg-gray-800 text-white rounded shadow-lg text-sm"
            style={{ left: tooltipPos.x, top: tooltipPos.y + 6 }}
            role="tooltip"
          >
            <div className="font-semibold mb-1">{hoveredWord}</div>
              <div className="text-xs mb-1 text-gray-200">{tooltipData?.definition ?? 'Tidak ada definisi'}</div>
              <div className="text-xs italic text-gray-300">{tooltipData?.example ? `"${tooltipData.example}"` : 'Tidak ada contoh'}</div>
              <div className="text-xs mt-2 text-gray-200">
                <div className="font-semibold">Terjemahan</div>
                <div className="italic text-sm text-gray-300">
                  {tooltipData?.exampleId ? tooltipData.exampleId : (tooltipData?.exampleIdError ? `Gagal terjemahkan: ${tooltipData.exampleIdError}` : (tooltipData?.example ? 'Terjemahan tidak tersedia' : '-'))}
                </div>
              </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="flex items-center gap-4 text-xs text-black">
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
