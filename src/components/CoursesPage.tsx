import { useState } from "react";
import { Clock, Users, Star, BookOpen, Search, Filter } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  lessons: number;
  image: string;
  category: string;
}

interface CoursesPageProps {
  onSelectCourse: (courseId: number) => void;
}

export function CoursesPage({ onSelectCourse }: CoursesPageProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const courses: Course[] = [
    {
      id: 1,
      title: "English for Beginners",
      description:
        "Mulai perjalanan bahasa Inggris Anda dari dasar. Pelajari vocabulary, grammar, dan conversation dasar.",
      level: "Beginner",
      duration: "8 minggu",
      students: 2450,
      rating: 4.8,
      lessons: 32,
      category: "General",
      image:
        "https://images.unsplash.com/photo-1543109740-4bdb38fda756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzYyMzA0NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      title: "Intermediate English Mastery",
      description:
        "Tingkatkan kemampuan berbahasa Inggris Anda ke level menengah dengan fokus pada speaking dan writing.",
      level: "Intermediate",
      duration: "10 minggu",
      students: 1820,
      rating: 4.9,
      lessons: 40,
      category: "Conversation",
      image:
        "https://images.unsplash.com/photo-1596247290824-e9f12b8c574f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBvbmxpbmV8ZW58MXx8fHwxNzYyMjU0NjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      title: "Business English Professional",
      description:
        "Kuasai bahasa Inggris untuk dunia kerja. Email, presentation, meeting, dan negotiation skills.",
      level: "Advanced",
      duration: "12 minggu",
      students: 1560,
      rating: 4.9,
      lessons: 45,
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjIyOTcyODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 4,
      title: "TOEFL Preparation Course",
      description:
        "Persiapan lengkap untuk tes TOEFL dengan strategi, tips, dan latihan soal komprehensif.",
      level: "Intermediate",
      duration: "8 minggu",
      students: 980,
      rating: 4.7,
      lessons: 36,
      category: "Test Prep",
      image:
        "https://images.unsplash.com/photo-1566314748815-2ff5db8edf2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIxOTEzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLevel && matchesCategory && matchesSearch;
  });

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const categories = [
    "All",
    "General",
    "Business",
    "Conversation",
    "Test Prep",
  ];

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
    <div className="py-12 bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 min-h-screen animate-gradient">
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-slide-in-left">
          <h1 className="text-4xl mb-4 font-extrabold">Jelajahi Kursus</h1>
          <p className="text-xl text-gray-600">
            Pilih kursus yang sesuai dengan level dan tujuan belajar Anda
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl animate-scale-in">
          <div className="relative hover-shine">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Cari kursus berdasarkan nama atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-base shadow-lg border-2 border-gray-200 focus:border-primary focus:scale-105 transition-all hover:shadow-xl"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Level Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-700">Level</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  onClick={() => setSelectedLevel(level)}
                  className={`transition-all duration-300 hover-shine ${
                    selectedLevel === level
                      ? "scale-110 shadow-2xl animate-pulse-glow"
                      : "hover:scale-110 hover:shadow-xl"
                  }`}
                >
                  {level}
                  {level !== "All" && selectedLevel === level && (
                    <Badge className="ml-2 bg-white/20">
                      {filteredCourses.filter((c) => c.level === level).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Kategori
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all duration-300 hover-shine ${
                    selectedCategory === category
                      ? "scale-110 shadow-2xl animate-pulse-glow"
                      : "hover:scale-110 hover:shadow-xl"
                  }`}
                >
                  {category}
                  {category !== "All" && selectedCategory === category && (
                    <Badge className="ml-2 bg-white/20">
                      {
                        filteredCourses.filter((c) => c.category === category)
                          .length
                      }
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan{" "}
            <span className="font-bold text-primary">
              {filteredCourses.length}
            </span>{" "}
            dari <span className="font-bold">{courses.length}</span> kursus
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 animate-[fadeIn_0.5s_ease-in]">
            {filteredCourses.map((course, index) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 cursor-pointer group border-2 border-transparent hover:border-primary/30 animate-[fadeInUp_0.5s_ease-out] hover-lift hover-shine"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-2 relative h-48 md:h-auto overflow-hidden">
                    <ImageWithFallback
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                    />
                    <Badge
                      className={`absolute top-3 left-3 ${getLevelColor(
                        course.level
                      )} shadow-md`}
                    >
                      {course.level}
                    </Badge>
                    <Badge className="absolute bottom-3 left-3 bg-white/90 text-gray-700 shadow-md">
                      {course.category}
                    </Badge>
                  </div>

                  <div className="md:col-span-3 p-6 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{course.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons} lessons
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          {course.students.toLocaleString()} siswa
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          {course.rating} rating
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => onSelectCourse(course.id)}
                      className="w-full hover:scale-110 hover:shadow-2xl transition-all duration-300 hover-shine"
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">
              Tidak ada kursus ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <Button
              onClick={() => {
                setSelectedLevel("All");
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              variant="outline"
            >
              Reset Filter
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
