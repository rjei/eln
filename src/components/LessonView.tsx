import { ArrowLeft, CheckCircle2, BookOpen, ChevronRight, Sparkles, Loader2, AlertCircle, RefreshCw, Trophy, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { useState, useRef, useEffect } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { InteractiveTranscript } from "./InteractiveTranscript";
import { toast } from "sonner";
import apiRequest from "../utils/apiRequest";

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

// Lesson data with content up to lesson 201
const lessonData: Record<number, any> = {
  1: {
    title: "Welcome to English Learning",
    duration: "15 menit",
    videoUrl: "",
    transcript: [
      { id: 1, startTime: 0, endTime: 8, text: "Welcome to English learning! Today we will begin our journey to master the English language.", speaker: "Teacher" },
      { id: 2, startTime: 8, endTime: 15, text: "English is a global language spoken by billions of people around the world.", speaker: "Teacher" },
    ] as TranscriptSegment[],
    content: { text: `Selamat datang di kursus English for Beginners!\n\nKursus ini dirancang khusus untuk Anda yang ingin memulai perjalanan belajar bahasa Inggris dari nol.`, vocabulary: [{ word: "Welcome", meaning: "Selamat datang", example: "Welcome to our class!" }, { word: "Learning", meaning: "Pembelajaran", example: "English learning is fun!" }, { word: "Beginner", meaning: "Pemula", example: "This course is for beginners." }], quiz: { question: 'Apa arti dari kata "Welcome"?', options: ["Selamat tinggal", "Selamat datang", "Terima kasih", "Sampai jumpa"], correctAnswer: 1 } },
  },
  2: { title: "Basic Greetings & Introductions", duration: "12 menit", videoUrl: "", transcript: [{ id: 1, startTime: 0, endTime: 7, text: "Hello everyone! Today we're going to learn about greetings and introductions in English.", speaker: "Teacher" }], content: { text: `Greetings (Salam) adalah cara kita menyapa orang lain dalam bahasa Inggris.`, vocabulary: [{ word: "Hello", meaning: "Halo", example: "Hello! How are you?" }, { word: "Morning", meaning: "Pagi", example: "Good morning, everyone!" }], quiz: { question: "Bagaimana cara menyapa orang di pagi hari dalam bahasa Inggris?", options: ["Good night", "Good morning", "Good evening", "Good afternoon"], correctAnswer: 1 } } },
  3: { title: "Practice: Self Introduction", duration: "10 menit", videoUrl: "", transcript: [{ id: 1, startTime: 0, endTime: 8, text: "Welcome back! In this lesson, we'll practice introducing ourselves in English.", speaker: "Teacher" }], content: { text: `Sekarang saatnya praktek! Mari kita latih kemampuan memperkenalkan diri dalam bahasa Inggris.`, vocabulary: [{ word: "Introduction", meaning: "Perkenalan", example: "Let me make an introduction." }, { word: "Student", meaning: "Pelajar/Mahasiswa", example: "I am a student." }], quiz: { question: 'Apa bahasa Inggris dari "Senang bertemu denganmu"?', options: ["See you later", "Nice to meet you", "Good bye", "How are you"], correctAnswer: 1 } } },
  4: { title: "Present Perfect Tense", duration: "18 menit", videoUrl: "", transcript: [{ id: 1, startTime: 0, endTime: 10, text: "Today we're learning about Present Perfect Tense.", speaker: "Teacher" }], content: { text: `Present Perfect Tense digunakan untuk menyatakan tindakan yang telah selesai di waktu yang tidak spesifik.`, vocabulary: [{ word: "Already", meaning: "Sudah", example: "I have already finished my homework." }, { word: "Yet", meaning: "Belum", example: "Have you finished yet?" }], quiz: { question: "Mana kalimat Present Perfect yang benar?", options: ["I have went to London.", "I have go to London.", "I have gone to London.", "I has gone to London."], correctAnswer: 2 } } },
  5: { title: "Business & Professional Vocabulary", duration: "16 menit", videoUrl: "", content: { text: `Vocabulary profesional sangat penting untuk berkomunikasi di lingkungan kerja.`, vocabulary: [{ word: "Deadline", meaning: "Tenggat waktu", example: "The deadline for this project is Monday." }, { word: "Colleague", meaning: "Rekan kerja", example: "My colleagues are very supportive." }], quiz: { question: 'Apa arti dari "deadline" dalam konteks bisnis?', options: ["Waktu istirahat", "Tenggat waktu", "Waktu mulai", "Waktu kerja"], correctAnswer: 1 } } },
  6: { title: "Small Talk & Social Situations", duration: "16 menit", videoUrl: "", content: { text: `Small talk adalah percakapan ringan yang penting untuk membangun hubungan sosial dan profesional.`, vocabulary: [{ word: "Lately", meaning: "Akhir-akhir ini", example: "Have you been busy lately?" }, { word: "Catch up", meaning: "Mengobrol/berbincang lagi", example: "Let's catch up over coffee sometime." }], quiz: { question: "Frasa mana yang tepat untuk membuka small talk?", options: ["What is your salary?", "How's your day going?", "How old are you?", "Where do you live exactly?"], correctAnswer: 1 } } },
  7: { title: "Numbers 1-100", duration: "10 menit", content: { text: `Mari mulai menghafal angka 1 sampai 100 dalam bahasa Inggris.`, vocabulary: [{ word: "One", meaning: "Satu", example: "One apple" }, { word: "Twenty", meaning: "Dua puluh", example: "Twenty minutes" }], quiz: { question: "Bagaimana cara mengucapkan angka 47 dalam bahasa Inggris?", options: ["Four ten seven", "Forty seven", "Fourty seven", "Seven forty"], correctAnswer: 1 } } },
  8: { title: "Colors & Shapes", duration: "8 menit", content: { text: `Warna dan bentuk adalah kata dasar yang sering muncul saat mendeskripsikan lingkungan.`, vocabulary: [{ word: "Red", meaning: "Merah", example: "The apple is red" }, { word: "Circle", meaning: "Lingkaran", example: "Draw a circle" }], quiz: { question: "Bagaimana cara mengatakan 'lingkaran hijau' dalam bahasa Inggris?", options: ["Green circle", "Circle green", "Green round", "Circle of green"], correctAnswer: 0 } } },
  9: { title: "Quiz: Numbers & Colors", duration: "15 menit", content: { text: `Kombinasikan angka dan warna dalam satu soal.`, vocabulary: [{ word: "Describe", meaning: "Menjelaskan", example: "Describe the purple circle" }], quiz: { question: "Apa jawaban yang benar untuk angka 63 dalam bahasa Inggris?", options: ["Sixty-three", "Six-three", "Three sixty", "Sixty free"], correctAnswer: 0 } } },
  10: { title: "Past Perfect & Future Perfect", duration: "18 menit", content: { text: `Past Perfect digunakan untuk mengekspresikan aksi yang telah selesai sebelum aksi lain terjadi.`, vocabulary: [{ word: "Already", meaning: "Sudah", example: "She had already left when we arrived." }], quiz: { question: "Mana kalimat Future Perfect yang benar?", options: ["She will have go home by 9 PM.", "She will have gone home by 9 PM.", "She will had gone home by 9 PM.", "She had will have gone home by 9 PM."], correctAnswer: 1 } } },
  11: { title: "Conditional Sentences (Type 1-3)", duration: "15 menit", content: { text: `Conditional Type 1 (real present/future): If + present simple, will + verb.`, vocabulary: [{ word: "If", meaning: "Jika", example: "If it rains, we will stay home." }], quiz: { question: "Pilih kalimat Conditional Type 2 yang benar:", options: ["If I will win, I'll celebrate tomorrow.", "If I won the lottery, I would buy a house.", "If I had known, I would call you now.", "If he goes, he would be happy."], correctAnswer: 1 } } },
  12: { title: "Passive Voice", duration: "14 menit", content: { text: `Passive Voice digunakan saat fokus pada objek yang menerima aksi.`, vocabulary: [{ word: "is/are", meaning: "adalah", example: "The letter is sent every morning." }], quiz: { question: "Pilih kalimat passive yang benar:", options: ["A new movie will released next week.", "A new movie is released next week.", "A new movie will be released next week.", "A new movie released next week."], correctAnswer: 2 } } },
  13: { title: "Reported Speech", duration: "16 menit", content: { text: `Reported speech atau indirect speech dipakai untuk menyampaikan kembali apa yang dikatakan orang lain.`, vocabulary: [{ word: "Said", meaning: "Mengatakan", example: "He said that he was ready." }], quiz: { question: "Ubah kalimat berikut ke reported speech: She said, 'I can help you.'", options: ["She said she could help me.", "She said she can help me.", "She tell me she could help.", "She told I could help her."], correctAnswer: 0 } } },
  101: { title: "Professional Email Writing", duration: "20 menit", content: { text: `Email profesional adalah keterampilan penting dalam dunia bisnis modern.`, vocabulary: [{ word: "Inquire", meaning: "Menanyakan", example: "I am writing to inquire about the position." }], quiz: { question: "What is the most professional way to start a business email?", options: ["Hey, what's up?", "Dear Mr. Smith,", "Yo!", "Hi there!"], correctAnswer: 1 } } },
  201: { title: "TOEFL Reading Strategies", duration: "25 menit", content: { text: `TOEFL Reading section mengukur kemampuan Anda memahami teks akademik dalam bahasa Inggris.`, vocabulary: [{ word: "Inference", meaning: "Kesimpulan", example: "Make an inference based on the passage." }], quiz: { question: "How much time should you spend on each TOEFL reading passage?", options: ["10 minutes", "20 minutes", "30 minutes", "40 minutes"], correctAnswer: 1 } } },
};

export function LessonView({ lessonId, onBack, onComplete }: LessonViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const lesson = lessonData[lessonId as keyof typeof lessonData];

  useEffect(() => {
    if (lesson) {
      timerRef.current = setInterval(() => { setTimeSpent(prev => prev + 1); }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [lesson]);

  const saveProgress = async (completed: boolean): Promise<{ xpAdded: number; currentLevel: number; levelUp: boolean } | null> => {
    const token = localStorage.getItem('token');
    if (!token || !lesson) return null;
    setSavingProgress(true);
    try {
      const response = await apiRequest.post('/progress', {
        lessonId: lessonId,
        courseId: lesson.courseId || 1,
        progress: completed ? 100 : Math.round((currentStep / 3) * 100),
        completed: completed,
        timeSpent: timeSpent,
      });
      if (response.status === 200 || response.status === 201) {
        return { xpAdded: response.payload?.xpAdded || 0, currentLevel: response.payload?.currentLevel || 1, levelUp: response.payload?.levelUp || false };
      }
      return null;
    } catch (err) { console.error('Error saving progress:', err); return null; }
    finally { setSavingProgress(false); }
  };

  const steps = ["Materi", "Vocabulary", "Quiz"];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const handleQuizAnswer = (index: number) => { setSelectedAnswer(index); setShowResult(true); };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const result = await saveProgress(true);
      if (result) {
        if (result.xpAdded > 0) {
          toast.success(`🎉 Lesson Selesai! Anda mendapatkan +${result.xpAdded} XP`, {
            description: result.levelUp ? `🚀 Level Up! Anda sekarang Level ${result.currentLevel}!` : `Anda saat ini berada di Level ${result.currentLevel}`,
            duration: 5000,
            icon: result.levelUp ? <Trophy className="h-5 w-5 text-yellow-500" /> : <Star className="h-5 w-5 text-orange-500" />,
          });
        } else {
          toast.info("Lesson sudah pernah diselesaikan sebelumnya", { description: `Anda saat ini berada di Level ${result.currentLevel}`, duration: 3000 });
        }
      } else {
        toast.success("Lesson Selesai!", { duration: 3000 });
      }
      setTimeout(() => { onComplete(); }, 1500);
    }
  };

  const handleTranscriptClick = (time: number) => { setCurrentVideoTime(time); };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Lesson Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Lesson dengan ID {lessonId} tidak ditemukan. Silakan coba lesson lain.</p>
          <Button onClick={onBack} className="gap-2"><ArrowLeft className="h-4 w-4" />Kembali ke Course</Button>
        </Card>
      </div>
    );
  }

  if (!lesson.content?.quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-2xl font-bold mb-2">Lesson Sedang Dikembangkan</h2>
          <p className="text-gray-600 mb-6">Quiz untuk lesson "{lesson.title}" belum tersedia. Silakan kembali nanti.</p>
          <Button onClick={onBack} className="gap-2"><ArrowLeft className="h-4 w-4" />Kembali ke Course</Button>
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
            <Button variant="ghost" onClick={onBack} className="gap-2"><ArrowLeft className="h-4 w-4" />Kembali</Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /><span className="text-sm text-gray-600">{lesson.duration}</span></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3">{lesson.title}</h1>
          <div className="flex items-center gap-4 mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${index === currentStep ? "text-blue-600" : index < currentStep ? "text-green-600" : "text-gray-400"}`}>
                  {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${index === currentStep ? "border-blue-600" : "border-gray-300"}`}>{index + 1}</div>}
                  <span className="text-sm">{step}</span>
                </div>
                {index < steps.length - 1 && <ChevronRight className="h-4 w-4 text-gray-400" />}
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
                      <p className="text-sm uppercase tracking-widest text-orange-300">Materi Pembelajaran</p>
                      <div className="flex items-center gap-2 text-3xl font-extrabold leading-tight text-white" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
                        <Sparkles className="text-orange-200" size={28} /><span>{lesson.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {lesson.videoUrl && (
                  <div className="space-y-4">
                    <div ref={videoPlayerRef}><VideoPlayer videoUrl={lesson.videoUrl} onTimeUpdate={setCurrentVideoTime} onPlay={() => setIsVideoPlaying(true)} onPause={() => setIsVideoPlaying(false)} /></div>
                    {lesson.transcript && lesson.transcript.length > 0 && <InteractiveTranscript segments={lesson.transcript} currentTime={currentVideoTime} onSegmentClick={handleTranscriptClick} />}
                  </div>
                )}
                <div className="relative rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-inner shadow-orange-100">
                  <p className="text-base leading-relaxed text-slate-900 whitespace-pre-line">{lesson.content?.text}</p>
                </div>
                <div className="relative flex justify-end">
                  <Button onClick={handleNext} className="gap-2 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-slate-900 font-bold px-8 py-5 text-lg shadow-lg shadow-orange-200">Lanjut ke Vocabulary<ChevronRight className="h-5 w-5" /></Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 1: Vocabulary */}
          {currentStep === 1 && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
                <h2 className="text-3xl font-black mb-2 text-white" style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}>📚 Vocabulary</h2>
                <p className="text-sm font-medium text-blue-100">Pelajari kosakata penting dalam lesson ini</p>
              </div>
              <div className="p-8 space-y-4">
                {lesson.content?.vocabulary?.map((item: VocabularyItem, index: number) => (
                  <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-orange-700" style={{ fontFamily: '"Poppins", sans-serif' }}>{item.word}</h3>
                      <span className="text-lg font-semibold text-amber-600 bg-amber-100 px-4 py-1 rounded-full border border-amber-300">{item.meaning}</span>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border-l-4 border-orange-500">
                      <p className="text-sm font-medium text-gray-800 italic" style={{ fontFamily: '"Georgia", serif' }}>💬 Example: "{item.example}"</p>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="px-8 pb-8 flex justify-end">
                <Button onClick={handleNext} className="gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>Lanjut ke Quiz<ChevronRight className="h-5 w-5" /></Button>
              </div>
            </Card>
          )}

          {/* Step 2: Quiz */}
          {currentStep === 2 && lesson.content?.quiz && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-300 shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6">
                <h2 className="text-3xl font-black mb-2 text-white" style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}>🎯 Quiz Time!</h2>
                <p className="text-sm font-medium text-purple-100">Uji pemahamanmu dengan menjawab pertanyaan berikut</p>
              </div>
              <div className="p-8">
                <div className="text-xl font-bold text-gray-900 mb-8 p-6 bg-white rounded-2xl border-2 border-purple-200 shadow-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  <span className="text-purple-600 mr-2">❓</span>{lesson.content.quiz.question}
                </div>
                <div className="space-y-4">
                  {lesson.content.quiz.options.map((option: string, index: number) => (
                    <button key={index} onClick={() => !showResult && handleQuizAnswer(index)} disabled={showResult}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${showResult
                        ? index === lesson.content.quiz.correctAnswer ? "border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 shadow-lg shadow-green-200"
                          : index === selectedAnswer ? "border-red-500 bg-gradient-to-r from-red-100 to-rose-100 shadow-lg shadow-red-200" : "border-gray-200 bg-white opacity-50"
                        : selectedAnswer === index ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-200" : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                        }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${showResult
                          ? index === lesson.content.quiz.correctAnswer ? "bg-green-500 text-white" : index === selectedAnswer ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
                          : selectedAnswer === index ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600"
                          }`}>
                          {!showResult && String.fromCharCode(65 + index)}
                          {showResult && index === lesson.content.quiz.correctAnswer && <CheckCircle2 className="h-5 w-5 text-white" />}
                          {showResult && index === selectedAnswer && index !== lesson.content.quiz.correctAnswer && <span className="text-white font-bold">✕</span>}
                        </div>
                        <span className="text-lg font-medium text-gray-800" style={{ fontFamily: '"Inter", sans-serif' }}>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {showResult && (
                <div className="px-8 pb-6">
                  <div className={`p-6 rounded-xl mb-6 shadow-xl border-2 ${selectedAnswer === lesson.content.quiz.correctAnswer ? "bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-green-400" : "bg-gradient-to-r from-red-100 via-rose-100 to-pink-100 border-red-400"}`}>
                    <p className={`text-lg font-bold ${selectedAnswer === lesson.content.quiz.correctAnswer ? "text-green-800" : "text-red-800"}`} style={{ fontFamily: '"Poppins", sans-serif' }}>
                      {selectedAnswer === lesson.content.quiz.correctAnswer ? "🎉 Sempurna! Jawaban Anda benar!" : "❌ Kurang tepat. Jawaban yang benar adalah: " + lesson.content.quiz.options[lesson.content.quiz.correctAnswer]}
                    </p>
                  </div>
                </div>
              )}
              {showResult && (
                <div className="px-8 pb-8 flex justify-end">
                  <Button onClick={handleNext} disabled={savingProgress} className="gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg disabled:opacity-50" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    {savingProgress ? <><Loader2 className="h-5 w-5 animate-spin" />Menyimpan Progress...</> : <>Selesaikan Lesson<CheckCircle2 className="h-5 w-5" /></>}
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
