import { useState, useEffect } from "react";
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { toast } from "sonner@2.0.3";
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

export function CrosswordGame({ onBack }: CrosswordGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [completed, setCompleted] = useState(false);

  const clues: Clue[] = [
    {
      number: 1,
      clue: "Opposite of big",
      answer: "SMALL",
      direction: "across",
      startRow: 0,
      startCol: 0,
    },
    {
      number: 2,
      clue: "Color of the sky",
      answer: "BLUE",
      direction: "down",
      startRow: 0,
      startCol: 0,
    },
    {
      number: 3,
      clue: "Fruit that keeps doctor away",
      answer: "APPLE",
      direction: "across",
      startRow: 1,
      startCol: 1,
    },
    {
      number: 4,
      clue: "Frozen water",
      answer: "ICE",
      direction: "down",
      startRow: 1,
      startCol: 2,
    },
    {
      number: 5,
      clue: 'Animal that says "meow"',
      answer: "CAT",
      direction: "across",
      startRow: 2,
      startCol: 0,
    },
    {
      number: 6,
      clue: "Hot drink, often in morning",
      answer: "TEA",
      direction: "down",
      startRow: 0,
      startCol: 4,
    },
    {
      number: 7,
      clue: "Opposite of old",
      answer: "NEW",
      direction: "across",
      startRow: 3,
      startCol: 2,
    },
    {
      number: 8,
      clue: "Red fruit, often in salad",
      answer: "TOMATO",
      direction: "down",
      startRow: 1,
      startCol: 5,
    },
  ];

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const size = 7;
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
    if (grid[row][col].blocked) return;

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
      // If clicked on start of a clue, select that clue
      const startClue = cellClues.find(
        (c) => c.startRow === row && c.startCol === col
      );
      if (startClue) {
        setSelectedClue(startClue.number);
        setDirection(startClue.direction);
      } else {
        // Select the first clue that matches current direction, or just the first one
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
          if (col + 1 < grid[0].length && !grid[row][col + 1].blocked) {
            const nextInput = document.querySelector(
              `input[data-row="${row}"][data-col="${col + 1}"]`
            ) as HTMLInputElement;
            nextInput?.focus();
          }
        } else {
          if (row + 1 < grid.length && !grid[row + 1][col].blocked) {
            const nextInput = document.querySelector(
              `input[data-row="${row + 1}"][data-col="${col}"]`
            ) as HTMLInputElement;
            nextInput?.focus();
          }
        }
      }
    }
  };

  const handleCheck = () => {
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

    if (correct === total) {
      setCompleted(true);
      toast.success("🎉 Selamat! Semua jawaban benar!");
    } else {
      toast.info(`${correct} dari ${total} benar. Tetap semangat!`);
    }
  };

  const handleClear = () => {
    const newUserGrid = Array(grid.length)
      .fill(null)
      .map(() => Array(grid[0].length).fill(""));
    setUserGrid(newUserGrid);
    setCompleted(false);
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

            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="bg-white/90 hover:bg-white cursor-target"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
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
                          className={`relative cursor-pointer cursor-target ${
                            cell.blocked
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
                                value={userGrid[i][j] || ""}
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
                    disabled={completed}
                    style={{ fontFamily: '"Georgia", serif' }}
                  >
                    <Check className="h-4 w-4" />
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
                          className={`w-full text-left p-2 sm:p-3 rounded-xl text-xs sm:text-sm transition-all duration-200 font-semibold text-black ${
                            selectedClue === clue.number &&
                            direction === "across"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 scale-105 shadow-lg shadow-blue-300/50 border-2 border-blue-400"
                              : "hover:bg-blue-100 hover:scale-102 hover:shadow-md bg-blue-50 border-2 border-transparent"
                          }`}
                        >
                          <span
                            className={`text-[10px] font-extrabold mr-1.5 px-2 py-1 rounded ${
                              selectedClue === clue.number &&
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
                          className={`w-full text-left p-2 sm:p-3 rounded-xl text-xs sm:text-sm transition-all duration-200 font-semibold text-black ${
                            selectedClue === clue.number && direction === "down"
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 scale-105 shadow-lg shadow-cyan-300/50 border-2 border-cyan-400"
                              : "hover:bg-cyan-100 hover:scale-102 hover:shadow-md bg-cyan-50 border-2 border-transparent"
                          }`}
                        >
                          <span
                            className={`text-[10px] font-extrabold mr-1.5 px-2 py-1 rounded ${
                              selectedClue === clue.number &&
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
