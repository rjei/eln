import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Heart, Loader2, Trophy, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "sonner";
import Shuffle from "../ui/Shuffle";

interface HangmanGameProps {
  onBack: () => void;
}

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

// Fallback words in case API fails
const FALLBACK_WORDS = [
  { word: "BEAUTIFUL", hint: "Attractive or pleasing", category: "Adjective" },
  { word: "CHOCOLATE", hint: "Sweet brown food", category: "Food" },
  { word: "ADVENTURE", hint: "Exciting experience", category: "Noun" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function HangmanGame({ onBack }: HangmanGameProps) {
  const [currentWord, setCurrentWord] = useState({
    word: "",
    hint: "",
    category: "",
  });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const MAX_WRONG = 6;

  // Fetch word from API
  const fetchQuestion = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/games/hangman/question`);
      const data = await response.json();

      if (data.status === 200 && data.payload?.content) {
        const content = data.payload.content;
        console.log("[Hangman] Got word from API:", content.word);
        return {
          word: content.word.toUpperCase(),
          hint: content.clue || "Guess the word!",
          category: data.payload.difficulty?.charAt(0).toUpperCase() + data.payload.difficulty?.slice(1) || "Word"
        };
      }
      throw new Error("Invalid response");
    } catch (error) {
      console.error("[Hangman] API error, using fallback:", error);
      return FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
    }
  };

  // Save score and get level up info
  const saveScore = async (pointsEarned: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[Hangman] No token, skipping score save');
      return null;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/games/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gameType: 'hangman',
          score: pointsEarned,
          timeSpent: 0
        })
      });

      const data = await response.json();
      if (data.status === 201) {
        console.log('[Hangman] Score saved:', data.payload);
        return data.payload;
      }
      return null;
    } catch (error) {
      console.error('[Hangman] Error saving score:', error);
      return null;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadNewWord();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || loading) return;

      const key = e.key.toUpperCase();
      if (ALPHABET.includes(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver, guessedLetters, currentWord, loading]);

  useEffect(() => {
    if (gameOver || loading) return;

    const wordLetters = currentWord.word.split("").filter((l) => l !== " ");
    const uniqueLetters = new Set(wordLetters);
    const correctGuesses = guessedLetters.filter((l) => uniqueLetters.has(l));

    if (correctGuesses.length === uniqueLetters.size && currentWord.word) {
      handleWin();
    }
  }, [guessedLetters, currentWord, loading]);

  const handleWin = async () => {
    setWon(true);
    setGameOver(true);
    setScore(score + 1);

    // Calculate points based on remaining lives
    const livesRemaining = MAX_WRONG - wrongGuesses;
    const pointsEarned = 50 + (livesRemaining * 10); // Base 50 + bonus per life

    // Save score to backend
    const result = await saveScore(pointsEarned);

    if (result) {
      if (result.isLevelUp) {
        // Level Up notification
        toast.success(
          `🚀 LEVEL UP! Sekarang Level ${result.newLevel}!`,
          {
            description: `+${result.xpAdded} XP | Total: ${result.totalPoints} XP`,
            duration: 5000,
          }
        );
      } else {
        // Normal win notification
        toast.success(
          `🎉 Menang! +${result.xpAdded} XP`,
          {
            description: `Level ${result.newLevel} | Total: ${result.totalPoints} XP`,
            duration: 4000,
          }
        );
      }
    } else {
      toast.success("🎉 Selamat! Kamu berhasil menebak kata!");
    }
  };

  const loadNewWord = async () => {
    setLoading(true);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setWon(false);

    const newWord = await fetchQuestion();
    setCurrentWord(newWord);
    setLoading(false);
  };

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || gameOver) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!currentWord.word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= MAX_WRONG) {
        setGameOver(true);
        toast.error(`Game Over! Kata yang benar: ${currentWord.word}`);
      }
    }
  };

  const renderWord = () => {
    return currentWord.word.split("").map((letter, i) => {
      if (letter === " ") {
        return <span key={i} className="mx-2" />;
      }
      return (
        <span
          key={i}
          className="inline-block w-12 h-16 border-b-4 border-blue-600 mx-1 text-3xl text-center flex items-center justify-center font-black text-blue-700 animate-bounce-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {guessedLetters.includes(letter) ? letter : ""}
        </span>
      );
    });
  };

  const renderHangman = () => {
    const parts = [
      // Head
      <circle
        key="head"
        cx="140"
        cy="60"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        className="animate-bounce-in"
      />,
      // Body
      <line
        key="body"
        x1="140"
        y1="80"
        x2="140"
        y2="130"
        stroke="currentColor"
        strokeWidth="4"
        className="animate-bounce-in"
      />,
      // Left arm
      <line
        key="leftarm"
        x1="140"
        y1="95"
        x2="110"
        y2="110"
        stroke="currentColor"
        strokeWidth="4"
        className="animate-bounce-in"
      />,
      // Right arm
      <line
        key="rightarm"
        x1="140"
        y1="95"
        x2="170"
        y2="110"
        stroke="currentColor"
        strokeWidth="4"
        className="animate-bounce-in"
      />,
      // Left leg
      <line
        key="leftleg"
        x1="140"
        y1="130"
        x2="115"
        y2="160"
        stroke="currentColor"
        strokeWidth="4"
        className="animate-bounce-in"
      />,
      // Right leg
      <line
        key="rightleg"
        x1="140"
        y1="130"
        x2="165"
        y2="160"
        stroke="currentColor"
        strokeWidth="4"
        className="animate-bounce-in"
      />,
    ];

    return (
      <svg
        width="200"
        height="200"
        className={`mx-auto mb-6 transition-all duration-300 ${wrongGuesses >= 4 ? "text-red-600 animate-pulse" : "text-gray-700"
          }`}
      >
        {/* Gallows */}
        <line
          x1="20"
          y1="180"
          x2="180"
          y2="180"
          stroke="currentColor"
          strokeWidth="4"
        />
        <line
          x1="50"
          y1="180"
          x2="50"
          y2="20"
          stroke="currentColor"
          strokeWidth="4"
        />
        <line
          x1="50"
          y1="20"
          x2="140"
          y2="20"
          stroke="currentColor"
          strokeWidth="4"
        />
        <line
          x1="140"
          y1="20"
          x2="140"
          y2="40"
          stroke="currentColor"
          strokeWidth="4"
        />

        {/* Body parts */}
        {parts.slice(0, wrongGuesses)}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 py-4 sm:py-8 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
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
            <Shuffle
              text="🎭 Hangman ☠️"
              tag="h1"
              className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg"
              style={{ fontFamily: '"Impact", "Arial Black", sans-serif' }}
              shuffleDirection="right"
              duration={0.5}
              stagger={0.05}
              triggerOnce={false}
              threshold={0}
            />
            <p
              className="text-xs sm:text-sm text-orange-800 font-bold mt-1"
              style={{ fontFamily: '"Impact", "Arial Black", sans-serif' }}
            >
              Tebak kata sebelum terlambat!
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={loadNewWord}
            className="bg-white/90 hover:bg-white hover:rotate-180 transition-all duration-500 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <RotateCcw className="h-5 w-5 text-orange-600" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 animate-slide-up">
          <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-2xl sm:text-3xl mb-1 font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {score}
            </div>
            <div className="text-xs sm:text-sm text-green-700 font-bold">
              ✅ Kata Berhasil
            </div>
          </Card>
          <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-400 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex gap-1 justify-center mb-2">
              {Array.from({ length: MAX_WRONG }).map((_, i) => (
                <Heart
                  key={i}
                  className={`h-5 w-5 transition-all duration-300 ${i < MAX_WRONG - wrongGuesses
                    ? "fill-red-500 text-red-500 animate-pulse"
                    : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <div className="text-xs sm:text-sm text-red-700 font-bold">
              ❤️ Nyawa
            </div>
          </Card>
          <Card
            className={`p-3 sm:p-4 text-center border-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ${wrongGuesses >= 4
              ? "bg-gradient-to-br from-red-100 to-orange-100 border-red-500 animate-pulse"
              : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-400"
              }`}
          >
            <div
              className={`text-2xl sm:text-3xl mb-1 font-black ${wrongGuesses >= 4 ? "text-red-600" : "text-blue-600"
                }`}
            >
              {wrongGuesses}/{MAX_WRONG}
            </div>
            <div
              className={`text-xs sm:text-sm font-bold ${wrongGuesses >= 4 ? "text-red-700" : "text-blue-700"
                }`}
            >
              ❌ Kesalahan
            </div>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="p-6 sm:p-8 mb-6 bg-white border-4 border-orange-200 shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 animate-bounce-in">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-400 text-black font-bold rounded-full text-sm mb-4 shadow-lg animate-pulse">
              🏷️ {currentWord.category}
            </div>
            <div className="text-gray-700 mb-6 font-semibold text-sm sm:text-base">
              💡 Hint: {currentWord.hint}
            </div>
          </div>

          {renderHangman()}

          <div className="flex justify-center flex-wrap mb-8 min-h-[64px]">
            {renderWord()}
          </div>

          {gameOver && (
            <div className="mb-6 text-center animate-bounce-in">
              {won ? (
                <div className="p-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 border-4 border-green-700 rounded-2xl shadow-2xl">
                  <div className="text-6xl mb-3 animate-bounce">🎉</div>
                  <p
                    className="text-black text-2xl font-black drop-shadow-lg mb-2"
                    style={{
                      fontFamily: '"Impact", "Arial Black", sans-serif',
                    }}
                  >
                    SELAMAT!
                  </p>
                  <p
                    className="text-black text-base font-bold"
                    style={{
                      fontFamily: '"Impact", "Arial Black", sans-serif',
                    }}
                  >
                    Kamu berhasil menebak kata!
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border-4 border-red-800 rounded-2xl shadow-2xl">
                  <div className="text-6xl mb-3 animate-pulse">☠️</div>
                  <p
                    className="text-black text-2xl font-black drop-shadow-lg mb-3"
                    style={{
                      fontFamily: '"Impact", "Arial Black", sans-serif',
                    }}
                  >
                    GAME OVER!
                  </p>
                  <p
                    className="text-black text-sm font-semibold mb-2"
                    style={{
                      fontFamily: '"Impact", "Arial Black", sans-serif',
                    }}
                  >
                    Kata yang benar:
                  </p>
                  <p
                    className="text-black text-3xl font-black drop-shadow-lg"
                    style={{
                      fontFamily: '"Impact", "Arial Black", sans-serif',
                    }}
                  >
                    {currentWord.word}
                  </p>
                </div>
              )}
              <Button
                onClick={loadNewWord}
                className="mt-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-black font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                size="lg"
                style={{ fontFamily: '"Impact", "Arial Black", sans-serif' }}
              >
                🎮 Main Kata Baru
              </Button>
            </div>
          )}

          {/* Keyboard */}
          <div className="space-y-2">
            {[
              ALPHABET.slice(0, 9),
              ALPHABET.slice(9, 18),
              ALPHABET.slice(18, 26),
            ].map((row, i) => (
              <div key={i} className="flex gap-2 justify-center flex-wrap">
                {row.map((letter) => {
                  const isGuessed = guessedLetters.includes(letter);
                  const isCorrect = currentWord.word.includes(letter);

                  return (
                    <Button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={isGuessed || gameOver}
                      className={`w-10 h-10 p-0 font-black text-base transition-all duration-300 ${isGuessed
                        ? isCorrect
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 hover:bg-green-500 text-black shadow-lg animate-bounce-in"
                          : "bg-gradient-to-br from-red-500 to-rose-600 hover:bg-red-500 text-black shadow-lg animate-bounce-in"
                        : "hover:scale-110 hover:bg-blue-50 hover:border-blue-400"
                        }`}
                      variant={isGuessed ? "default" : "outline"}
                    >
                      {letter}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 border-4 border-orange-300 shadow-xl animate-slide-up animation-delay-100">
          <h3 className="mb-4 text-lg font-black text-orange-800 flex items-center gap-2">
            🎮 Cara Bermain:
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-semibold">
            <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
              <span className="text-orange-600 font-black text-lg">•</span>
              <span>Tebak huruf satu per satu untuk menemukan kata</span>
            </li>
            <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
              <span className="text-amber-600 font-black text-lg">•</span>
              <span>Maksimal 6 kesalahan sebelum game over</span>
            </li>
            <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
              <span className="text-yellow-600 font-black text-lg">•</span>
              <span>Setiap kesalahan menambah bagian hangman</span>
            </li>
            <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
              <span className="text-orange-500 font-black text-lg">•</span>
              <span>Tebak kata sebelum hangman lengkap!</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
