import { useState, useEffect, useRef } from "react";
import { ArrowLeft, HelpCircle, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "sonner@2.0.3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface WordleGameProps {
  onBack: () => void;
}

const WORDS = [
  "APPLE",
  "BREAD",
  "CHAIR",
  "DRINK",
  "EARTH",
  "FRUIT",
  "GRAPE",
  "HEART",
  "IMAGE",
  "JUICE",
  "KNIFE",
  "LEMON",
  "MONTH",
  "NIGHT",
  "OCEAN",
  "PHONE",
  "QUEEN",
  "RIVER",
  "SUGAR",
  "TABLE",
  "UNDER",
  "VOICE",
  "WATER",
  "WORLD",
];

type LetterState = "correct" | "present" | "absent" | "empty";

interface CellState {
  letter: string;
  state: LetterState;
  revealed?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

export function WordleGame({ onBack }: WordleGameProps) {
  const [targetWord, setTargetWord] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState<CellState[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keyboardState, setKeyboardState] = useState<
    Record<string, LetterState>
  >({});
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [bounceWin, setBounceWin] = useState(false);
  const gameOverRef = useRef<HTMLDivElement>(null);

  const MAX_GUESSES = 6;
  const WORD_LENGTH = 5;

  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === "Enter") {
        handleSubmitGuess();
      } else if (e.key === "Backspace") {
        handleDeleteLetter();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleAddLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameOver, currentRow]);

  const initializeGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
    setCurrentGuess("");
    setGuesses([]);
    setCurrentRow(0);
    setGameOver(false);
    setWon(false);
    setKeyboardState({});
    setShake(false);
    setParticles([]);
    setRevealingRow(null);
    setBounceWin(false);
  };

  const createConfetti = () => {
    const colors = [
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
    ];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2,
        },
      });
    }

    setParticles(newParticles);

    // Clear particles after animation
    setTimeout(() => setParticles([]), 3000);
  };

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            velocity: {
              x: p.velocity.x * 0.99,
              y: p.velocity.y + 0.1,
            },
          }))
          .filter((p) => p.y < window.innerHeight)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  const handleAddLetter = (letter: string) => {
    if (currentGuess.length < WORD_LENGTH && !gameOver) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const handleDeleteLetter = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      toast.error("Kata harus terdiri dari 5 huruf!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (currentRow >= MAX_GUESSES) return;

    // Evaluate guess
    const newGuess: CellState[] = [];
    const targetLetters = targetWord.split("");
    const guessLetters = currentGuess.split("");
    const newKeyboardState = { ...keyboardState };

    // First pass: mark correct letters
    const remainingTargetLetters = [...targetLetters];
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        newGuess[i] = { letter, state: "correct", revealed: false };
        remainingTargetLetters[i] = "";
        newKeyboardState[letter] = "correct";
      } else {
        newGuess[i] = { letter, state: "absent", revealed: false };
      }
    });

    // Second pass: mark present letters
    guessLetters.forEach((letter, i) => {
      if (newGuess[i].state === "correct") return;

      const indexInRemaining = remainingTargetLetters.indexOf(letter);
      if (indexInRemaining !== -1) {
        newGuess[i] = { letter, state: "present", revealed: false };
        remainingTargetLetters[indexInRemaining] = "";
        if (newKeyboardState[letter] !== "correct") {
          newKeyboardState[letter] = "present";
        }
      } else {
        if (!newKeyboardState[letter]) {
          newKeyboardState[letter] = "absent";
        }
      }
    });

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setRevealingRow(currentRow);

    // Reveal animation
    newGuess.forEach((cell, index) => {
      setTimeout(() => {
        setGuesses((prev) => {
          const updated = [...prev];
          if (updated[currentRow]) {
            updated[currentRow][index] = {
              ...updated[currentRow][index],
              revealed: true,
            };
          }
          return updated;
        });
      }, index * 300);
    });

    // Check results after all reveals
    setTimeout(() => {
      setKeyboardState(newKeyboardState);
      setRevealingRow(null);

      // Check if won
      if (currentGuess === targetWord) {
        setWon(true);
        setGameOver(true);
        setBounceWin(true);
        createConfetti();
        toast.success(
          `≡ƒÄë Selamat! Kamu menemukan kata dalam ${currentRow + 1} percobaan!`
        );

        // Scroll to game over message
        setTimeout(() => {
          gameOverRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 500);
      } else if (currentRow === MAX_GUESSES - 1) {
        setGameOver(true);
        toast.error(`Game Over! Kata yang benar adalah: ${targetWord}`);

        // Scroll to game over message
        setTimeout(() => {
          gameOverRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 500);
      }

      setCurrentGuess("");
      setCurrentRow(currentRow + 1);
    }, WORD_LENGTH * 300 + 100);
  };

  const handleKeyClick = (key: string) => {
    if (key === "ENTER") {
      handleSubmitGuess();
    } else if (key === "BACK") {
      handleDeleteLetter();
    } else {
      handleAddLetter(key);
    }
  };

  const getCellColor = (state: LetterState) => {
    switch (state) {
      case "correct":
        return "bg-green-500 border-green-500 text-white";
      case "present":
        return "bg-yellow-500 border-yellow-500 text-white";
      case "absent":
        return "bg-gray-400 border-gray-400 text-white";
      default:
        return "bg-white border-gray-300";
    }
  };

  const getKeyColor = (key: string) => {
    const state = keyboardState[key];
    switch (state) {
      case "correct":
        return "bg-green-500 text-white hover:bg-green-600";
      case "present":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "absent":
        return "bg-gray-400 text-white hover:bg-gray-500";
      default:
        return "bg-gray-200 hover:bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-4 sm:py-6 relative overflow-hidden">
      {/* Confetti Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none rounded-full animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${Math.random() * 360}deg)`,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
          }}
        />
      ))}

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 max-w-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:bg-white/80 hover:-translate-x-1 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent mb-1 animate-gradient drop-shadow-lg">
              ≡ƒîƒ English Wordle ≡ƒîƒ
            </h1>
            <p className="text-xs sm:text-sm text-green-100 font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
              Tebak kata dalam 6 percobaan!
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/90 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl bg-white/80"
                >
                  <HelpCircle className="h-5 w-5 text-green-600" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">
                    ≡ƒÄ« Cara Bermain
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-4 text-sm pt-4">
                      <p className="text-base text-gray-700">
                        Tebak kata bahasa Inggris dalam{" "}
                        <span className="font-bold text-purple-600">
                          6 kesempatan
                        </span>
                        !
                      </p>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                            A
                          </div>
                          <span className="text-gray-700">
                            Huruf{" "}
                            <span className="font-semibold text-green-600">
                              benar
                            </span>{" "}
                            dan posisi{" "}
                            <span className="font-semibold text-green-600">
                              benar
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                            B
                          </div>
                          <span className="text-gray-700">
                            Huruf{" "}
                            <span className="font-semibold text-yellow-600">
                              benar
                            </span>{" "}
                            tapi posisi{" "}
                            <span className="font-semibold text-yellow-600">
                              salah
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-400 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                            C
                          </div>
                          <span className="text-gray-700">
                            Huruf{" "}
                            <span className="font-semibold text-gray-600">
                              tidak ada
                            </span>{" "}
                            dalam kata
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center italic pt-2">
                        ≡ƒÆí Tips: Gunakan keyboard atau ketik langsung!
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={initializeGame}
              className="hover:bg-white/90 hover:rotate-180 transition-all duration-500 shadow-lg hover:shadow-xl bg-white/80"
            >
              <RotateCcw className="h-5 w-5 text-emerald-600" />
            </Button>
          </div>
        </div>

        {/* Game Board */}
        <Card className="p-4 sm:p-6 mb-4 shadow-2xl bg-white/95 backdrop-blur-sm border-4 border-green-300 hover:shadow-green-500/50 hover:shadow-2xl transition-all duration-300 animate-slide-up">
          <div
            className={`space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 ${
              shake ? "animate-shake" : ""
            }`}
          >
            {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-1.5 sm:gap-2 justify-center"
              >
                {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                  let cellState: CellState = {
                    letter: "",
                    state: "empty",
                    revealed: false,
                  };

                  if (rowIndex < guesses.length) {
                    cellState = guesses[rowIndex][colIndex];
                  } else if (
                    rowIndex === currentRow &&
                    currentGuess[colIndex]
                  ) {
                    cellState = {
                      letter: currentGuess[colIndex],
                      state: "empty",
                      revealed: false,
                    };
                  }

                  const isCurrentCell =
                    rowIndex === currentRow && colIndex === currentGuess.length;
                  const isRevealing = rowIndex === revealingRow;
                  const shouldAnimate = isRevealing && cellState.letter;

                  // Glow pulse for correct revealed tiles
                  const shouldGlow =
                    cellState.revealed && cellState.state === "correct";

                  return (
                    <div
                      key={colIndex}
                      className={`relative h-12 w-12 sm:h-14 sm:w-14 transition-all duration-300 ${
                        shouldAnimate ? "animate-flip" : ""
                      }`}
                      style={{
                        animationDelay: shouldAnimate
                          ? `${colIndex * 300}ms`
                          : "0ms",
                      }}
                    >
                      <div
                        className={`h-full w-full border-2 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold transition-all duration-300 transform ${getCellColor(
                          cellState.revealed ? cellState.state : "empty"
                        )} ${
                          isCurrentCell
                            ? "ring-4 ring-green-400 ring-offset-2 animate-pulse scale-110 shadow-lg shadow-green-300/50"
                            : ""
                        } ${
                          cellState.letter && !cellState.revealed
                            ? "scale-105 animate-pop border-gray-400"
                            : "scale-100"
                        } ${cellState.revealed ? "shadow-lg" : "shadow-md"} ${
                          shouldGlow
                            ? "animate-glow-pulse shadow-green-400/50 shadow-2xl"
                            : ""
                        } hover:scale-105 relative z-0`}
                      >
                        <span
                          className={`${
                            cellState.letter ? "animate-bounce-in" : ""
                          }`}
                        >
                          {cellState.letter}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Keyboard */}
          <div className="space-y-2">
            {keyboard.map((row, i) => (
              <div key={i} className="flex gap-1.5 sm:gap-2 justify-center">
                {row.map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyClick(key)}
                    disabled={gameOver}
                    className={`h-14 sm:h-16 font-bold text-sm sm:text-base ${
                      key === "ENTER" || key === "BACK"
                        ? "px-3 sm:px-5 min-w-[58px] sm:min-w-[75px]"
                        : "w-10 sm:w-[52px] px-0"
                    } ${getKeyColor(
                      key
                    )} transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                    variant="secondary"
                  >
                    {key === "BACK" ? "Γî½" : key}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Card
            className={`p-3 sm:p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-100 to-emerald-200 border-4 border-green-300 shadow-lg ${
              bounceWin ? "animate-bounce-slow" : ""
            }`}
          >
            <div className="text-2xl sm:text-3xl font-black text-green-700 mb-1">
              {currentRow}
            </div>
            <div className="text-xs sm:text-sm font-bold text-green-800">
              Percobaan
            </div>
          </Card>
          <Card
            className={`p-3 sm:p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-emerald-100 to-teal-200 border-4 border-emerald-300 shadow-lg ${
              bounceWin ? "animate-bounce-slow animation-delay-100" : ""
            }`}
          >
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mb-1">
              {MAX_GUESSES - currentRow}
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-800">
              Tersisa
            </div>
          </Card>
          <Card
            className={`p-3 sm:p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-teal-100 to-cyan-200 border-4 border-teal-300 shadow-lg ${
              bounceWin ? "animate-bounce-slow animation-delay-200" : ""
            }`}
          >
            <div
              className={`text-2xl sm:text-3xl mb-1 ${
                won ? "animate-bounce" : ""
              }`}
            >
              {won ? "≡ƒÅå" : gameOver ? "≡ƒÆ¬" : "≡ƒÄ»"}
            </div>
            <div className="text-xs sm:text-sm font-bold text-teal-800">
              Status
            </div>
          </Card>
        </div>

        {/* Game Over Message */}
        {gameOver && (
          <div ref={gameOverRef} className="mt-4 sm:mt-6 relative scroll-mt-8">
            {/* Decorative elements for win */}
            {won && (
              <>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce-in z-10 drop-shadow-lg"></div>
                <div className="absolute -top-8 left-1/4 text-4xl animate-float animation-delay-100 drop-shadow-lg">
                  Γ¡É
                </div>
                <div className="absolute -top-8 right-1/4 text-4xl animate-float animation-delay-200 drop-shadow-lg">
                  Γ£¿
                </div>
              </>
            )}

            <Card
              className={`p-8 text-center ${
                won
                  ? "bg-gradient-to-br from-green-700 via-emerald-800 to-teal-900"
                  : "bg-gradient-to-br from-red-800 via-rose-900 to-purple-900"
              } shadow-2xl border-0 relative overflow-hidden animate-scale-in`}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)] animate-pulse-slow"></div>
                {won && (
                  <>
                    <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white/50 rounded-full animate-ping-slow"></div>
                    <div className="absolute bottom-4 right-4 w-24 h-24 border-4 border-white/50 rounded-full animate-ping-slow animation-delay-100"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white/30 rounded-full animate-ping-slow animation-delay-200"></div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon/Emoji */}
                <div
                  className={`text-7xl mb-4 drop-shadow-2xl ${
                    won ? "animate-bounce-in" : "animate-shake-gentle"
                  }`}
                >
                  {won ? "≡ƒÄë" : " "}
                </div>

                {/* Title */}
                <div
                  className={`text-5xl font-black mb-4 text-yellow-300 ${
                    won ? "animate-slide-down" : "animate-fade-in"
                  }`}
                >
                  {won ? "≡ƒîƒ Luar Biasa! ≡ƒîƒ" : "Hampir Berhasil!"}
                </div>

                {/* Subtitle */}
                <div
                  className={`text-2xl mb-8 text-yellow-200 font-bold ${
                    won
                      ? "animate-slide-down animation-delay-100"
                      : "animate-fade-in animation-delay-100"
                  }`}
                >
                  {won
                    ? `Kamu menemukan kata dalam ${currentRow} percobaan!`
                    : "Jangan menyerah, coba lagi!"}
                </div>

                {/* Word reveal for lose */}
                {!won && (
                  <div className="mb-6 animate-slide-down animation-delay-200">
                    <p className="text-2xl text-yellow-200 font-black mb-4 bg-black/60 backdrop-blur-sm py-3 px-6 rounded-xl inline-block border-2 border-yellow-400/50">
                      Kata yang benar adalah:
                    </p>
                    <div className="flex gap-2 justify-center">
                      {targetWord.split("").map((letter, index) => (
                        <div
                          key={index}
                          className="h-16 w-16 bg-white/90 border-2 border-white rounded-lg flex items-center justify-center text-3xl font-bold text-purple-700 shadow-xl animate-flip"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats for win */}
                {won && (
                  <div className="mb-6 grid grid-cols-3 gap-4 animate-slide-up animation-delay-200">
                    <div className="bg-white/95 rounded-xl p-4 border-2 border-white shadow-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {currentRow}
                      </div>
                      <div className="text-sm text-gray-700 font-semibold">
                        Percobaan
                      </div>
                    </div>
                    <div className="bg-white/95 rounded-xl p-4 border-2 border-white shadow-lg">
                      <div className="text-3xl font-bold text-emerald-600">
                        {targetWord.length}
                      </div>
                      <div className="text-sm text-gray-700 font-semibold">
                        Huruf
                      </div>
                    </div>
                    <div className="bg-white/95 rounded-xl p-4 border-2 border-white shadow-lg">
                      <div className="text-2xl font-bold">
                        {currentRow <= 2
                          ? "Γ¡ÉΓ¡ÉΓ¡É"
                          : currentRow <= 4
                          ? "Γ¡ÉΓ¡É"
                          : "Γ¡É"}
                      </div>
                      <div className="text-sm text-gray-700 font-semibold">
                        Rating
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 justify-center animate-slide-up animation-delay-300">
                  <Button
                    onClick={initializeGame}
                    size="lg"
                    className={`bg-white ${
                      won
                        ? "text-green-700 hover:bg-green-50 hover:text-green-800"
                        : "text-red-700 hover:bg-red-50 hover:text-red-800"
                    } hover:scale-110 transition-all duration-300 font-extrabold shadow-2xl hover:shadow-3xl px-8 py-6 text-lg group border-2 ${
                      won ? "border-green-300" : "border-red-300"
                    }`}
                  >
                    <RotateCcw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Main Lagi
                  </Button>

                  <Button
                    onClick={onBack}
                    size="lg"
                    className="bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:scale-110 transition-all duration-300 font-bold shadow-2xl px-8 py-6 text-lg hover:border-gray-400"
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
