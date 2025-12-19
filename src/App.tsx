import { Routes, Route, useNavigate, useParams } from "react-router-dom";
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
import { PageProfil } from "./components/PageProfil";
import { LoginModal } from "./components/LoginModal";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import ClickSpark from "./components/ui/click-spark";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { showLoginModal, setShowLoginModal } = useAuth();

  return (
    <ClickSpark sparkColor="#FFD700" sparkSize={12} sparkRadius={25} sparkCount={10}>
      <AppLayout />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <Toaster />
    </ClickSpark>
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const { user, login, logout, updateUser } = useAuth();

  const handleLogin = (userData: any) => {
    // This is called from LoginPage (full page login)
    // Token is now passed from LoginPage
    const token = userData.token || localStorage.getItem('token') || '';
    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };
    login(user, token);
    navigate("/");
  };

  return (
    <Routes>
      {/* Full page login/register (optional, user can still access these) */}
      <Route
        path="/login"
        element={<LoginPage onLogin={handleLogin} />}
      />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main app with Header - accessible to everyone */}
      <Route
        path="*"
        element={
          <>
            <Header />
            <Routes>
              {/* Public routes - everyone can access */}
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesWrapper />} />
              <Route path="/courses/:id" element={<CourseDetailWrapper />} />
              <Route path="/lesson/:id" element={<LessonWrapper />} />
              <Route path="/my-learning" element={<MyLearningWrapper />} />
              <Route
                path="/profile"
                element={
                  <PageProfil
                    user={user}
                    onUpdateUser={updateUser}
                    onLogout={() => {
                      logout();
                      navigate("/");
                    }}
                  />
                }
              />
              <Route
                path="/comprehensible-input"
                element={<ComprehensibleInputPage onBack={() => navigate("/")} />}
              />
              <Route path="/games/*" element={<GamesWrapper />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        }
      />
    </Routes>
  );
}

/* ================= WRAPPERS ================= */

const CoursesWrapper = () => {
  const navigate = useNavigate();
  return <CoursesPage onSelectCourse={(id) => navigate(`/courses/${id}`)} />;
};

const CourseDetailWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) return null;

  return (
    <CourseDetail
      courseId={Number(id)}
      onBack={() => navigate("/courses")}
      onStartLesson={(lessonId) => navigate(`/lesson/${lessonId}`)}
    />
  );
};

const LessonWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  if (!id) return null;

  const handleComplete = () => {
    // Require auth to save progress
    requireAuth(() => {
      toast.success("Selamat! Lesson berhasil diselesaikan! 🎉");
      navigate(-1);
    });
  };

  return (
    <LessonView
      lessonId={Number(id)}
      onBack={() => navigate(-1)}
      onComplete={handleComplete}
    />
  );
};

const MyLearningWrapper = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If not authenticated, show login prompt with link to login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-8">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-4">Masuk untuk Melihat Progress</h2>
          <p className="text-gray-600 mb-6">
            Silakan login untuk melihat pembelajaran Anda dan menyimpan progress belajar.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Login Sekarang
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Atau{" "}
            <button
              onClick={() => navigate("/courses")}
              className="text-orange-600 hover:underline"
            >
              jelajahi kursus dulu
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <MyLearning
      onNavigate={(page, courseId) => {
        if (page === 'courses') navigate('/courses');
        else if (page === 'course-detail' && courseId) navigate(`/courses/${courseId}`);
        else navigate(`/${page}`);
      }}
      onLessonStart={(lessonId) => navigate(`/lesson/${lessonId}`)}
    />
  );
};

const GamesWrapper = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        index
        element={<GamesPage onSelectGame={(g) => navigate(`/games/${g}`)} />}
      />
      <Route path="wordle" element={<WordleGame onBack={() => navigate("/games")} />} />
      <Route path="scramble" element={<WordScrambleGame onBack={() => navigate("/games")} />} />
      <Route path="hangman" element={<HangmanGame onBack={() => navigate("/games")} />} />
      <Route path="crossword" element={<CrosswordGame onBack={() => navigate("/games")} />} />
    </Routes>
  );
};

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Halaman tidak ditemukan</p>
      <a href="/" className="text-orange-600 hover:underline">
        Kembali ke Beranda
      </a>
    </div>
  </div>
);
