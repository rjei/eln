import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import VideoPlayer from "./VideoPlayer";
import CanvasTimeline from "./CanvasTimeline";
import {
  InteractiveTranscript,
  TranscriptSegment,
} from "./InteractiveTranscript";

function LiveSegmentBox({
  segments,
  currentTime,
}: {
  segments: TranscriptSegment[];
  currentTime: number;
}) {
  const active = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    // exact current segment
    const exact = segments.find(
      (s) => currentTime >= s.startTime && currentTime <= s.endTime
    );
    if (exact) return exact;
    // fallback to last segment that started before currentTime
    for (let i = segments.length - 1; i >= 0; i--) {
      if (segments[i].startTime <= currentTime) return segments[i];
    }
    return null;
  }, [currentTime, segments]);

  return (
    <div className="w-full">
      <div className="bg-white/90 border border-purple-200 rounded-md p-3 max-h-40 overflow-y-auto">
        <div className="text-xs text-gray-600 mb-1">Sedang diputar</div>
        <div className="text-sm font-semibold text-black mb-1">
          {active?.speaker || "-"}
        </div>
        <div className="text-sm text-black leading-relaxed">
          {active?.text || "(Tidak ada transkrip)"}
        </div>
        {active?.translation && (
          <div className="text-xs italic text-gray-600 mt-2">
            {active.translation}
          </div>
        )}
      </div>
    </div>
  );
}

interface ComprehensibleInputPageProps {
  onBack: () => void;
}

export function ComprehensibleInputPage({
  onBack,
}: ComprehensibleInputPageProps) {
  const defaultVideo = "_Se8m3SnAi4"; // YouTube id provided
  const [videoId, setVideoId] = useState<string>(defaultVideo);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [editorText, setEditorText] = useState<string>(
    `0-9|Anchor|Well, we're getting our first look at the Pentagon watchdog report on the|Baiklah, kita mendapatkan gambaran pertama kita tentang laporan pengawas Pentagon mengenai
9-14|Anchor|so-called signal gate scandal. The news breaking right now. Sources telling us|skandal yang disebut signal gate. Berita ini baru saja terungkap. Sumber memberitahu kami
14-19|Anchor|the Pentagon's inspector general found that Secretary Pete Hgsth risked|inspektur jenderal Pentagon menemukan bahwa Menteri Pete Hgsth berisiko
19-24|Anchor|exposing classified information that could have endangered US troops when he|membocorkan informasi rahasia yang dapat membahayakan pasukan AS ketika dia
24-29|Anchor|discussed a planned military strike in Yemen on the Signal app. Our senior|membahas rencana serangan militer di Yaman melalui aplikasi Signal. Wartawan senior kami
29-34|Reporter|Pentagon reporter Louie Martinez has been able to confirm this. What more are|di Pentagon, Louie Martinez, telah berhasil mengonfirmasi hal ini. Apa lagi yang
34-39|Anchor|we learning, Louie? >> Cara, the official report does not come|kita pelajari, Louie? >> Cara, laporan resmi baru keluar besok,
39-44|Anchor|excuse me, it also said that Hexth declined to be interviewed in person for|maaf, juga dikatakan bahwa Hexth menolak untuk diwawancarai secara langsung untuk
44-49|Anchor|the report. uh one of the things that he did do is that he did provide them with|laporan tersebut. uh salah satu hal yang dia lakukan adalah dia memberikan mereka
49-54|Anchor|a statement where he said uh that he has the power to classify and declassify|pernyataan di mana dia mengatakan uh bahwa dia memiliki kekuasaan untuk mengklasifikasikan dan mendeklasifikasikan
54-59|Anchor|information and that he was well within his rights to have done so. But at the|informasi dan bahwa dia sepenuhnya berhak melakukannya. Tapi di
59-64|Anchor|same time, he also insisted that the uh to the inspector general that the|saat yang sama, dia juga bersikeras kepada inspektur jenderal bahwa
64-69|Anchor|information that was placed in the chat by him was not sensitive and it would|informasi yang ditempatkan di obrolan olehnya tidak sensitif dan tidak akan
69-74|Anchor|not have put uh troops at risk and that is something that the inspector general|membahayakan pasukan dan itulah yang ditolak mentah-mentah oleh inspektur jenderal.
74-79|Anchor|rejected out outright. >> All right. We'll wait to see the actual|>> Baiklah. Kita akan menunggu untuk melihat laporan sebenarnya.
79-84|Anchor|report. Louis Martinez, thank you.|Louis Martinez, terima kasih.
84-89|Anchor|This is the full version.|ini adalah versi lengkapnya`
  );
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  const storageKey = `transcript_${videoId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSegments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // jika belum ada data tersimpan, parse isi editor default agar langsung tampil
      try {
        const parsed = parseEditor(editorText);
        setSegments(parsed);
      } catch (err) {
        console.error("Gagal parsing default editorText", err);
      }
    }
  }, [videoId]);

  // no body overflow manipulation; layout handled by CSS flex so header + content fill viewport

  const parseTimestamp = (s: string) => {
    s = s.trim();
    if (s.includes(":")) {
      const parts = s.split(":");
      const m = parseInt(parts[0], 10) || 0;
      const sec = parseInt(parts[1], 10) || 0;
      return m * 60 + sec;
    }
    return parseFloat(s) || 0;
  };

  const parseEditor = (text: string) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const parsed: TranscriptSegment[] = lines.map((line, idx) => {
      const parts = line.split("|");
      const times = (parts[0] || "0-5").split("-");
      return {
        id: idx + 1,
        startTime: parseTimestamp(times[0]),
        endTime: parseTimestamp(
          times[1] || (parseTimestamp(times[0]) + 5).toString()
        ),
        speaker: parts[1]?.trim() || undefined,
        text: parts[2]?.trim() || "",
        translation: parts[3]?.trim() || undefined,
      } as TranscriptSegment;
    });
    return parsed;
  };

  const handleSave = () => {
    const parsed = parseEditor(editorText);
    setSegments(parsed);
    localStorage.setItem(storageKey, JSON.stringify(parsed));
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    try {
      const d =
        player?.getDuration && typeof player.getDuration === "function"
          ? player.getDuration()
          : 0;
      setVideoDuration(d || 0);
    } catch (e) {
      setVideoDuration(0);
    }
  };

  const parseVttOrSrt = (text: string) => {
    const lines = text.replace(/\r/g, "").split("\n");
    const cues: { start: number; end: number; textLines: string[] }[] = [];

    let i = 0;
    // skip possible WEBVTT header
    if (lines[0] && lines[0].trim().toUpperCase().startsWith("WEBVTT")) i = 1;

    const timeRegex =
      /(\d{1,2}:)?\d{1,2}:\d{2}(?:\.\d+)?\s-->\s(\d{1,2}:)?\d{1,2}:\d{2}(?:\.\d+)?/;

    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) {
        i++;
        continue;
      }

      // if line is an index number, skip it
      if (/^\d+$/.test(line)) {
        i++;
        continue;
      }

      // check for timecode
      if (timeRegex.test(line)) {
        const parts = line.split(/\s*-->\s*/);
        const start = parseTimestampToSeconds(parts[0]);
        const end = parseTimestampToSeconds(parts[1]);
        i++;
        const textLines: string[] = [];
        while (i < lines.length && lines[i].trim() !== "") {
          textLines.push(lines[i]);
          i++;
        }
        cues.push({ start, end, textLines });
        continue;
      }

      // try SRT style where time may be on next line after index
      if (i + 1 < lines.length && timeRegex.test(lines[i + 1])) {
        const timeLine = lines[i + 1];
        const parts = timeLine.split(/\s*-->\s*/);
        const start = parseTimestampToSeconds(parts[0]);
        const end = parseTimestampToSeconds(parts[1]);
        i += 2;
        const textLines: string[] = [];
        while (i < lines.length && lines[i].trim() !== "") {
          textLines.push(lines[i]);
          i++;
        }
        cues.push({ start, end, textLines });
        continue;
      }

      i++;
    }

    // convert cues to TranscriptSegment[], using first line as text and second as translation if available
    const segmentsFromCues: TranscriptSegment[] = cues.map((c, idx) => ({
      id: idx + 1,
      startTime: Math.floor(c.start),
      endTime: Math.ceil(c.end),
      text: c.textLines[0] ? c.textLines[0].trim() : "",
      translation: c.textLines[1] ? c.textLines[1].trim() : undefined,
    }));

    return segmentsFromCues;
  };

  const parseTimestampToSeconds = (t: string) => {
    const clean = t.trim();
    // formats: HH:MM:SS.mmm or MM:SS.mmm
    const parts = clean.split(":").map((p) => p.trim());
    if (parts.length === 3) {
      const h = parseInt(parts[0], 10) || 0;
      const m = parseInt(parts[1], 10) || 0;
      const s = parseFloat(parts[2].replace(",", ".")) || 0;
      return h * 3600 + m * 60 + s;
    }
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10) || 0;
      const s = parseFloat(parts[1].replace(",", ".")) || 0;
      return m * 60 + s;
    }
    return parseFloat(clean) || 0;
  };

  const handleImportLoad = () => {
    try {
      const segs = parseVttOrSrt(importText || "");
      if (segs.length === 0) {
        alert(
          "Tidak menemukan cues di teks yang dipaste. Pastikan Anda menempelkan VTT atau SRT lengkap."
        );
        return;
      }
      setSegments(segs);
      try {
        localStorage.setItem(storageKey, JSON.stringify(segs));
      } catch (e) {
        /*noop*/
      }
      setImportOpen(false);
      setImportText("");
      alert(
        "Import sukses. Silakan klik Play atau gunakan Generate timings jika perlu penyesuaian."
      );
    } catch (e) {
      console.error(e);
      alert("Gagal mengimpor: " + e);
    }
  };

  const regenerateTimings = (videoDuration: number) => {
    if (!videoDuration || videoDuration <= 0) return;
    // parse current editor text to get segment texts
    const parsed = parseEditor(editorText);
    // Count words only in the spoken text (not translation) to keep timing aligned with speech.
    const wordCounts = parsed.map(
      (s) => (s.text || "").split(/\s+/).filter(Boolean).length || 1
    );
    const totalWords = wordCounts.reduce((a, b) => a + b, 0);

    // Use floating durations to distribute time accurately, then round for stored seconds.
    let cursorFloat = 0;
    const newSegs: TranscriptSegment[] = parsed.map((s, i) => {
      const proportion = wordCounts[i] / totalWords;
      const segLenFloat = proportion * videoDuration;
      const start = Math.round(cursorFloat);
      const end = Math.round(
        Math.min(videoDuration, cursorFloat + segLenFloat)
      );
      cursorFloat += segLenFloat;
      return { ...s, startTime: start, endTime: end } as TranscriptSegment;
    });

    // Ensure last segment ends exactly at videoDuration
    if (newSegs.length > 0) {
      newSegs[newSegs.length - 1].endTime = Math.round(videoDuration);
      // also ensure starts are non-decreasing
      for (let i = 1; i < newSegs.length; i++) {
        if (newSegs[i].startTime <= newSegs[i - 1].startTime) {
          newSegs[i].startTime = newSegs[i - 1].endTime;
        }
        if (newSegs[i].endTime <= newSegs[i].startTime) {
          newSegs[i].endTime = newSegs[i].startTime + 1;
        }
      }
    }

    setSegments(newSegs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSegs));
    } catch (e) {
      console.error("Failed saving regenerated timings", e);
    }
    // Log generated timings for debugging/inspection
    // eslint-disable-next-line no-console
    console.info(
      "Regenerated timings:",
      newSegs.map((s) => ({ id: s.id, start: s.startTime, end: s.endTime }))
    );
  };

  const handleSegmentClick = (time: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time, true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-0 m-0">
      <div className="flex items-center justify-between px-6 py-4 shadow-sm bg-white/80 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
          <h1 className="text-2xl font-bold">Video Learning — Single Video</h1>
          <Button
            variant="ghost"
            onClick={() => {
              const p = playerRef.current;
              if (p && typeof p.getDuration === "function") {
                const d = p.getDuration();
                regenerateTimings(d);
              } else {
                alert(
                  "Player belum siap — tunggu pemutar siap lalu coba lagi."
                );
              }
            }}
            className="ml-4"
          >
            Generate timings
          </Button>
          <Button
            variant="ghost"
            onClick={() => setImportOpen(true)}
            className="ml-2"
          >
            Import VTT/SRT
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              try {
                playerRef.current?.unMute?.();
                playerRef.current?.setVolume?.(100);
                // eslint-disable-next-line no-console
                console.log("Sent unMute/setVolume to playerRef");
                alert("Sent unMute to player (check console)");
              } catch (e) {
                alert("Unmute failed: " + e);
              }
            }}
            className="ml-2"
          >
            Unmute
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              try {
                const p = playerRef.current;
                if (!p) {
                  alert("Player not ready");
                  return;
                }
                const vol =
                  typeof p.getVolume === "function" ? p.getVolume() : null;
                const muted =
                  typeof p.isMuted === "function" ? p.isMuted() : null;
                const state =
                  typeof p.getPlayerState === "function"
                    ? p.getPlayerState()
                    : null;
                // eslint-disable-next-line no-console
                console.log("Audio status", { vol, muted, state });
                alert(
                  `Audio status — volume: ${vol}, muted: ${muted}, state: ${state}`
                );
              } catch (e) {
                alert("Audio status check failed: " + e);
              }
            }}
            className="ml-2"
          >
            Audio status
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              console.log("segments", segments);
              alert("See console for segments");
            }}
            className="ml-2"
          >
            Log segments
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem(storageKey);
              setSegments(parseEditor(editorText));
              alert("Cleared saved transcript");
            }}
            className="ml-2"
          >
            Clear saved transcript
          </Button>
        </div>
      </div>
      <div className="flex flex-row flex-1 min-h-0">
        <div className="flex-[2] h-full flex flex-col p-6 min-h-0">
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <VideoPlayer
              videoUrl={videoId}
              onTimeUpdate={setCurrentTime}
              onPlayerReady={handlePlayerReady}
            />
          </div>

          {/* Live small transcript box below video showing current segment */}
          {/** Keeps a small visual area; long text scrolls inside this box only. */}
          <div className="mt-4 w-full">
            <CanvasTimeline
              segments={segments}
              currentTime={currentTime}
              duration={videoDuration}
              onSeek={(t) => handleSegmentClick(Math.round(t))}
            />
          </div>

          <div className="mt-3 w-full">
            <LiveSegmentBox segments={segments} currentTime={currentTime} />
          </div>
        </div>
        <div className="flex-1 h-full min-h-0 flex flex-col bg-transparent">
          <h3 className="font-semibold mb-2 px-6 pt-6">
            Interactive Transcript
          </h3>
          <div className="flex-1 min-h-0 px-6 pb-6">
            <InteractiveTranscript
              segments={segments}
              currentTime={currentTime}
              onSegmentClick={handleSegmentClick}
            />
          </div>
        </div>
      </div>

      {importOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[min(900px,95%)] max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-3">Paste VTT / SRT here</h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-64 p-2 border rounded mb-3 font-mono text-sm"
              placeholder="Paste full WebVTT or SRT content here..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setImportOpen(false);
                  setImportText("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleImportLoad}>Load</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComprehensibleInputPage;
