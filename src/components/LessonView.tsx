import { ArrowLeft, CheckCircle2, BookOpen, ChevronRight, Sparkles, Loader2, AlertCircle, RefreshCw, Trophy, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { useState, useRef, useEffect } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { InteractiveTranscript } from "./InteractiveTranscript";
import { toast } from "sonner";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

// Interfaces for API response
interface TranscriptSegment {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  speaker: string;
}

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
}

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CourseInfo {
  id: number;
  title: string;
  level: string;
}

interface LessonData {
  id: number;
  courseId: number;
  title: string;
  duration: string;
  order: number;
  videoUrl: string | null;
  thumbnail: string | null;
  content: string;
  transcript: TranscriptSegment[];
  vocabulary: VocabularyItem[];
  quiz: QuizData | null;
  Course: CourseInfo;
  userProgress: {
    completed: boolean;
    progress: number;
    timeSpent: number;
  } | null;
}

interface LessonViewProps {
  lessonId: number;
  onBack: () => void;
  onComplete: () => void;
}

export function LessonView({ lessonId, onBack, onComplete }: LessonViewProps) {
  // State for API data
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for lesson interaction
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  // Video state
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement>(null);

  // Timer for tracking time spent
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get auth token from localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
  };

  // Fetch lesson data from API
  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 200 && data.payload) {
          setLesson(data.payload);
        } else {
          throw new Error(data.payload?.error || 'Gagal memuat lesson');
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  // Start timer when lesson loads
  useEffect(() => {
    if (lesson && !loading) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [lesson, loading]);

  // Save progress to API and return gamification data
  const saveProgress = async (completed: boolean): Promise<{ xpAdded: number; currentLevel: number; levelUp: boolean } | null> => {
    const token = getAuthToken();
    if (!token || !lesson) {
      console.log('No token or lesson, skipping progress save');
      return null;
    }

    setSavingProgress(true);

    try {
      const response = await fetch(`${API_BASE_URL}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId: lesson.id,
          courseId: lesson.courseId,
          progress: completed ? 100 : Math.round((currentStep / 3) * 100),
          completed: completed,
          timeSpent: timeSpent,
        }),
      });

      const data = await response.json();

      if (data.status === 200 || data.status === 201) {
        console.log('Progress saved successfully:', data.payload);
        return {
          xpAdded: data.payload?.xpAdded || 0,
          currentLevel: data.payload?.currentLevel || 1,
          levelUp: data.payload?.levelUp || false,
        };
      } else {
        console.error('Failed to save progress:', data);
        return null;
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      return null;
    } finally {
      setSavingProgress(false);
    }
  };

  const steps = ["Materi", "Vocabulary", "Quiz"];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Lesson complete - save progress and show gamification toast
      const result = await saveProgress(true);

      if (result) {
        if (result.xpAdded > 0) {
          // Show XP notification
          toast.success(
            `🎉 Lesson Selesai! Anda mendapatkan +${result.xpAdded} XP`,
            {
              description: result.levelUp
                ? `🚀 Level Up! Anda sekarang Level ${result.currentLevel}!`
                : `Anda saat ini berada di Level ${result.currentLevel}`,
              duration: 5000,
              icon: result.levelUp ? <Trophy className="h-5 w-5 text-yellow-500" /> : <Star className="h-5 w-5 text-orange-500" />,
            }
          );
        } else {
          // Lesson already completed before
          toast.info(
            "Lesson sudah pernah diselesaikan sebelumnya",
            {
              description: `Anda saat ini berada di Level ${result.currentLevel}`,
              duration: 3000,
            }
          );
        }
      } else {
        // Fallback toast if not logged in
        toast.success("Lesson Selesai!", {
          duration: 3000,
        });
      }

      // Redirect after a short delay to let user see the toast
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const handleTranscriptClick = (time: number) => {
    setCurrentVideoTime(time);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
            <h2 className="text-xl font-semibold text-white">Memuat Lesson...</h2>
            <p className="text-gray-400">Mohon tunggu sebentar</p>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center bg-white/10 backdrop-blur-xl border border-red-500/30 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-white">Gagal Memuat Lesson</h2>
            <p className="text-gray-400">{error}</p>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // No lesson data
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Lesson Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">
            Lesson dengan ID {lessonId} tidak ditemukan. Silakan coba lesson lain.
          </p>
          <Button onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Course
          </Button>
        </Card>
      </div>
    );
  }

  // No quiz data - show simplified view
  if (!lesson.quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-2xl font-bold mb-2">Lesson Sedang Dikembangkan</h2>
          <p className="text-gray-600 mb-6">
            Quiz untuk lesson "{lesson.title}" belum tersedia. Silakan kembali nanti.
          </p>
          <Button onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Course
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">{lesson.duration}</span>
              </div>
              {lesson.Course && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {lesson.Course.level}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-3">{lesson.title}</h1>

          <div className="flex items-center gap-4 mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 ${index === currentStep
                    ? "text-blue-600"
                    : index < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                    }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${index === currentStep
                        ? "border-blue-600"
                        : "border-gray-300"
                        }`}
                    >
                      {index + 1}
                    </div>
                  )}
                  <span className="text-sm">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>

          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Step 0: Materi */}
          {currentStep === 0 && (
            <Card className="overflow-hidden border border-white/20 bg-gradient-to-br from-slate-900 via-slate-900/70 to-orange-950 shadow-2xl">
              <div className="p-10 space-y-6">
                <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-transparent to-orange-900/40 blur-3xl pointer-events-none" />
                  <div className="relative flex items-center justify-between gap-4 p-6">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-orange-300">
                        Materi Pembelajaran
                      </p>
                      <div
                        className="flex items-center gap-2 text-3xl font-extrabold leading-tight text-white"
                        style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}
                      >
                        <Sparkles className="text-orange-200" size={28} />
                        <span>{lesson.title}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/90 text-slate-900 px-4 py-2 font-semibold text-xs">
                      {lesson.Course?.level || 'Level'}
                    </div>
                  </div>
                </div>

                {/* Video Player (if available) */}
                {lesson.videoUrl && (
                  <div className="space-y-4">
                    <div ref={videoPlayerRef}>
                      <VideoPlayer
                        videoUrl={lesson.videoUrl}
                        onTimeUpdate={setCurrentVideoTime}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                      />
                    </div>

                    {lesson.transcript && lesson.transcript.length > 0 && (
                      <InteractiveTranscript
                        segments={lesson.transcript}
                        currentTime={currentVideoTime}
                        onSegmentClick={handleTranscriptClick}
                      />
                    )}
                  </div>
                )}

                {/* Lesson Info Cards */}
                <div className="relative grid gap-4 md:grid-cols-3">
                  {[
                    ["Durasi", lesson.duration],
                    ["Fokus", "Vocabulary + Grammar"],
                    ["Metode", "Interaktif"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="relative rounded-2xl bg-white p-4 border-l-4 border-orange-300 shadow-lg"
                    >
                      <p className="text-xs uppercase tracking-widest text-slate-500">
                        {label}
                      </p>
                      <p className="text-lg font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Content Text */}
                <div className="relative rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-inner shadow-orange-100">
                  <p className="text-base leading-relaxed text-slate-900 whitespace-pre-line">
                    {lesson.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="relative flex flex-wrap gap-3">
                  {["Motivasi", "Praktik Harian", "Tips Interaktif"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-full border border-orange-200 bg-white text-sm font-medium tracking-wide text-orange-600"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>

                {/* Next Button */}
                <div className="relative flex justify-end">
                  <Button
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-slate-900 font-bold px-8 py-5 text-lg shadow-lg shadow-orange-200"
                  >
                    Lanjut ke Vocabulary
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 1: Vocabulary */}
          {currentStep === 1 && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
                <h2
                  className="text-3xl font-black mb-2 text-white"
                  style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
                >
                  📚 Vocabulary
                </h2>
                <p className="text-sm font-medium text-blue-100">
                  Pelajari kosakata penting dalam lesson ini
                </p>
              </div>

              <div className="p-8 space-y-4">
                {lesson.vocabulary && lesson.vocabulary.length > 0 ? (
                  lesson.vocabulary.map((item, index) => (
                    <Card
                      key={index}
                      className="p-6 bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3
                          className="text-2xl font-bold text-orange-700"
                          style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                          {item.word}
                        </h3>
                        <span className="text-lg font-semibold text-amber-600 bg-amber-100 px-4 py-1 rounded-full border border-amber-300">
                          {item.meaning}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border-l-4 border-orange-500">
                        <p
                          className="text-sm font-medium text-gray-800 italic"
                          style={{ fontFamily: '"Georgia", serif' }}
                        >
                          💬 Example: "{item.example}"
                        </p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Tidak ada vocabulary untuk lesson ini</p>
                  </div>
                )}
              </div>

              <div className="px-8 pb-8 flex justify-end">
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Lanjut ke Quiz
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Quiz */}
          {currentStep === 2 && lesson.quiz && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-300 shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6">
                <h2
                  className="text-3xl font-black mb-2 text-white"
                  style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
                >
                  🎯 Quiz Time!
                </h2>
                <p className="text-sm font-medium text-purple-100">
                  Uji pemahamanmu dengan menjawab pertanyaan berikut
                </p>
              </div>

              <div className="p-8">
                <div
                  className="text-xl font-bold text-gray-900 mb-8 p-6 bg-white rounded-2xl border-2 border-purple-200 shadow-lg"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  <span className="text-purple-600 mr-2">❓</span>
                  {lesson.quiz.question}
                </div>

                <div className="space-y-4">
                  {lesson.quiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showResult && handleQuizAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${showResult
                        ? index === lesson.quiz!.correctAnswer
                          ? "border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 shadow-lg shadow-green-200"
                          : index === selectedAnswer
                            ? "border-red-500 bg-gradient-to-r from-red-100 to-rose-100 shadow-lg shadow-red-200"
                            : "border-gray-200 bg-white opacity-50"
                        : selectedAnswer === index
                          ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-200"
                          : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${showResult
                            ? index === lesson.quiz!.correctAnswer
                              ? "bg-green-500 text-white"
                              : index === selectedAnswer
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            : selectedAnswer === index
                              ? "bg-purple-500 text-white"
                              : "bg-gray-200 text-gray-600"
                            }`}
                        >
                          {!showResult && String.fromCharCode(65 + index)}
                          {showResult &&
                            index === lesson.quiz!.correctAnswer && (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            )}
                          {showResult &&
                            index === selectedAnswer &&
                            index !== lesson.quiz!.correctAnswer && (
                              <span className="text-white font-bold">✕</span>
                            )}
                        </div>
                        <span
                          className="text-lg font-medium text-gray-800"
                          style={{ fontFamily: '"Inter", sans-serif' }}
                        >
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {showResult && (
                <div className="px-8 pb-6">
                  <div
                    className={`p-6 rounded-xl mb-6 shadow-xl border-2 animate-[bounceIn_0.5s_ease-out] ${selectedAnswer === lesson.quiz!.correctAnswer
                      ? "bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-green-400"
                      : "bg-gradient-to-r from-red-100 via-rose-100 to-pink-100 border-red-400"
                      }`}
                  >
                    <p
                      className={`text-lg font-bold ${selectedAnswer === lesson.quiz!.correctAnswer
                        ? "text-green-800"
                        : "text-red-800"
                        }`}
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      {selectedAnswer === lesson.quiz!.correctAnswer
                        ? "🎉 Sempurna! Jawaban Anda benar!"
                        : "❌ Kurang tepat. Jawaban yang benar adalah: " +
                        lesson.quiz!.options[lesson.quiz!.correctAnswer]}
                    </p>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="px-8 pb-8 flex justify-end animate-[slideUp_1s_ease-out]">
                  <Button
                    onClick={handleNext}
                    disabled={savingProgress}
                    className="gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg disabled:opacity-50"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {savingProgress ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Menyimpan Progress...
                      </>
                    ) : (
                      <>
                        Selesaikan Lesson
                        <CheckCircle2 className="h-5 w-5 animate-[bounce_1s_ease-in-out_infinite]" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
