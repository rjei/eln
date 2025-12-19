import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Lightbulb, Trophy } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { toast } from "sonner@2.0.3";
import { Progress } from "../ui/progress";
import Shuffle from "../ui/Shuffle";

interface WordScrambleGameProps {
  onBack: () => void;
}

const WORDS = [
  {
    word: "COMPUTER",
    hint: "A machine that processes data",
    category: "Technology",
  },
  {
    word: "ELEPHANT",
    hint: "A large animal with a trunk",
    category: "Animals",
  },
  {
    word: "BIRTHDAY",
    hint: "Annual celebration of being born",
    category: "Events",
  },
  {
    word: "MOUNTAIN",
    hint: "A very high natural elevation",
    category: "Nature",
  },
  {
    word: "HOSPITAL",
    hint: "Place where sick people are treated",
    category: "Buildings",
  },
  {
    word: "FOOTBALL",
    hint: "Popular sport played with a round ball",
    category: "Sports",
  },
  { word: "UMBRELLA", hint: "Protection from rain", category: "Objects" },
  { word: "CUCUMBER", hint: "A green vegetable", category: "Food" },
  {
    word: "BLANKET",
    hint: "Something to keep you warm in bed",
    category: "Objects",
  },
  {
    word: "RAINBOW",
    hint: "Colorful arc in the sky after rain",
    category: "Nature",
  },
];

export function WordScrambleGame({ onBack }: WordScrambleGameProps) {
  const [currentWord, setCurrentWord] = useState({
    word: "",
    hint: "",
    category: "",
  });
  const [scrambledWord, setScrambledWord] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);

  const MAX_ROUNDS = 10;

  useEffect(() => {
    loadNewWord();
  }, []);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameActive]);

  const scrambleWord = (word: string) => {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  const loadNewWord = () => {
    const availableWords = WORDS.filter((w) => !usedWords.includes(w.word));
    if (availableWords.length === 0) {
      // All words used, game complete
      setGameActive(false);
      toast.success(`🎉 Game Selesai! Skor akhir: ${score}`);
      return;
    }

    const newWord =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(newWord);
    setScrambledWord(scrambleWord(newWord.word));
    setUserAnswer("");
    setShowHint(false);
    setTimeLeft(30);
    setGameActive(true);
  };

  const handleTimeUp = () => {
    toast.error(`⏰ Waktu habis! Kata yang benar: ${currentWord.word}`);
    setTimeout(() => {
      if (round < MAX_ROUNDS) {
        setRound(round + 1);
        setUsedWords([...usedWords, currentWord.word]);
        loadNewWord();
      } else {
        setGameActive(false);
        toast.success(`Game Selesai! Skor akhir: ${score}/${MAX_ROUNDS}`);
      }
    }, 2000);
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      toast.error("Masukkan jawaban terlebih dahulu!");
      return;
    }

    if (userAnswer.toUpperCase() === currentWord.word) {
      const points = showHint ? 5 : 10;
      setScore(score + points);
      toast.success(`✅ Benar! +${points} poin`);

      if (round < MAX_ROUNDS) {
        setTimeout(() => {
          setRound(round + 1);
          setUsedWords([...usedWords, currentWord.word]);
          loadNewWord();
        }, 1000);
      } else {
        setGameActive(false);
        toast.success(
          `🏆 Game Selesai! Skor akhir: ${score + points}/${MAX_ROUNDS * 10}`
        );
      }
    } else {
      toast.error("Salah! Coba lagi");
      setUserAnswer("");
    }
  };

  const handleSkip = () => {
    toast.info(`Kata yang benar: ${currentWord.word}`);
    if (round < MAX_ROUNDS) {
      setTimeout(() => {
        setRound(round + 1);
        setUsedWords([...usedWords, currentWord.word]);
        loadNewWord();
      }, 1500);
    } else {
      setGameActive(false);
      toast.success(`Game Selesai! Skor akhir: ${score}/${MAX_ROUNDS * 10}`);
    }
  };

  const handleNewGame = () => {
    setScore(0);
    setRound(1);
    setUsedWords([]);
    setGameActive(true);
    loadNewWord();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-violet-100 to-purple-50 py-4 sm:py-8 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 bg-white/90 hover:bg-white hover:-translate-x-1 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>

          <div className="text-center">
            <h1
              className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent animate-gradient drop-shadow-lg"
              style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
              }}
            >
              <Shuffle
                text="🔀 Word Scramble 🎯"
                tag="span"
                shuffleDirection="right"
                duration={0.5}
                stagger={0.05}
                triggerOnce={false}
                threshold={0}
              />
            </h1>
            <p
              className="text-xs sm:text-sm text-purple-800 font-bold mt-1"
              style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
              }}
            >
              Susun huruf menjadi kata yang benar!
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewGame}
            className="bg-white/90 hover:bg-white hover:rotate-180 transition-all duration-500 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <RotateCcw className="h-5 w-5 text-purple-600" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 animate-slide-up">
          <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-2xl sm:text-3xl mb-1 font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {round}/{MAX_ROUNDS}
            </div>
            <div className="text-xs sm:text-sm text-purple-700 font-bold">
              🎯 Round
            </div>
          </Card>
          <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-fuchsia-50 to-pink-50 border-2 border-fuchsia-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-2xl sm:text-3xl mb-1 font-black bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              {score}
            </div>
            <div className="text-xs sm:text-sm text-fuchsia-700 font-bold">
              ⭐ Skor
            </div>
          </Card>
          <Card
            className={`p-3 sm:p-4 text-center border-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ${
              timeLeft <= 10
                ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-400 animate-pulse"
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300"
            }`}
          >
            <div
              className={`text-2xl sm:text-3xl mb-1 font-black ${
                timeLeft <= 10 ? "text-red-600" : "text-blue-600"
              }`}
            >
              {timeLeft}s
            </div>
            <div
              className={`text-xs sm:text-sm font-bold ${
                timeLeft <= 10 ? "text-red-700" : "text-blue-700"
              }`}
            >
              ⏱️ Waktu
            </div>
          </Card>
        </div>

        {/* Timer Progress */}
        <div className="mb-6 animate-fade-in">
          <Progress
            value={(timeLeft / 30) * 100}
            className={`h-3 transition-all duration-300 ${
              timeLeft <= 10 ? "animate-pulse" : ""
            }`}
          />
        </div>

        {/* Game Area */}
        <Card className="p-6 sm:p-8 mb-6 bg-white border-4 border-purple-200 shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 animate-bounce-in">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-400 to-violet-400 text-black font-bold rounded-full text-sm mb-6 shadow-lg animate-pulse">
              🏷️ {currentWord.category}
            </div>
            <div className="text-2xl sm:text-4xl tracking-widest mb-6 select-none">
              {scrambledWord.split("").map((letter, i) => (
                <span
                  key={i}
                  className="inline-block mx-0.5 sm:mx-1 px-2 sm:px-3 py-2 sm:py-3 bg-gradient-to-br from-purple-200 to-violet-200 text-purple-800 rounded-xl font-black shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-200 animate-bounce-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {showHint && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 border-3 border-yellow-400 rounded-xl shadow-xl animate-bounce-in">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-yellow-600 mt-0.5 animate-pulse" />
                <div>
                  <div className="text-sm text-yellow-900 font-black mb-1">
                    💡 Hint:
                  </div>
                  <div className="text-yellow-800 font-semibold text-base">
                    {currentWord.hint}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="✍️ Ketik jawaban di sini..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              disabled={!gameActive}
              className="text-center text-xl h-16 border-3 border-purple-300 focus:border-purple-500 font-bold text-purple-800 shadow-lg"
              autoFocus
            />

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button
                onClick={handleSubmit}
                disabled={!gameActive}
                className="flex-1 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 text-black font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-base h-12"
                style={{
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
                }}
              >
                ✅ Cek Jawaban
              </Button>
              {!showHint && (
                <Button
                  onClick={() => setShowHint(true)}
                  variant="outline"
                  disabled={!gameActive}
                  className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-0 h-12"
                  style={{
                    fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
                  }}
                >
                  <Lightbulb className="h-4 w-4" />
                  💡 Hint (-5 poin)
                </Button>
              )}
            </div>

            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={!gameActive}
              className="w-full bg-gray-100 hover:bg-gray-200 font-semibold border-2 border-gray-300 transition-all duration-300 hover:scale-105"
            >
              ⏭️ Skip
            </Button>
          </div>
        </Card>

        {/* Game Over */}
        {!gameActive && round >= MAX_ROUNDS && (
          <Card className="p-8 text-center bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 border-4 border-purple-700 shadow-2xl animate-bounce-in">
            <div className="text-8xl mb-4 animate-bounce">🏆</div>
            <h2
              className="text-3xl sm:text-4xl mb-3 font-black text-black drop-shadow-lg"
              style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
              }}
            >
              GAME SELESAI!
            </h2>
            <div className="text-6xl sm:text-7xl mb-4 font-black text-black drop-shadow-2xl animate-pulse">
              {score}/{MAX_ROUNDS * 10}
            </div>
            <p
              className="text-black text-xl sm:text-2xl mb-6 font-bold drop-shadow-md"
              style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
              }}
            >
              {score >= MAX_ROUNDS * 8
                ? "🌟 LUAR BIASA! SEMPURNA! 🌟"
                : score >= MAX_ROUNDS * 5
                ? "👏 BAGUS SEKALI! HEBAT! 👏"
                : "💪 TETAP SEMANGAT! COBA LAGI! 💪"}
            </p>
            <Button
              onClick={handleNewGame}
              size="lg"
              className="bg-white text-purple-700 hover:bg-gray-100 font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 text-lg px-8 py-6"
              style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
              }}
            >
              🎮 Main Lagi
            </Button>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-r from-purple-100 via-violet-100 to-fuchsia-100 border-4 border-purple-300 shadow-xl animate-slide-up animation-delay-100">
          <h3 className="mb-4 text-lg font-black text-purple-800 flex items-center gap-2">
            🎮 Cara Bermain:
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-semibold">
            <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
              <span className="text-purple-600 font-black text-lg">•</span>
              <span>Susun huruf yang diacak menjadi kata yang benar</span>
            </li>
            <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
              <span className="text-violet-600 font-black text-lg">•</span>
              <span>Jawaban benar = 10 poin, dengan hint = 5 poin</span>
            </li>
            <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
              <span className="text-fuchsia-600 font-black text-lg">•</span>
              <span>Waktu 30 detik per kata</span>
            </li>
            <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
              <span className="text-pink-600 font-black text-lg">•</span>
              <span>Selesaikan 10 kata untuk menyelesaikan game</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
