import { useState, useEffect } from "react";
import { ArrowLeft, Check, X, RotateCcw, Loader2, Trophy, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { toast } from "sonner";
import TargetCursor from "../ui/TargetCursor";
import Shuffle from "../ui/Shuffle";

interface CrosswordGameProps {
  onBack: () => void;
}

interface Cell {
  letter: string;
  number?: number;
  blocked: boolean;
}

interface Clue {
  number: number;
  clue: string;
  answer: string;
  direction: "across" | "down";
  startRow: number;
  startCol: number;
}

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

// Fallback clues in case API fails
const FALLBACK_CLUES: Clue[] = [
  { number: 1, clue: "Opposite of big", answer: "SMALL", direction: "across", startRow: 0, startCol: 0 },
  { number: 2, clue: "Color of the sky", answer: "BLUE", direction: "down", startRow: 0, startCol: 0 },
  { number: 3, clue: "Fruit that keeps doctor away", answer: "APPLE", direction: "across", startRow: 1, startCol: 1 },
  { number: 4, clue: "Frozen water", answer: "ICE", direction: "down", startRow: 1, startCol: 2 },
  { number: 5, clue: 'Animal that says "meow"', answer: "CAT", direction: "across", startRow: 2, startCol: 0 },
];

export function CrosswordGame({ onBack }: CrosswordGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [completed, setCompleted] = useState(false);
  const [clues, setClues] = useState<Clue[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridSize, setGridSize] = useState(7);
  const [saving, setSaving] = useState(false);

  // Fetch crossword puzzle from API
  const fetchQuestion = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/games/crossword/question`);
      const data = await response.json();

      if (data.status === 200 && data.payload?.content) {
        const content = data.payload.content;
        console.log("[Crossword] Got puzzle from API:", content);
        return {
          clues: content.clues || FALLBACK_CLUES,
          gridSize: content.gridSize || 7
        };
      }
      throw new Error("Invalid response");
    } catch (error) {
      console.error("[Crossword] API error, using fallback:", error);
      return { clues: FALLBACK_CLUES, gridSize: 7 };
    }
  };

  // Save score and get level up info
  const saveScore = async (score: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[Crossword] No token, skipping score save');
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
          gameType: 'crossword',
          score: score,
          timeSpent: 0
        })
      });

      const data = await response.json();
      if (data.status === 201) {
        console.log('[Crossword] Score saved:', data.payload);
        return data.payload;
      }
      return null;
    } catch (error) {
      console.error('[Crossword] Error saving score:', error);
      return null;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadPuzzle();
  }, []);

  const loadPuzzle = async () => {
    setLoading(true);
    setCompleted(false);
    const puzzleData = await fetchQuestion();
    setClues(puzzleData.clues);
    setGridSize(puzzleData.gridSize);
    setLoading(false);
  };

  useEffect(() => {
    if (clues.length > 0 && !loading) {
      initializeGrid();
    }
  }, [clues, loading]);

  const initializeGrid = () => {
    const size = gridSize;
    const newGrid: Cell[][] = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({ letter: "", blocked: true }))
      );
    const newUserGrid: string[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(""));

    // Place words in grid
    clues.forEach((clue) => {
      let row = clue.startRow;
      let col = clue.startCol;

      for (let i = 0; i < clue.answer.length; i++) {
        if (row < size && col < size) {
          newGrid[row][col] = {
            letter: clue.answer[i],
            blocked: false,
            number: i === 0 ? clue.number : newGrid[row][col].number,
          };
        }

        if (clue.direction === "across") {
          col++;
        } else {
          row++;
        }
      }
    });

    setGrid(newGrid);
    setUserGrid(newUserGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row]?.[col]?.blocked) return;

    // Find which clue this cell belongs to
    const cellClues = clues.filter((clue) => {
      if (clue.direction === "across") {
        return (
          row === clue.startRow &&
          col >= clue.startCol &&
          col < clue.startCol + clue.answer.length
        );
      } else {
        return (
          col === clue.startCol &&
          row >= clue.startRow &&
          row < clue.startRow + clue.answer.length
        );
      }
    });

    if (cellClues.length > 0) {
      const startClue = cellClues.find(
        (c) => c.startRow === row && c.startCol === col
      );
      if (startClue) {
        setSelectedClue(startClue.number);
        setDirection(startClue.direction);
      } else {
        const matchingDir = cellClues.find((c) => c.direction === direction);
        if (matchingDir) {
          setSelectedClue(matchingDir.number);
        } else {
          setSelectedClue(cellClues[0].number);
          setDirection(cellClues[0].direction);
        }
      }
    }
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value.length > 1) return;

    const newUserGrid = [...userGrid];
    newUserGrid[row][col] = value.toUpperCase();
    setUserGrid(newUserGrid);

    // Auto-advance to next cell
    if (value && selectedClue !== null) {
      const clue = clues.find((c) => c.number === selectedClue);
      if (clue) {
        if (clue.direction === "across") {
          if (col + 1 < grid[0]?.length && !grid[row][col + 1]?.blocked) {
            const nextInput = document.querySelector(
              `input[data-row="${row}"][data-col="${col + 1}"]`
            ) as HTMLInputElement;
            nextInput?.focus();
          }
        } else {
          if (row + 1 < grid.length && !grid[row + 1]?.[col]?.blocked) {
            const nextInput = document.querySelector(
              `input[data-row="${row + 1}"][data-col="${col}"]`
            ) as HTMLInputElement;
            nextInput?.focus();
          }
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === "Backspace" && !userGrid[row][col]) {
      // Move to previous cell on backspace if current cell is empty
      const clue = clues.find((c) => c.number === selectedClue);
      if (clue) {
        if (clue.direction === "across" && col > 0) {
          const prevInput = document.querySelector(
            `input[data-row="${row}"][data-col="${col - 1}"]`
          ) as HTMLInputElement;
          prevInput?.focus();
        } else if (clue.direction === "down" && row > 0) {
          const prevInput = document.querySelector(
            `input[data-row="${row - 1}"][data-col="${col}"]`
          ) as HTMLInputElement;
          prevInput?.focus();
        }
      }
    }
  };

  const handleCheck = async () => {
    let correct = 0;
    let total = 0;

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell.blocked) {
          total++;
          if (userGrid[i][j] === cell.letter) {
            correct++;
          }
        }
      });
    });

    if (correct === total && total > 0) {
      setCompleted(true);

      // Calculate score (10 points per correct letter)
      const score = correct * 10;

      // Save score and check for level up
      const result = await saveScore(score);

      if (result) {
        if (result.isLevelUp) {
          // Level Up notification
          toast.success(
            `🚀 LEVEL UP! Sekarang Level ${result.newLevel}!`,
            {
              description: `+${result.xpAdded} XP | Total: ${result.totalPoints} XP`,
              duration: 5000,
              icon: <Trophy className="h-5 w-5 text-yellow-500" />,
            }
          );
        } else {
          // Normal win notification
          toast.success(
            `🎉 Selamat! +${result.xpAdded} XP`,
            {
              description: `Level ${result.newLevel} | Total: ${result.totalPoints} XP`,
              duration: 4000,
              icon: <Star className="h-5 w-5 text-orange-500" />,
            }
          );
        }
      } else {
        toast.success("🎉 Selamat! Semua jawaban benar!");
      }
    } else {
      toast.info(`${correct} dari ${total} benar. Tetap semangat!`);
    }
  };

  const handleClear = () => {
    if (grid.length > 0) {
      const newUserGrid = Array(grid.length)
        .fill(null)
        .map(() => Array(grid[0].length).fill(""));
      setUserGrid(newUserGrid);
      setCompleted(false);
    }
  };

  const isCellSelected = (row: number, col: number) => {
    if (selectedClue === null) return false;

    const clue = clues.find((c) => c.number === selectedClue);
    if (!clue) return false;

    if (clue.direction === "across") {
      return (
        row === clue.startRow &&
        col >= clue.startCol &&
        col < clue.startCol + clue.answer.length
      );
    } else {
      return (
        col === clue.startCol &&
        row >= clue.startRow &&
        row < clue.startRow + clue.answer.length
      );
    }
  };

  const acrossClues = clues.filter((c) => c.direction === "across");
  const downClues = clues.filter((c) => c.direction === "down");

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#4A90E2] flex items-center justify-center">
        <Card className="p-8 max-w-md text-center bg-white shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-800">Memuat Puzzle...</h2>
            <p className="text-gray-600">Mohon tunggu sebentar</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <TargetCursor targetSelector=".cursor-target" />
      <div className="min-h-screen bg-[#4A90E2] py-8">
        <div className="px-4 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2 bg-white/90 hover:bg-white cursor-target"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>

            <Shuffle
              text="Crossword Puzzle"
              tag="h1"
              className="text-3xl text-black font-bold"
              shuffleDirection="right"
              duration={0.5}
              stagger={0.05}
              triggerOnce={false}
              threshold={0}
            />

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={loadPuzzle}
                className="bg-white/90 hover:bg-white cursor-target"
                title="Puzzle Baru"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Crossword Grid */}
            <div className="lg:col-span-2">
              <div className="p-8">
                <div className="inline-block mx-auto">
                  {grid.map((row, i) => (
                    <div key={i} className="flex">
                      {row.map((cell, j) => (
                        <div
                          key={j}
                          className={`relative cursor-pointer cursor-target ${cell.blocked
                              ? "bg-gray-800 w-12 h-12 border border-gray-400"
                              : "bg-white w-12 h-12 border border-gray-400"
                            } ${isCellSelected(i, j) ? "bg-blue-100" : ""}`}
                          onClick={() => handleCellClick(i, j)}
                        >
                          {!cell.blocked && (
                            <>
                              {cell.number && (
                                <span className="absolute top-0.5 left-0.5 text-[10px] font-bold text-gray-600 leading-none">
                                  {cell.number}
                                </span>
                              )}
                              <Input
                                data-row={i}
                                data-col={j}
                                type="text"
                                maxLength={1}
                                value={userGrid[i]?.[j] || ""}
                                onChange={(e) =>
                                  handleInputChange(i, j, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(e, i, j)}
                                className="w-full h-full border-0 text-center text-xl font-bold p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                disabled={completed}
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3 justify-center">
                  <Button
                    onClick={handleCheck}
                    className="gap-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-target"
                    disabled={completed || saving}
                    style={{ fontFamily: '"Georgia", serif' }}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Periksa Jawaban
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-0"
                    style={{ fontFamily: '"Georgia", serif' }}
                  >
                    <X className="h-4 w-4" />
                    Hapus Semua
                  </Button>
                </div>

                {completed && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 border-4 border-green-700 rounded-2xl text-center shadow-2xl animate-bounce-in">
                    <div className="text-6xl mb-3 animate-bounce">🎉</div>
                    <p
                      className="text-white text-xl font-black drop-shadow-lg"
                      style={{ fontFamily: '"Georgia", serif' }}
                    >
                      🎉 Selamat! Kamu berhasil menyelesaikan crossword puzzle!
                    </p>
                    <Button
                      onClick={loadPuzzle}
                      className="mt-4 bg-white text-green-700 hover:bg-green-50 font-bold"
                    >
                      Main Lagi
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Clues */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8 shadow-2xl bg-white border-4 border-blue-200 animate-slide-up">
                <h2 className="text-xl sm:text-2xl font-black mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent flex items-center gap-2">
                  💡 Clues
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="mb-2 sm:mb-3 font-black text-blue-600 flex items-center gap-2 text-base">
                      <span className="text-xl bg-blue-100 px-2 py-1 rounded">
                        →
                      </span>{" "}
                      ACROSS
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      {acrossClues.map((clue) => (
                        <button
                          key={clue.number}
                          onClick={() => {
                            setSelectedClue(clue.number);
                            setDirection("across");
                          }}
                          className={`w-full text-left p-2 sm:p-3 rounded-xl text-xs sm:text-sm transition-all duration-200 font-semibold text-black ${selectedClue === clue.number &&
                              direction === "across"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 scale-105 shadow-lg shadow-blue-300/50 border-2 border-blue-400"
                              : "hover:bg-blue-100 hover:scale-102 hover:shadow-md bg-blue-50 border-2 border-transparent"
                            }`}
                        >
                          <span
                            className={`text-[10px] font-extrabold mr-1.5 px-2 py-1 rounded ${selectedClue === clue.number &&
                                direction === "across"
                                ? "bg-yellow-400 text-black"
                                : "bg-blue-600 text-white"
                              }`}
                          >
                            {clue.number}
                          </span>
                          {clue.clue}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 sm:mb-3 font-black text-cyan-600 flex items-center gap-2 text-base">
                      <span className="text-xl bg-cyan-100 px-2 py-1 rounded">
                        ↓
                      </span>{" "}
                      DOWN
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      {downClues.map((clue) => (
                        <button
                          key={clue.number}
                          onClick={() => {
                            setSelectedClue(clue.number);
                            setDirection("down");
                          }}
                          className={`w-full text-left p-2 sm:p-3 rounded-xl text-xs sm:text-sm transition-all duration-200 font-semibold text-black ${selectedClue === clue.number && direction === "down"
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 scale-105 shadow-lg shadow-cyan-300/50 border-2 border-cyan-400"
                              : "hover:bg-cyan-100 hover:scale-102 hover:shadow-md bg-cyan-50 border-2 border-transparent"
                            }`}
                        >
                          <span
                            className={`text-[10px] font-extrabold mr-1.5 px-2 py-1 rounded ${selectedClue === clue.number &&
                                direction === "down"
                                ? "bg-yellow-400 text-black"
                                : "bg-cyan-600 text-white"
                              }`}
                          >
                            {clue.number}
                          </span>
                          {clue.clue}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Instructions */}
          <Card className="mt-8 p-6 bg-orange-100 border-primary/20">
            <h3 className="mb-3">📝 Cara Bermain:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Klik pada kotak untuk memulai mengisi jawaban</li>
              <li>• Baca clue di sidebar untuk mengetahui jawabannya</li>
              <li>• Klik clue untuk highlight kata yang dimaksud</li>
              <li>• Klik "Periksa Jawaban" untuk mengecek hasil</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
