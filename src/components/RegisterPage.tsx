import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import heroImage from "../assets/gemini.png.png";

export function RegisterPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Register with:", { ...formData, rememberMe });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mr-2">
                E
              </div>
              <span className="text-xl font-bold text-gray-800">
                ENGLISH E-LEARNING
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative overflow-hidden">
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          {/* Left side - Circular hero image + text */}
          <div className="w-1/2 h-full flex items-center justify-center">
            <div className="relative w-[360px] h-[360px] rounded-full overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="English e-learning hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-orange-500/55 mix-blend-multiply" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
                <h1 className="text-3xl font-bold mb-3 leading-tight">
                  ENGLISH
                  <br />
                  E-LEARNING
                </h1>
                <p className="text-base">
                  Start your journey to master English today.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Register Card */}
          <div className="w-1/2 flex justify-end pr-32 mt-6">
            <div
              className="bg-white/95 rounded-none shadow-[0_22px_55px_rgba(0,0,0,0.25)] border border-orange-200 w-full max-w-md"
              style={{ padding: "2.5rem 2.75rem" }}
            >
              <button
                onClick={() => onNavigate("login")}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
              >
                <ArrowLeft size={18} className="mr-1" /> Back to Login
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create an Account
                </h2>
                <p className="text-gray-600 mt-2">
                  Join our community of English learners
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm placeholder-gray-400 bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm placeholder-gray-400 bg-white pr-10"
                      placeholder="Create a password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10 outline-none transition"
                      placeholder="Confirm your password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-orange-600 hover:text-orange-500"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-orange-600 hover:text-orange-500"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-[#f97316] hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-lg w-full transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  CREATE ACCOUNT <span className="ml-2">→</span>
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="font-medium text-orange-600 hover:text-orange-500"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("login");
                    }}
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative elements */}
      {/* Gelombang oranye atas kanan */}
      <div
        style={{
          position: "absolute",
          right: "-220px",
          top: "20px",
          width: "720px",
          height: "260px",
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(249,115,22,0.55), transparent 60%), radial-gradient(circle at 60% 120%, rgba(251,146,60,0.5), transparent 65%)",
          borderRadius: "180px",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />
      {/* Gelombang oranye bawah kanan */}
      <div
        style={{
          position: "absolute",
          right: "-260px",
          bottom: "-60px",
          width: "780px",
          height: "260px",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(253,186,116,0.7), transparent 60%), radial-gradient(circle at 80% 120%, rgba(254,215,170,0.9), transparent 65%)",
          borderRadius: "200px",
          opacity: 0.95,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
