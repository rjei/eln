import { useState, useEffect } from "react";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { getCourseById, getLessonsByCourse, getProgressByCourse, Course, Lesson, UserProgress } from "../services/api";

interface CourseDetailProps {
  courseId: number;
  onBack: () => void;
  onStartLesson: (lessonId: number) => void;
}

interface DisplayLesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  order: number;
}

interface Module {
  id: number;
  title: string;
  lessons: DisplayLesson[];
}

export function CourseDetail({
  courseId,
  onBack,
  onStartLesson,
}: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course, lessons, and user progress data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch course details, lessons, and user progress in parallel
        const [courseData, lessonsData, progressData] = await Promise.all([
          getCourseById(courseId),
          getLessonsByCourse(courseId),
          getProgressByCourse(courseId)
        ]);

        setCourse(courseData);
        setLessons(lessonsData);
        setUserProgress(progressData);

        // Group lessons into modules with progress info
        const groupedModules = groupLessonsIntoModules(lessonsData, courseData.title, progressData);
        setModules(groupedModules);

      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat data kursus");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Helper function to group lessons into modules
  const groupLessonsIntoModules = (lessonsData: Lesson[], courseTitle: string, progressData: UserProgress[]): Module[] => {
    if (lessonsData.length === 0) {
      return [];
    }

    // Create a map of lessonId to completion status
    const completedLessonIds = new Set(
      progressData
        .filter(p => p.completed)
        .map(p => p.lessonId)
    );

    // Sort lessons by order
    const sortedLessons = [...lessonsData].sort((a, b) => a.order - b.order);

    // Group lessons into modules (3-4 lessons per module)
    const modulesArr: Module[] = [];
    const lessonsPerModule = 3;

    for (let i = 0; i < sortedLessons.length; i += lessonsPerModule) {
      const moduleLessons = sortedLessons.slice(i, i + lessonsPerModule);
      const moduleNumber = Math.floor(i / lessonsPerModule) + 1;

      // Generate module title based on first lesson title or generic name
      const firstLesson = moduleLessons[0];
      let moduleTitle = `Modul ${moduleNumber}`;

      // Try to create meaningful module titles based on lesson content
      if (firstLesson.title.toLowerCase().includes('introduction') ||
        firstLesson.title.toLowerCase().includes('welcome')) {
        moduleTitle = "Introduction & Basics";
      } else if (firstLesson.title.toLowerCase().includes('grammar')) {
        moduleTitle = "Grammar Essentials";
      } else if (firstLesson.title.toLowerCase().includes('vocabulary') ||
        firstLesson.title.toLowerCase().includes('business')) {
        moduleTitle = "Vocabulary Building";
      } else if (firstLesson.title.toLowerCase().includes('speaking') ||
        firstLesson.title.toLowerCase().includes('conversation')) {
        moduleTitle = "Speaking Practice";
      } else if (firstLesson.title.toLowerCase().includes('number') ||
        firstLesson.title.toLowerCase().includes('color')) {
        moduleTitle = "Numbers & Colors";
      } else if (firstLesson.title.toLowerCase().includes('reading')) {
        moduleTitle = "Reading Skills";
      } else if (firstLesson.title.toLowerCase().includes('listening')) {
        moduleTitle = "Listening Skills";
      } else if (firstLesson.title.toLowerCase().includes('tense') ||
        firstLesson.title.toLowerCase().includes('perfect')) {
        moduleTitle = "Tenses & Grammar";
      } else if (firstLesson.title.toLowerCase().includes('practice') ||
        firstLesson.title.toLowerCase().includes('quiz')) {
        moduleTitle = "Practice & Assessment";
      }

      modulesArr.push({
        id: moduleNumber,
        title: moduleTitle,
        lessons: moduleLessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: typeof lesson.duration === 'string' ? lesson.duration : `${lesson.duration} menit`,
          completed: completedLessonIds.has(lesson.id), // Check from user progress!
          order: lesson.order
        }))
      });
    }

    return modulesArr;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-orange-100 text-orange-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center bg-white shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-800">Memuat Kursus...</h2>
            <p className="text-gray-600">Mohon tunggu sebentar</p>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-orange-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                {error || "Kursus tidak ditemukan"}
              </h2>
              <p className="text-gray-600">
                Course ID "{courseId}" tidak tersedia atau terjadi kesalahan.
              </p>
              <Button onClick={onBack} className="mt-4">
                Kembali ke Daftar Kursus
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate progress
  const totalLessons = modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const completedLessons = modules.reduce(
    (acc, module) => acc + module.lessons.filter((l) => l.completed).length,
    0
  );
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Get first incomplete lesson for "Continue Learning" button
  const getNextLesson = (): number | null => {
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed) {
          return lesson.id;
        }
      }
    }
    // If all completed, return first lesson
    return modules[0]?.lessons[0]?.id || null;
  };

  const nextLessonId = getNextLesson();

  return (
    <div className="py-8 bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 hover:bg-white hover:shadow-md hover:-translate-x-1 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Kursus
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden mb-6 hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
                <p className="text-gray-600 mb-4">Kategori: {course.category || 'General'}</p>
                <p className="text-lg mb-6 leading-relaxed">
                  {course.description}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors cursor-pointer group">
                    <Clock className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm">Durasi</div>
                      <div className="font-semibold">{course.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors cursor-pointer group">
                    <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm">Lessons</div>
                      <div className="font-semibold">
                        {totalLessons} materi
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors cursor-pointer group">
                    <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm">Siswa</div>
                      <div className="font-semibold">
                        {course.students?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Content */}
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Isi Kursus</h2>

              {modules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Belum ada materi tersedia untuk kursus ini.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible defaultValue="module-1">
                  {modules.map((module) => (
                    <AccordionItem key={module.id} value={`module-${module.id}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <span>{module.title}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {module.lessons.length} lesson{module.lessons.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-8">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 hover:bg-orange-50 rounded cursor-pointer transition-all duration-300 hover:shadow-md hover:translate-x-1 group"
                              onClick={() => onStartLesson(lesson.id)}
                            >
                              <div className="flex items-center gap-3">
                                {lesson.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                                ) : (
                                  <PlayCircle className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                                )}
                                <span
                                  className={`${lesson.completed
                                    ? "text-gray-600"
                                    : "group-hover:text-primary"
                                    } transition-colors font-medium`}
                                >
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4">Progress Anda</h3>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Selesai
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {completedLessons}/{totalLessons} lessons
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-sm text-gray-600 mt-2 text-center">
                  <span className="text-2xl font-bold text-primary">
                    {Math.round(progress)}%
                  </span>{" "}
                  Complete
                </div>
              </div>

              <Button
                className="w-full mb-3 hover:scale-105 hover:shadow-lg transition-all duration-300"
                onClick={() => nextLessonId && onStartLesson(nextLessonId)}
                disabled={!nextLessonId}
              >
                {completedLessons > 0 ? "Lanjutkan Belajar" : "Mulai Belajar"}
              </Button>
              <Button
                variant="outline"
                className="w-full hover:bg-orange-50 transition-all duration-300"
              >
                Reset Progress
              </Button>

              <div className="mt-6 pt-6 border-t">
                <h4 className="mb-3">Yang Akan Anda Pelajari:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Dasar-dasar bahasa Inggris</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Grammar fundamental</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Conversation sehari-hari</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Listening & pronunciation</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
