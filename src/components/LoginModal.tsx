import { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/register";
            const body = isLogin
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.status === 200 || data.status === 201) {
                const userData = data.payload?.user || data.payload;
                const token = data.payload?.token;

                if (token) {
                    login(userData, token);
                    toast.success(isLogin ? "Login berhasil! 🎉" : "Registrasi berhasil! 🎉");
                    onClose();
                }
            } else {
                toast.error(data.payload?.error || data.message || "Terjadi kesalahan");
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error("Gagal terhubung ke server");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToFullPage = () => {
        onClose();
        navigate(isLogin ? "/login" : "/register");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-scale-in">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold mb-4">
                        E
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isLogin ? "Selamat Datang Kembali!" : "Buat Akun Baru"}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {isLogin
                            ? "Masuk untuk menyimpan progress belajar Anda"
                            : "Daftar untuk memulai perjalanan belajar Anda"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                placeholder="Masukkan nama Anda"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            placeholder="nama@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition pr-12"
                                placeholder="Masukkan password"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 transition-all"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Memproses...
                            </>
                        ) : isLogin ? (
                            "Masuk"
                        ) : (
                            "Daftar"
                        )}
                    </Button>
                </form>

                {/* Toggle login/register */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? (
                        <p>
                            Belum punya akun?{" "}
                            <button
                                onClick={() => setIsLogin(false)}
                                className="font-semibold text-orange-600 hover:text-orange-500"
                            >
                                Daftar sekarang
                            </button>
                        </p>
                    ) : (
                        <p>
                            Sudah punya akun?{" "}
                            <button
                                onClick={() => setIsLogin(true)}
                                className="font-semibold text-orange-600 hover:text-orange-500"
                            >
                                Masuk
                            </button>
                        </p>
                    )}
                </div>

                {/* Or continue to full page */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleGoToFullPage}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Lanjutkan ke halaman {isLogin ? "login" : "registrasi"} lengkap
                    </button>
                </div>

                {/* Continue without login */}
                <div className="mt-4 text-center">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-400 hover:text-gray-600"
                    >
                        Lanjutkan tanpa login
                    </button>
                </div>
            </div>
        </div>
    );
}
