import { Clock, Award, TrendingUp, Target, BookOpen, Loader2, AlertCircle, RefreshCw, Play, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

// Interfaces for API response
interface CourseData {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  category: string;
  image: string | null;
  students: number;
  rating: number;
}

interface MyLearningItem {
  enrollmentId: number;
  enrolledAt: string;
  status: string;
  completedAt: string | null;
  course: CourseData;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lastLesson: string | null;
  nextLessonId: number | null;
}

interface UserStats {
  lessonsCompleted: number;
  totalTimeSpent: string;
  currentStreak: number;
  longestStreak: number;
  points: number;
}

interface MyLearningProps {
  onNavigate: (page: string, courseId?: number) => void;
  onLessonStart?: (lessonId: number) => void;
}

export function MyLearning({ onNavigate, onLessonStart }: MyLearningProps) {
  // State for API data
  const [courses, setCourses] = useState<MyLearningItem[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
  };

  // Fetch my learning data
  useEffect(() => {
    const fetchMyLearning = async () => {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError('Silakan login untuk melihat pembelajaran Anda');
        setLoading(false);
        return;
      }

      try {
        // Fetch courses and stats in parallel
        const [coursesResponse, statsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/courses/my-learning`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/progress/stats`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        // Handle courses response
        if (!coursesResponse.ok) {
          throw new Error('Gagal memuat data pembelajaran');
        }
        const coursesData = await coursesResponse.json();
        if (coursesData.status === 200 && coursesData.payload) {
          setCourses(coursesData.payload);
        }

        // Handle stats response
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.status === 200 && statsData.payload) {
            setUserStats(statsData.payload);
          }
        }
      } catch (err) {
        console.error('Error fetching my learning:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchMyLearning();
  }, []);

  // Handle continue learning button
  const handleContinue = (item: MyLearningItem) => {
    if (item.nextLessonId && onLessonStart) {
      onLessonStart(item.nextLessonId);
    } else {
      // Fallback to course detail
      onNavigate('course-detail', item.course.id);
    }
  };

  // Calculate level from points
  const currentLevel = userStats ? Math.floor(userStats.points / 1000) + 1 : 1;

  // Stats display
  const stats = [
    {
      icon: Target,
      label: 'Lessons Selesai',
      value: userStats?.lessonsCompleted?.toString() || '0',
      color: 'text-primary',
      bg: 'bg-orange-100'
    },
    {
      icon: Clock,
      label: 'Waktu Belajar',
      value: userStats?.totalTimeSpent || '0 jam',
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Streak',
      value: `${userStats?.currentStreak || 0} hari`,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      icon: Award,
      label: 'XP / Level',
      value: `${userStats?.points || 0} / Lv.${currentLevel}`,
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="py-12 bg-orange-50 min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
            <h2 className="text-xl font-semibold">Memuat Pembelajaran...</h2>
            <p className="text-gray-600">Mohon tunggu sebentar</p>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 bg-orange-50 min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold">Gagal Memuat Data</h2>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-12 bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Pembelajaran Saya</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className={`h-12 w-12 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Active Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Kursus Aktif</h2>

          {courses.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <BookOpen className="h-16 w-16 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600">Belum Ada Kursus</h3>
                <p className="text-gray-500 mb-4">
                  Anda belum terdaftar di kursus apapun. Mulai belajar sekarang!
                </p>
                <Button
                  onClick={() => onNavigate('courses')}
                  className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <BookOpen className="h-4 w-4" />
                  Jelajahi Kursus
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {courses.map((item) => (
                <Card
                  key={item.enrollmentId}
                  className="p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Course Image */}
                    {item.course.image && (
                      <div className="hidden md:block w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.course.image}
                          alt={item.course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold truncate">{item.course.title}</h3>
                        {item.status === 'completed' && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {item.course.level}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {item.course.duration}
                        </span>
                        {item.lastLesson && (
                          <span className="text-sm text-gray-600">
                            Terakhir: {item.lastLesson}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <span>
                          {item.completedLessons}/{item.totalLessons} lessons
                        </span>
                        <span className="font-semibold text-orange-600">
                          {item.progressPercent}% selesai
                        </span>
                      </div>

                      <Progress value={item.progressPercent} className="h-2" />
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => handleContinue(item)}
                        className={`gap-2 ${item.progressPercent === 100
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                          }`}
                      >
                        <Play className="h-4 w-4" />
                        {item.progressPercent === 100 ? 'Ulangi' : 'Lanjutkan'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Pencapaian</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* First Steps - Unlocked if > 0 lessons completed */}
            <Card className={`p-6 text-center transition-all duration-300 ${(userStats?.lessonsCompleted || 0) > 0
              ? 'hover:shadow-lg border-amber-200'
              : 'opacity-50'
              }`}>
              <div className={`h-16 w-16 ${(userStats?.lessonsCompleted || 0) > 0
                ? 'bg-amber-100'
                : 'bg-gray-100'
                } rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Award className={`h-8 w-8 ${(userStats?.lessonsCompleted || 0) > 0
                  ? 'text-amber-600'
                  : 'text-gray-400'
                  }`} />
              </div>
              <h3 className="font-bold mb-1">First Steps</h3>
              <p className="text-sm text-gray-600">Selesaikan lesson pertama</p>
            </Card>

            {/* Week Warrior - Unlocked if streak >= 7 */}
            <Card className={`p-6 text-center transition-all duration-300 ${(userStats?.currentStreak || 0) >= 7
              ? 'hover:shadow-lg border-purple-200'
              : 'opacity-50'
              }`}>
              <div className={`h-16 w-16 ${(userStats?.currentStreak || 0) >= 7
                ? 'bg-purple-100'
                : 'bg-gray-100'
                } rounded-full flex items-center justify-center mx-auto mb-3`}>
                <TrendingUp className={`h-8 w-8 ${(userStats?.currentStreak || 0) >= 7
                  ? 'text-purple-600'
                  : 'text-gray-400'
                  }`} />
              </div>
              <h3 className="font-bold mb-1">Week Warrior</h3>
              <p className="text-sm text-gray-600">Belajar 7 hari berturut-turut</p>
            </Card>

            {/* Course Master - Unlocked if any course completed */}
            <Card className={`p-6 text-center transition-all duration-300 ${courses.some(c => c.status === 'completed')
              ? 'hover:shadow-lg border-green-200'
              : 'opacity-50'
              }`}>
              <div className={`h-16 w-16 ${courses.some(c => c.status === 'completed')
                ? 'bg-green-100'
                : 'bg-gray-100'
                } rounded-full flex items-center justify-center mx-auto mb-3`}>
                <CheckCircle2 className={`h-8 w-8 ${courses.some(c => c.status === 'completed')
                  ? 'text-green-600'
                  : 'text-gray-400'
                  }`} />
              </div>
              <h3 className="font-bold mb-1">Course Master</h3>
              <p className="text-sm text-gray-600">Selesaikan satu kursus penuh</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}