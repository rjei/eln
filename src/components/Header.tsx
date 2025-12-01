import { BookOpen, User, Menu, Gamepad2, Video } from "lucide-react";
import { Button } from "./ui/button";
import logoELn from "figma:asset/18192ba0538c1cdc87aea4b14687c02b7524a781.png";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="border-b border-orange-200/30 sticky top-0 z-50 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate("home")}
        >
          <img
            src={logoELn}
            alt="ELn Logo"
            className="h-10 w-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 hover-shine"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onNavigate("home")}
            className={`hover:text-primary transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${
              currentPage === "home" ? "text-primary bg-orange-50 scale-105" : ""
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate("courses")}
            className={`hover:text-primary transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${
              currentPage === "courses" || currentPage === "course-detail"
                ? "text-primary bg-orange-50 scale-105"
                : ""
            }`}
          >
            Kursus
          </button>
          <button
            onClick={() => onNavigate("comprehensible-input")}
            className={`hover:text-primary transition-all duration-300 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${
              currentPage === "comprehensible-input"
                ? "text-primary bg-orange-50 scale-105"
                : ""
            }`}
          >
            <Video className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Video Learning
          </button>
          <button
            onClick={() => onNavigate("games")}
            className={`hover:text-primary transition-all duration-300 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${
              currentPage === "games" || currentPage.includes("game-")
                ? "text-primary bg-orange-50 scale-105"
                : ""
            }`}
          >
            <Gamepad2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Mini Games
          </button>
          <button
            onClick={() => onNavigate("my-learning")}
            className={`hover:text-primary transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${
              currentPage === "my-learning" ? "text-primary bg-orange-50 scale-105" : ""
            }`}
          >
            Pembelajaran Saya
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-orange-50 hover:text-primary transition-all duration-300 hover:scale-125 hover:rotate-12"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-orange-50 hover:text-primary transition-all duration-300 hover:scale-125 hover:rotate-12"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
