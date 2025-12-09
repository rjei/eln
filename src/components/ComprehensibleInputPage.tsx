import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  BookOpen,
  Video,
  Headphones,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { VideoPlayer } from "./VideoPlayer";
import {
  InteractiveTranscript,
  TranscriptSegment,
} from "./InteractiveTranscript";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

interface ComprehensibleInputPageProps {
  onBack: () => void;
}

interface VideoData {
  id: number;
  title: string;
  level: string;
  duration: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  transcript: TranscriptSegment[];
  isUserAdded?: boolean;
}

export function ComprehensibleInputPage({
  onBack,
}: ComprehensibleInputPageProps) {
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [customVideos, setCustomVideos] = useState<VideoData[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // Form states
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoLevel, setNewVideoLevel] = useState("Beginner");
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [newVideoThumbnail, setNewVideoThumbnail] = useState("");
  const [newTranscriptText, setNewTranscriptText] = useState("");

  // Load custom videos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customVideos");
    if (saved) {
      try {
        setCustomVideos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load custom videos", e);
      }
    }
  }, []);

  // Save custom videos to localStorage
  useEffect(() => {
    if (customVideos.length > 0) {
      localStorage.setItem("customVideos", JSON.stringify(customVideos));
    }
  }, [customVideos]);

  const defaultVideos: VideoData[] = [
    {
      id: 1,
      title: "Daily Conversation: At the Coffee Shop",
      level: "Beginner",
      duration: "3:24",
      description:
        "Learn how to order coffee and have casual conversations at a coffee shop.",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 7,
          text: "Good morning! Welcome to our coffee shop. What can I get for you today?",
          speaker: "Barista",
        },
        {
          id: 2,
          startTime: 7,
          endTime: 12,
          text: "Hi! I'd like a large cappuccino with extra foam, please.",
          speaker: "Customer",
        },
        {
          id: 3,
          startTime: 12,
          endTime: 18,
          text: "Sure! Would you like any flavoring? We have vanilla, caramel, and hazelnut.",
          speaker: "Barista",
        },
        {
          id: 4,
          startTime: 18,
          endTime: 23,
          text: "Vanilla sounds great! And could I also have a blueberry muffin?",
          speaker: "Customer",
        },
        {
          id: 5,
          startTime: 23,
          endTime: 30,
          text: "Of course! That'll be $8.50. Your order will be ready in just a moment.",
          speaker: "Barista",
        },
      ] as TranscriptSegment[],
    },
    {
      id: 2,
      title: "Business Meeting: Project Discussion",
      level: "Intermediate",
      duration: "5:12",
      description:
        "Professional vocabulary and phrases used in business meetings.",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 8,
          text: "Good afternoon everyone. Let's begin today's meeting. We need to discuss the timeline for our new project.",
          speaker: "Manager",
        },
        {
          id: 2,
          startTime: 8,
          endTime: 15,
          text: "I've prepared a detailed presentation about our progress so far. May I share my screen?",
          speaker: "Team Lead",
        },
        {
          id: 3,
          startTime: 15,
          endTime: 22,
          text: "Please go ahead. We're all interested to see what you've accomplished this week.",
          speaker: "Manager",
        },
        {
          id: 4,
          startTime: 22,
          endTime: 30,
          text: "As you can see, we've completed 75% of the development phase. However, we need to address some challenges.",
          speaker: "Team Lead",
        },
      ] as TranscriptSegment[],
    },
    {
      id: 3,
      title: "Travel English: At the Airport",
      level: "Intermediate",
      duration: "4:45",
      description:
        "Essential phrases and vocabulary for traveling through airports.",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 6,
          text: "Excuse me, where is the check-in counter for international flights?",
          speaker: "Traveler",
        },
        {
          id: 2,
          startTime: 6,
          endTime: 12,
          text: "The international check-in is on the second floor. Take the escalator on your right.",
          speaker: "Airport Staff",
        },
        {
          id: 3,
          startTime: 12,
          endTime: 18,
          text: "Thank you! Also, do I need to check this carry-on bag, or can I take it with me?",
          speaker: "Traveler",
        },
        {
          id: 4,
          startTime: 18,
          endTime: 25,
          text: "That size should be fine for carry-on. Just make sure it fits in the overhead compartment.",
          speaker: "Airport Staff",
        },
      ] as TranscriptSegment[],
    },
    {
      id: 4,
      title: "Academic English: Classroom Discussion",
      level: "Advanced",
      duration: "6:30",
      description: "Advanced vocabulary for academic discussions and debates.",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 9,
          text: "Today we'll be discussing the implications of climate change on global economics. Who would like to start?",
          speaker: "Professor",
        },
        {
          id: 2,
          startTime: 9,
          endTime: 18,
          text: "I'd like to argue that renewable energy investments will create significant economic opportunities in developing nations.",
          speaker: "Student 1",
        },
        {
          id: 3,
          startTime: 18,
          endTime: 26,
          text: "That's an interesting perspective. However, we must consider the short-term economic disruption during the transition period.",
          speaker: "Student 2",
        },
      ] as TranscriptSegment[],
    },
  ];

  const allVideos = [...defaultVideos, ...customVideos];

  const handleAddVideo = () => {
    if (!newVideoTitle || !newVideoUrl) {
      toast.error("Judul dan URL video wajib diisi!");
      return;
    }

    // Parse transcript dari textarea (format: "startTime-endTime|speaker|text")
    const transcriptLines = newTranscriptText.trim().split("\n");
    const parsedTranscript: TranscriptSegment[] = transcriptLines
      .filter((line) => line.trim())
      .map((line, index) => {
        const parts = line.split("|");
        const times = parts[0]?.split("-") || ["0", "5"];
        return {
          id: index + 1,
          startTime: parseInt(times[0]) || 0,
          endTime: parseInt(times[1]) || 5,
          speaker: parts[1]?.trim() || "Speaker",
          text: parts[2]?.trim() || line,
        };
      });

    const newVideo: VideoData = {
      id: Date.now(),
      title: newVideoTitle,
      level: newVideoLevel,
      duration: "Custom",
      description: newVideoDescription || "Video pembelajaran kustom",
      videoUrl: newVideoUrl,
      thumbnail:
        newVideoThumbnail ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
      transcript: parsedTranscript.length > 0 ? parsedTranscript : [],
      isUserAdded: true,
    };

    setCustomVideos([...customVideos, newVideo]);
    setShowAddDialog(false);

    // Reset form
    setNewVideoTitle("");
    setNewVideoUrl("");
    setNewVideoLevel("Beginner");
    setNewVideoDescription("");
    setNewVideoThumbnail("");
    setNewTranscriptText("");

    toast.success("Video berhasil ditambahkan!");
  };

  const handleDeleteVideo = (videoId: number) => {
    setCustomVideos(customVideos.filter((v) => v.id !== videoId));
    const currentVid = allVideos[selectedVideo];
    if (currentVid?.id === videoId && selectedVideo > 0) {
      setSelectedVideo(0);
    }
    toast.success("Video berhasil dihapus!");
  };

  const currentVideo = allVideos[selectedVideo];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-300";
      case "Intermediate":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Advanced":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b sticky top-[73px] z-40 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg shadow-lg">
              <Video className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Comprehensible Input
              </h1>
              <p className="text-gray-600 font-medium">
                Belajar melalui video dengan subtitle interaktif
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-[200px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <h3 className="text-xl font-bold">Video Lessons</h3>
                </div>

                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Tambah
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Video Pembelajaran</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Judul Video *
                        </label>
                        <Input
                          placeholder="Contoh: Daily Conversation at Restaurant"
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          URL Video * (YouTube/Direct Link)
                        </label>
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Format YouTube:
                          https://www.youtube.com/watch?v=VIDEO_ID
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          ⚠️ Catatan: Beberapa video YouTube tidak bisa di-embed
                          karena pembatasan dari pemilik video
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Level
                          </label>
                          <select
                            className="w-full border rounded-md p-2"
                            value={newVideoLevel}
                            onChange={(e) => setNewVideoLevel(e.target.value)}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            URL Thumbnail (opsional)
                          </label>
                          <Input
                            placeholder="https://..."
                            value={newVideoThumbnail}
                            onChange={(e) =>
                              setNewVideoThumbnail(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Deskripsi
                        </label>
                        <Textarea
                          placeholder="Deskripsi singkat tentang video ini..."
                          value={newVideoDescription}
                          onChange={(e) =>
                            setNewVideoDescription(e.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Transcript (opsional)
                        </label>
                        <Textarea
                          placeholder={
                            "Format per baris:\n0-7|Speaker Name|Text yang diucapkan\n7-12|Speaker 2|Text lainnya"
                          }
                          value={newTranscriptText}
                          onChange={(e) => setNewTranscriptText(e.target.value)}
                          rows={6}
                          className="font-mono text-xs"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Format: waktu_mulai-waktu_akhir|nama_speaker|teks
                        </p>
                      </div>

                      <div className="flex gap-2 justify-end pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowAddDialog(false)}
                        >
                          Batal
                        </Button>
                        <Button onClick={handleAddVideo}>
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Video
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {allVideos.map((video, index) => (
                  <Card
                    key={video.id}
                    onClick={() => setSelectedVideo(index)}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                      selectedVideo === index
                        ? "border-2 border-purple-500 bg-purple-50"
                        : "border border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${getLevelColor(video.level)}`}
                          >
                            {video.level}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {video.duration}
                          </span>
                          {video.isUserAdded && (
                            <Badge variant="outline" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </div>

                      {video.isUserAdded && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleDeleteVideo(video.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Feature Info */}
              <Card className="mt-6 p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
                <div className="flex items-start gap-3">
                  <Headphones className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-purple-900">
                      Tips Belajar
                    </h4>
                    <ul className="text-xs text-purple-800 space-y-1">
                      <li>• Tonton dengan subtitle</li>
                      <li>• Klik teks untuk loncat</li>
                      <li>• Atur kecepatan video</li>
                      <li>• Ulangi bagian sulit</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {currentVideo.title}
                  </h2>
                  <p className="text-gray-600 mb-3">
                    {currentVideo.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge className={getLevelColor(currentVideo.level)}>
                      {currentVideo.level}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Duration: {currentVideo.duration}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Video Player */}
            <Card className="overflow-hidden">
              <VideoPlayer
                videoUrl={currentVideo.videoUrl}
                onTimeUpdate={setCurrentVideoTime}
              />
            </Card>

            {/* Interactive Transcript */}
            <InteractiveTranscript
              segments={currentVideo.transcript}
              currentTime={currentVideoTime}
              onSegmentClick={(time) => {
                if (videoPlayerRef.current) {
                  videoPlayerRef.current.currentTime = time;
                }
              }}
            />

            {/* Learning Notes */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <h3 className="text-xl font-bold mb-4 text-blue-900">
                📝 Catatan Pembelajaran
              </h3>
              <div className="space-y-3 text-sm text-blue-800">
                <p>
                  <strong>Comprehensible Input</strong> adalah metode
                  pembelajaran bahasa di mana Anda belajar melalui konten yang
                  sedikit di atas level pemahaman Anda saat ini.
                </p>
                <p>
                  <strong>Cara Efektif:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Fokus pada memahami konteks, bukan setiap kata</li>
                  <li>Gunakan subtitle untuk membantu pemahaman</li>
                  <li>Klik pada bagian yang tidak jelas untuk mengulanginya</li>
                  <li>Tonton beberapa kali dengan kecepatan berbeda</li>
                  <li>Catat kata-kata baru yang muncul</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
