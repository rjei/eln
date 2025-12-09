import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginPageProps {
  onLogin: (user: { name: string; email: string }) => void;
  onSkip?: () => void;
}

export function LoginPage({ onLogin, onSkip }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation
    const nextErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      nextErrors.email = "Email tidak valid";
    if (formData.password.length < 6)
      nextErrors.password = "Password minimal 6 karakter";

    if (isRegisterMode) {
      if (formData.password !== formData.confirmPassword)
        nextErrors.confirmPassword = "Password tidak sama";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsLoading(false);
    onLogin({
      name: formData.email.split("@")[0],
      email: formData.email,
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "relative",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #e05f3e 0%, #ea580c 50%, #c2410c 100%)",
      }}
    >
      {/* Image shape with clip-path */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "55%",
          height: "100%",
          clipPath: "ellipse(45% 60% at 30% 50%)",
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      {/* Decorative shapes */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="1700" cy="200" r="400" fill="rgba(255,255,255,0.15)" />
        <circle cx="1800" cy="900" r="300" fill="rgba(255,255,255,0.1)" />
        <path
          d="M 1200,400 Q 1400,300 1600,400 T 1920,400 L 1920,0 L 1200,0 Z"
          fill="rgba(255,255,255,0.08)"
        />
        <path
          d="M 1200,800 Q 1400,700 1600,800 T 1920,800 L 1920,1080 L 1200,1080 Z"
          fill="rgba(255,255,255,0.08)"
        />
      </svg>

      {/* Main content container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8% 0 8%",
          paddingRight: "15%",
        }}
      >
        {/* Left side - Text */}
        <div
          style={{
            maxWidth: "600px",
            color: "white",
            marginLeft: "60px",
            position: "relative",
            marginTop: "400px",
          }}
        >
          {/* Orange circular background behind text */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              left: "-500px",
              width: "700px",
              height: "700px",
              background:
                "linear-gradient(135deg, rgba(224, 95, 62, 0.75) 0%, rgba(234, 88, 12, 0.75) 50%, rgba(194, 65, 12, 0.65) 100%)",
              borderRadius: "50%",
              zIndex: -1,
              backdropFilter: "blur(3px)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              paddingLeft: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                marginBottom: "20px",
                lineHeight: "1.2",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              ENGLISH E-LEARNING
            </h1>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "300",
                opacity: 0.95,
              }}
            >
              Master English, Connect with the World.
            </p>
          </motion.div>
        </div>

        {/* Right side - Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "50px 40px",
            borderRadius: "20px",
            width: "420px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#1f2937",
              textAlign: "center",
            }}
          >
            {isRegisterMode ? "Create Account!" : "Welcome Back!"}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            {isRegisterMode
              ? "Please create your account"
              : "Please login with your email address"}
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "16px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
                backgroundColor: "white",
              }}
            />
            {errors.email && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "13px",
                  marginTop: "-12px",
                  marginBottom: "12px",
                  textAlign: "left",
                }}
              >
                {errors.email}
              </p>
            )}

            <div style={{ position: "relative", marginBottom: "16px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  paddingRight: "45px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  fontSize: "15px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label={showPassword ? "hide password" : "show password"}
              >
                {showPassword ? (
                  <EyeOff
                    style={{ width: "20px", height: "20px", color: "#9ca3af" }}
                  />
                ) : (
                  <Eye
                    style={{ width: "20px", height: "20px", color: "#9ca3af" }}
                  />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "13px",
                  marginTop: "-12px",
                  marginBottom: "12px",
                  textAlign: "left",
                }}
              >
                {errors.password}
              </p>
            )}

            {isRegisterMode && (
              <>
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      paddingRight: "45px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      outline: "none",
                      fontSize: "15px",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    aria-label={
                      showPassword ? "hide password" : "show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#9ca3af",
                        }}
                      />
                    ) : (
                      <Eye
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#9ca3af",
                        }}
                      />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "13px",
                      marginTop: "-12px",
                      marginBottom: "12px",
                      textAlign: "left",
                    }}
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#4b5563",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                Stay logged in
              </label>

              <a
                href="#"
                style={{
                  color: "#f97316",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                borderRadius: "8px",
                opacity: isLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(249, 115, 22, 0.4)",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                if (!isLoading)
                  e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isLoading ? (
                <>
                  <Loader2
                    style={{
                      width: "18px",
                      height: "18px",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Loading...
                </>
              ) : isRegisterMode ? (
                <>
                  CREATE ACCOUNT <span style={{ marginLeft: "4px" }}></span>
                </>
              ) : (
                <>
                  SIGN IN <span style={{ marginLeft: "4px" }}></span>
                </>
              )}
            </button>

            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              <span>
                {isRegisterMode ? "Sudah punya akun? " : "Belum punya akun? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrors({});
                  setFormData({ email: "", password: "", confirmPassword: "" });
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f97316",
                  textDecoration: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {isRegisterMode ? "Masuk" : "Daftar Sekarang"}
              </button>
            </div>

            {onSkip && (
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={onSkip}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#9ca3af",
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Lewati untuk sekarang →
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
