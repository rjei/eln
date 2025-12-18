import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { CoursesPage } from "./components/CoursesPage";
import { CourseDetail } from "./components/CourseDetail";
import { LessonView } from "./components/LessonView";
import { MyLearning } from "./components/MyLearning";
import { GamesPage } from "./components/GamesPage";
import { WordleGame } from "./components/games/WordleGame";
import { WordScrambleGame } from "./components/games/WordScrambleGame";
import { HangmanGame } from "./components/games/HangmanGame";
import { CrosswordGame } from "./components/games/CrosswordGame";
import { ComprehensibleInputPage } from "./components/ComprehensibleInputPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import ClickSpark from "./components/ui/click-spark";
import { logout } from "./services/api";
import { PageProfil } from "./components/PageProfil";

type Page =
  | "home"
  | "profile"
  | "login"
  | "register"
  | "courses"
  | "course-detail"
  | "lesson"
  | "my-learning"
  | "comprehensible-input"
  | "games"
  | "game-wordle"
  | "game-scramble"
  | "game-hangman"
  | "game-crossword";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  } | null>(null);

  const handleNavigate = (page: string, courseId?: number) => {
    setCurrentPage(page as Page);
    if (courseId) {
      setSelectedCourseId(courseId);
    }
  };

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentPage("course-detail");
  };

  const handleStartLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setCurrentPage("lesson");
  };

  const handleBackToCourse = () => {
    setCurrentPage("course-detail");
  };

  const handleBackToCourses = () => {
    setCurrentPage("courses");
    setSelectedCourseId(null);
  };

  const handleLessonComplete = () => {
    toast.success("Selamat! Lesson berhasil diselesaikan! 🎉");
    setCurrentPage("course-detail");
  };

  const handleSelectGame = (gameId: string) => {
    setCurrentPage(`game-${gameId}` as Page);
  };

  const handleBackToGames = () => {
    setCurrentPage("games");
  };

  return (
    <ClickSpark
      sparkColor="#FFD700"
      sparkSize={12}
      sparkRadius={25}
      sparkCount={10}
    >
      <div
        className={`min-h-screen ${currentPage.startsWith("game-") ? "" : ""}`}
      >
        {currentPage !== "lesson" &&
          !currentPage.startsWith("game-") &&
          currentPage !== "login" &&
          currentPage !== "register" && (
            <Header onNavigate={handleNavigate} currentPage={currentPage} />
          )}

        {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
        {currentPage === "login" && <LoginPage onLogin={handleLogin} />}
        {currentPage === "register" && (
          <RegisterPage onNavigate={handleNavigate} />
        )}

        {currentPage === "courses" && (
          <CoursesPage onSelectCourse={handleSelectCourse} />
        )}

        {currentPage === "course-detail" && selectedCourseId && (
          <CourseDetail
            courseId={selectedCourseId}
            onBack={handleBackToCourses}
            onStartLesson={handleStartLesson}
          />
        )}

        {currentPage === "lesson" && selectedLessonId && (
          <LessonView
            lessonId={selectedLessonId}
            onBack={handleBackToCourse}
            onComplete={handleLessonComplete}
          />
        )}

        {currentPage === "my-learning" && (
          <MyLearning onNavigate={handleNavigate} />
        )}

        {currentPage === "profile" && (
          <PageProfil
            user={user}
            onUpdateUser={(u) => setUser((prev) => ({ ...(prev ?? {}), ...u }))}
            onLogout={() => {
              logout();
              setUser(null);
              setCurrentPage("login");
            }}
          />
        )}

        {currentPage === "comprehensible-input" && (
          <ComprehensibleInputPage onBack={() => setCurrentPage("home")} />
        )}

        {currentPage === "games" && (
          <GamesPage onSelectGame={handleSelectGame} />
        )}

        {currentPage === "game-wordle" && (
          <WordleGame onBack={handleBackToGames} />
        )}

        {currentPage === "game-scramble" && (
          <WordScrambleGame onBack={handleBackToGames} />
        )}

        {currentPage === "game-hangman" && (
          <HangmanGame onBack={handleBackToGames} />
        )}

        {currentPage === "game-crossword" && (
          <CrosswordGame onBack={handleBackToGames} />
        )}

        <Toaster />
      </div>
    </ClickSpark>
  );
}
