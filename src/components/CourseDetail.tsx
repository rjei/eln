import {
  Clock,
  Users,
  Star,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  ArrowLeft,
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

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseDetailProps {
  courseId: number;
  onBack: () => void;
  onStartLesson: (lessonId: number) => void;
}

export function CourseDetail({
  courseId,
  onBack,
  onStartLesson,
}: CourseDetailProps) {
  const courseData = {
    1: {
      title: "English for Beginners",
      description:
        "Mulai perjalanan bahasa Inggris Anda dari dasar. Pelajari vocabulary, grammar, dan conversation dasar dengan metode yang mudah dipahami dan menyenangkan.",
      level: "Beginner",
      duration: "8 minggu",
      students: 2450,
      rating: 4.8,
      lessons: 32,
      image:
        "https://images.unsplash.com/photo-1543109740-4bdb38fda756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzYyMzA0NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      instructor: "Sarah Johnson",
      modules: [
        {
          id: 1,
          title: "Introduction & Basic Greetings",
          lessons: [
            {
              id: 1,
              title: "Welcome to English Learning",
              duration: "5 menit",
              completed: true,
            },
            {
              id: 2,
              title: "Basic Greetings & Introductions",
              duration: "12 menit",
              completed: true,
            },
            {
              id: 3,
              title: "Practice: Self Introduction",
              duration: "10 menit",
              completed: false,
            },
          ],
        },
        {
          id: 2,
          title: "Alphabet & Pronunciation",
          lessons: [
            {
              id: 4,
              title: "English Alphabet A-Z",
              duration: "15 menit",
              completed: false,
            },
            {
              id: 5,
              title: "Vowels & Consonants",
              duration: "12 menit",
              completed: false,
            },
            {
              id: 6,
              title: "Pronunciation Practice",
              duration: "18 menit",
              completed: false,
            },
          ],
        },
        {
          id: 3,
          title: "Numbers & Colors",
          lessons: [
            {
              id: 7,
              title: "Numbers 1-100",
              duration: "10 menit",
              completed: false,
            },
            {
              id: 8,
              title: "Colors & Shapes",
              duration: "8 menit",
              completed: false,
            },
            {
              id: 9,
              title: "Quiz: Numbers & Colors",
              duration: "15 menit",
              completed: false,
            },
          ],
        },
      ],
    },
    2: {
      title: "Intermediate English Mastery",
      description:
        "Tingkatkan kemampuan bahasa Inggris Anda ke level menengah. Pelajari grammar kompleks, ekspansi vocabulary, dan kemampuan conversation yang lebih advanced untuk situasi sehari-hari dan profesional.",
      level: "Intermediate",
      duration: "10 minggu",
      students: 1850,
      rating: 4.9,
      lessons: 42,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdHVkZW50cyUyMGxlYXJuaW5nfGVufDF8fHx8MTc2MjMwNDU2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      instructor: "Michael Chen",
      modules: [
        {
          id: 1,
          title: "Grammar Essentials (Intermediate)",
          lessons: [
            {
              id: 4,
              title: "Present Perfect Tense",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 11,
              title: "Past Perfect & Future Perfect",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 12,
              title: "Conditional Sentences (Type 1-3)",
              duration: "22 menit",
              completed: false,
            },
            {
              id: 13,
              title: "Passive Voice",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 14,
              title: "Reported Speech",
              duration: "20 menit",
              completed: false,
            },
          ],
        },
        {
          id: 2,
          title: "Vocabulary Expansion",
          lessons: [
            {
              id: 5,
              title: "Business & Professional Vocabulary",
              duration: "16 menit",
              completed: false,
            },
            {
              id: 15,
              title: "Academic Vocabulary",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 16,
              title: "Idioms & Phrasal Verbs",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 17,
              title: "Collocations & Word Pairs",
              duration: "15 menit",
              completed: false,
            },
            {
              id: 18,
              title: "Synonyms & Antonyms",
              duration: "15 menit",
              completed: false,
            },
          ],
        },
        {
          id: 3,
          title: "Speaking Mastery",
          lessons: [
            {
              id: 6,
              title: "Small Talk & Conversation Strategies",
              duration: "14 menit",
              completed: false,
            },
            {
              id: 19,
              title: "Pronunciation & Intonation",
              duration: "16 menit",
              completed: false,
            },
            {
              id: 20,
              title: "Expressing Opinions",
              duration: "14 menit",
              completed: false,
            },
            {
              id: 21,
              title: "Debate & Argumentation",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 22,
              title: "Presentation Skills",
              duration: "20 menit",
              completed: false,
            },
          ],
        },
        {
          id: 4,
          title: "Writing Skills (Intermediate Level)",
          lessons: [
            {
              id: 23,
              title: "Essay Writing Basics",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 24,
              title: "Paragraph Structure",
              duration: "15 menit",
              completed: false,
            },
            {
              id: 25,
              title: "Email & Letter Writing",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 26,
              title: "Descriptive Writing",
              duration: "16 menit",
              completed: false,
            },
            {
              id: 27,
              title: "Narrative Writing",
              duration: "16 menit",
              completed: false,
            },
          ],
        },
        {
          id: 5,
          title: "Listening Improvement",
          lessons: [
            {
              id: 28,
              title: "Understanding Native Speakers",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 29,
              title: "Listening for Main Ideas",
              duration: "16 menit",
              completed: false,
            },
            {
              id: 30,
              title: "Note-Taking While Listening",
              duration: "15 menit",
              completed: false,
            },
            {
              id: 31,
              title: "Understanding Accents",
              duration: "17 menit",
              completed: false,
            },
            {
              id: 32,
              title: "Listening Practice: Podcasts & News",
              duration: "20 menit",
              completed: false,
            },
          ],
        },
        {
          id: 6,
          title: "Reading Skills",
          lessons: [
            {
              id: 33,
              title: "Skimming & Scanning Techniques",
              duration: "15 menit",
              completed: false,
            },
            {
              id: 34,
              title: "Reading Comprehension Strategies",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 35,
              title: "Understanding Context Clues",
              duration: "16 menit",
              completed: false,
            },
            {
              id: 36,
              title: "Critical Reading Skills",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 37,
              title: "Reading Practice: Articles & Stories",
              duration: "22 menit",
              completed: false,
            },
          ],
        },
        {
          id: 7,
          title: "Mastery Exercises",
          lessons: [
            {
              id: 38,
              title: "Comprehensive Review: Grammar",
              duration: "25 menit",
              completed: false,
            },
            {
              id: 39,
              title: "Comprehensive Review: Vocabulary",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 40,
              title: "Mock Speaking Test",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 41,
              title: "Mock Writing Test",
              duration: "30 menit",
              completed: false,
            },
            {
              id: 42,
              title: "Final Assessment",
              duration: "45 menit",
              completed: false,
            },
          ],
        },
        {
          id: 8,
          title: "Bonus: Study Tips",
          lessons: [
            {
              id: 43,
              title: "Effective Study Methods",
              duration: "12 menit",
              completed: false,
            },
            {
              id: 44,
              title: "Learning Resources & Tools",
              duration: "10 menit",
              completed: false,
            },
            {
              id: 45,
              title: "Time Management for Language Learning",
              duration: "10 menit",
              completed: false,
            },
            {
              id: 46,
              title: "Staying Motivated",
              duration: "8 menit",
              completed: false,
            },
            {
              id: 47,
              title: "Certificate of Completion",
              duration: "5 menit",
              completed: false,
            },
          ],
        },
      ],
    },
    3: {
      title: "Business English Professional",
      description:
        "Kuasai bahasa Inggris untuk dunia kerja. Email, presentation, meeting, dan negotiation skills untuk kesuksesan karir profesional Anda.",
      level: "Advanced",
      duration: "12 minggu",
      students: 1560,
      rating: 4.9,
      lessons: 45,
      image:
        "https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjIyOTcyODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      instructor: "David Williams",
      modules: [
        {
          id: 1,
          title: "Business Communication Basics",
          lessons: [
            {
              id: 101,
              title: "Professional Email Writing",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 102,
              title: "Business Phone Calls",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 103,
              title: "Meeting Etiquette",
              duration: "15 menit",
              completed: false,
            },
          ],
        },
        {
          id: 2,
          title: "Presentations & Negotiations",
          lessons: [
            {
              id: 104,
              title: "Effective Presentations",
              duration: "25 menit",
              completed: false,
            },
            {
              id: 105,
              title: "Negotiation Techniques",
              duration: "22 menit",
              completed: false,
            },
            {
              id: 106,
              title: "Closing Deals",
              duration: "20 menit",
              completed: false,
            },
          ],
        },
        {
          id: 3,
          title: "Corporate English",
          lessons: [
            {
              id: 107,
              title: "Business Reports",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 108,
              title: "Project Proposals",
              duration: "22 menit",
              completed: false,
            },
            {
              id: 109,
              title: "Executive Summary Writing",
              duration: "20 menit",
              completed: false,
            },
          ],
        },
      ],
    },
    4: {
      title: "TOEFL Preparation Course",
      description:
        "Persiapan lengkap untuk tes TOEFL dengan strategi, tips, dan latihan soal komprehensif. Tingkatkan skor TOEFL Anda secara signifikan.",
      level: "Intermediate",
      duration: "8 minggu",
      students: 980,
      rating: 4.7,
      lessons: 36,
      image:
        "https://images.unsplash.com/photo-1566314748815-2ff5db8edf2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIxOTEzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      instructor: "Jennifer Lee",
      modules: [
        {
          id: 1,
          title: "TOEFL Reading Section",
          lessons: [
            {
              id: 201,
              title: "Reading Strategies",
              duration: "25 menit",
              completed: false,
            },
            {
              id: 202,
              title: "Vocabulary Building",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 203,
              title: "Practice Tests",
              duration: "30 menit",
              completed: false,
            },
          ],
        },
        {
          id: 2,
          title: "TOEFL Listening Section",
          lessons: [
            {
              id: 204,
              title: "Note-Taking Skills",
              duration: "18 menit",
              completed: false,
            },
            {
              id: 205,
              title: "Understanding Lectures",
              duration: "22 menit",
              completed: false,
            },
            {
              id: 206,
              title: "Conversation Practice",
              duration: "20 menit",
              completed: false,
            },
          ],
        },
        {
          id: 3,
          title: "TOEFL Speaking & Writing",
          lessons: [
            {
              id: 207,
              title: "Speaking Templates",
              duration: "20 menit",
              completed: false,
            },
            {
              id: 208,
              title: "Essay Writing",
              duration: "25 menit",
              completed: false,
            },
            {
              id: 209,
              title: "Full Mock Test",
              duration: "45 menit",
              completed: false,
            },
          ],
        },
      ],
    },
  };

  const course = courseData[courseId as keyof typeof courseData];

  // Guard clause for undefined course
  if (!course) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Course tidak ditemukan
            </h2>
            <p className="text-gray-600">
              Course ID "{courseId}" tidak tersedia.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const completedLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter((l) => l.completed).length,
    0
  );
  const progress = (completedLessons / totalLessons) * 100;

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
                <p className="text-gray-600 mb-4">Oleh {course.instructor}</p>
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
                        {course.lessons} materi
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors cursor-pointer group">
                    <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm">Siswa</div>
                      <div className="font-semibold">
                        {course.students.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Content */}
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Isi Kursus</h2>
              <Accordion type="single" collapsible defaultValue="module-1">
                {course.modules.map((module) => (
                  <AccordionItem key={module.id} value={`module-${module.id}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span>{module.title}</span>
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
                                className={`${
                                  lesson.completed
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
                onClick={() => onStartLesson(3)}
              >
                Lanjutkan Belajar
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
