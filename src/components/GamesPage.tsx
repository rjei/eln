import { Gamepad2, Grid3x3, Shuffle, Skull } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface GamesPageProps {
  onSelectGame: (gameId: string) => void;
}

export function GamesPage({ onSelectGame }: GamesPageProps) {
  const games = [
    {
      id: "wordle",
      title: "English Wordle",
      description:
        "Tebak kata bahasa Inggris dalam 6 kesempatan. Game klasik untuk melatih vocabulary!",
      icon: Grid3x3,
      difficulty: "Medium",
      color: "bg-green-500",
      players: "1,234",
    },
    {
      id: "crossword",
      title: "Crossword Puzzle",
      description:
        "Teka-teki silang interaktif dengan clues dalam bahasa Inggris.",
      icon: Grid3x3,
      difficulty: "Hard",
      color: "bg-blue-500",
      players: "892",
    },
    {
      id: "scramble",
      title: "Word Scramble",
      description:
        "Susun huruf acak menjadi kata yang benar. Cepat dan menyenangkan!",
      icon: Shuffle,
      difficulty: "Easy",
      color: "bg-purple-500",
      players: "2,156",
    },
    {
      id: "hangman",
      title: "Hangman",
      description:
        "Tebak kata sebelum gambar tergantung lengkap. Game klasik yang seru!",
      icon: Skull,
      difficulty: "Easy",
      color: "bg-orange-500",
      players: "1,567",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="py-12 bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl">Mini Games</h1>
          </div>
          <p className="text-xl text-gray-600">
            Belajar bahasa Inggris sambil bermain! Pilih game favoritmu dan
            tingkatkan vocabulary
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
          <Card className="p-6 text-center">
            <div className="text-3xl text-primary mb-2">4</div>
            <div className="text-sm text-gray-600">Games Tersedia</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl text-green-600 mb-2">5,849</div>
            <div className="text-sm text-gray-600">Total Pemain</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl text-primary mb-2">∞</div>
            <div className="text-sm text-gray-600">Unlimited Play</div>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Card
                key={game.id}
                className="overflow-hidden hover:shadow-lg transition-all group"
              >
                <div
                  className={`${game.color} p-8 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 opacity-10 transform translate-x-8 -translate-y-8">
                    <Icon className="h-48 w-48" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-2xl mb-2">{game.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{game.description}</p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {game.players} pemain aktif
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onSelectGame(game.id)}
                    className="w-full group-hover:scale-105 transition-transform"
                  >
                    Mainkan Sekarang
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="mt-12 p-8 max-w-3xl mx-auto bg-orange-100 border-primary/20">
          <h3 className="text-xl mb-4">💡 Tips Bermain</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Main secara teratur untuk meningkatkan vocabulary Anda</li>
            <li>
              • Jangan takut mencoba - kesalahan adalah bagian dari proses
              belajar
            </li>
            <li>• Catat kata-kata baru yang Anda pelajari dari game</li>
            <li>• Tantang teman Anda untuk bermain bersama!</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
