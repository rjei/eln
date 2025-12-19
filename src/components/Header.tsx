import { User, Menu, Gamepad2, Video, UserPlus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoELn from "../assets/18192ba0538c1cdc87aea4b14687c02b7524a781.png";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthenticated, isLoading, user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <header
      className="border-b border-orange-200/30 sticky top-0 z-50 shadow-lg"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src={logoELn}
            alt="ELn Logo"
            className="h-10 w-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 hover-shine"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className={`hover:text-primary transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${isActive("/") && currentPath === "/"
              ? "text-primary bg-orange-50 scale-105"
              : ""
              }`}
          >
            Beranda
          </button>
          <button
            onClick={() => navigate("/courses")}
            className={`hover:text-primary transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${isActive("/courses") ? "text-primary bg-orange-50 scale-105" : ""
              }`}
          >
            Kursus
          </button>
          <button
            onClick={() => navigate("/comprehensible-input")}
            className={`hover:text-primary transition-all duration-300 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${isActive("/comprehensible-input")
              ? "text-primary bg-orange-50 scale-105"
              : ""
              }`}
          >
            <Video className="h-4 w-4" />
            Video Learning
          </button>
          <button
            onClick={() => navigate("/games")}
            className={`hover:text-primary transition-all duration-300 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${isActive("/games") ? "text-primary bg-orange-50 scale-105" : ""
              }`}
          >
            <Gamepad2 className="h-4 w-4" />
            Mini Games
          </button>
          <button
            onClick={() => navigate("/my-learning")}
            className={`hover:text-primary transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 hover:scale-110 hover-shine ${isActive("/my-learning")
              ? "text-primary bg-orange-50 scale-105"
              : ""
              }`}
          >
            Pembelajaran Saya
          </button>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            // Loading state - show spinner
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : isAuthenticated && user ? (
            // ✅ USER SUDAH LOGIN - Tampilkan icon profile
            <div className="flex items-center gap-3">
              <span className="hidden lg:block text-sm text-gray-600">
                Halo,{" "}
                <span className="font-semibold text-orange-600">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="relative hover:bg-orange-50 hover:text-primary transition-all duration-300 hover:scale-110 rounded-full"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover border-2 border-orange-300"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                )}
              </Button>
            </div>
          ) : (
            // ❌ USER BELUM LOGIN - Tampilkan tombol Login dan Sign Up
            <div className="flex items-center gap-3">
              {/* Tombol Login - TEKS JELAS */}
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-orange-400 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-semibold px-5 py-2 rounded-lg transition-all"
              >
                Login
              </Button>

              {/* Tombol Sign Up - BUTTON ORANYE */}
              <Button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-orange-50 hover:text-primary transition-all duration-300"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
