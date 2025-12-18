import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Mail, Phone, MapPin, User, Trophy, Star, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

interface UserStats {
  points: number;
  lessonsCompleted: number;
  totalTimeSpent: number;
}

interface PageProfilProps {
  onBack?: () => void;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    about?: string;
    avatar?: string;
  } | null;
  onUpdateUser?: (u: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    about?: string;
    avatar?: string;
  }) => void;
}

export function PageProfil({ onBack, user, onUpdateUser }: PageProfilProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [form, setForm] = useState({
    name: user?.name ?? "Rian Ansari",
    email: user?.email ?? "rian@email.com",
    avatar: user?.avatar ?? "",
    phone: "+62 812-xxxx-xxxx",
    address: "Sumatera Utara, Indonesia",
    about:
      "Saya adalah mahasiswa yang tertarik pada pengembangan web, kecerdasan buatan, dan data analysis. Terbiasa menggunakan React, TypeScript, Tailwind CSS, serta Python untuk kebutuhan analisis dan machine learning.",
  });

  // Fetch user stats from API
  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.status === 200 && data.payload?.Stats) {
        setStats(data.payload.Stats);
        console.log('[PageProfil] User stats:', data.payload.Stats);
      }
    } catch (error) {
      console.error('[PageProfil] Error fetching stats:', error);
    }
  };

  // Level calculation
  const XP_PER_LEVEL = 500;
  const totalXp = stats?.points ?? 0;
  const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const currentLevelXp = totalXp % XP_PER_LEVEL;
  const progressPercent = (currentLevelXp / XP_PER_LEVEL) * 100;
  const xpNeeded = XP_PER_LEVEL - currentLevelXp;

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: user?.name ?? f.name,
      email: user?.email ?? f.email,
      avatar: user?.avatar ?? f.avatar,
      phone: user?.phone ?? f.phone,
      address: user?.address ?? f.address,
      about: user?.about ?? f.about,
    }));
  }, [user]);

  const handleChange = (k: string, v: string) => {
    setForm((s) => ({ ...s, [k]: v }));
  };

  const handleSave = () => {
    const updated: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      about?: string;
      avatar?: string;
    } = {};
    if (form.name !== (user?.name ?? "Rian Ansari")) updated.name = form.name;
    if (form.email !== (user?.email ?? "rian@email.com"))
      updated.email = form.email;
    if (form.phone !== (user?.phone ?? "+62 812-xxxx-xxxx"))
      updated.phone = form.phone;
    if (form.address !== (user?.address ?? "Sumatera Utara, Indonesia"))
      updated.address = form.address;
    if (form.about !== (user?.about ?? "")) updated.about = form.about;
    if (form.avatar !== (user?.avatar ?? "")) updated.avatar = form.avatar;
    if (Object.keys(updated).length > 0) {
      onUpdateUser?.(updated);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm((s) => ({
      ...s,
      name: user?.name ?? s.name,
      email: user?.email ?? s.email,
      avatar: user?.avatar ?? s.avatar,
      phone: user?.phone ?? s.phone,
      address: user?.address ?? s.address,
      about: user?.about ?? s.about,
    }));
    setIsEditing(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <Card className="rounded-2xl shadow-2xl bg-slate-950/80 border border-slate-800">
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FOTO PROFIL */}
            <div className="flex flex-col items-center text-center">
              <div
                className="rounded-full p-2"
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 9999,
                  backgroundColor: "#fb923c",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-black text-5xl font-bold shadow-lg"
                  style={{ boxSizing: "border-box" }}
                >
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="avatar"
                      className="w-full h-full"
                      style={{ objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>
              </div>

              {!isEditing ? (
                <>
                  <h2 className="mt-4 text-2xl font-semibold text-black">
                    {form.name}
                  </h2>
                  <p className="text-slate-400">Mahasiswa & Web Developer</p>

                  {/* Level Progress Card */}
                  <div className="w-full mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                          <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-slate-400">Current Level</p>
                          <p className="text-2xl font-bold text-white">Level {currentLevel}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Total XP</p>
                        <p className="text-lg font-bold text-indigo-300">{totalXp.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-400" />
                          {currentLevelXp} / {XP_PER_LEVEL} XP
                        </span>
                        <span className="text-indigo-300 font-medium">
                          {progressPercent.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={progressPercent}
                        className="h-3 bg-slate-700"
                      />
                      <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        Butuh <span className="text-indigo-300 font-semibold">{xpNeeded}</span> XP lagi untuk Level {currentLevel + 1}
                      </p>
                    </div>

                    {/* Stats Row */}
                    {stats && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span>{stats.lessonsCompleted ?? 0} Lessons</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 justify-end">
                          <span>{stats.points ?? 0} Points</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    className="mt-4 w-full rounded-xl"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profil
                  </Button>
                </>
              ) : (
                <div className="w-full mt-4 space-y-2">
                  <input
                    aria-label="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-black"
                  />
                  <input
                    aria-label="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-black"
                  />
                  <div>
                    <label className="text-sm text-slate-400">
                      Ganti Foto Profil
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = reader.result as string;
                          handleChange("avatar", result);
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="w-full mt-1"
                    />
                  </div>
                  <input
                    aria-label="phone"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-black"
                  />
                  <input
                    aria-label="address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-black"
                  />
                  <textarea
                    aria-label="about"
                    value={form.about}
                    onChange={(e) => handleChange("about", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-white text-black h-24"
                  />
                  <div className="flex gap-2">
                    <Button className="w-1/2" onClick={handleSave}>
                      Simpan
                    </Button>
                    <Button
                      className="w-1/2"
                      variant="secondary"
                      onClick={handleCancel}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* INFO UTAMA */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-semibold text-black border-b border-slate-700 pb-2">
                Informasi Pribadi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Mail className="text-indigo-400" />
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-black">{form.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Phone className="text-indigo-400" />
                  <div>
                    <p className="text-sm text-slate-400">Telepon</p>
                    <p className="text-black">{form.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 sm:col-span-2">
                  <MapPin className="text-indigo-400" />
                  <div>
                    <p className="text-sm text-slate-400">Alamat</p>
                    <p className="text-black">{form.address}</p>
                  </div>
                </div>
              </div>

              {/* ABOUT */}
              <div>
                <h3 className="text-xl font-semibold text-black border-b border-slate-700 pb-2">
                  Tentang Saya
                </h3>
                <p className="mt-3 text-slate-300 leading-relaxed">
                  {form.about}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default PageProfil;
