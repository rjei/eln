import { BookOpen, Users, Award, TrendingUp, ArrowRight, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: BookOpen,
      title: "Materi Lengkap",
      description: "Dari basic hingga advanced dengan kurikulum terstruktur",
    },
    {
      icon: Video,
      title: "Video Learning",
      description: "Belajar dengan video interaktif dan subtitle real-time",
      link: "comprehensible-input",
    },
    {
      icon: Users,
      title: "Instruktur Berpengalaman",
      description: "Belajar dari native speaker dan certified teachers",
    },
    {
      icon: Award,
      title: "Sertifikat Resmi",
      description: "Dapatkan sertifikat setelah menyelesaikan kursus",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Pantau perkembangan belajar Anda secara real-time",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Siswa Aktif" },
    { value: "50+", label: "Kursus Tersedia" },
    { value: "95%", label: "Tingkat Kepuasan" },
    { value: "24/7", label: "Akses Materi" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-orange-700 text-white animate-gradient overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-5xl mb-6 font-extrabold leading-tight">
                Kuasai Bahasa Inggris dengan Mudah dan Menyenangkan
              </h1>
              <p className="text-xl mb-8 text-orange-50">
                Platform e-learning terbaik untuk menguasai bahasa Inggris.
                Belajar kapan saja, dimana saja dengan metode yang terbukti
                efektif.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => onNavigate("courses")}
                  className="gap-2 hover:scale-110 hover:shadow-2xl transition-all duration-300 animate-pulse-glow"
                >
                  Mulai Belajar
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Lihat Demo
                </Button>
              </div>
            </div>
            <div className="hidden md:block animate-slide-in-right">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1543109740-4bdb38fda756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzYyMzA0NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="English Learning"
                className="rounded-lg shadow-2xl w-full h-auto hover:scale-110 hover:rotate-2 transition-all duration-500 animate-bounce-slow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Mengapa Memilih ELn?</h2>
            <p className="text-xl text-gray-600">
              Platform pembelajaran bahasa Inggris terlengkap dan paling efektif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  onClick={() => feature.link && onNavigate(feature.link)}
                  className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 cursor-pointer group border-2 border-transparent hover:border-primary/30 animate-fade-in-up hover-shine"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 ${
                    feature.link ? 'bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-500 group-hover:to-pink-500 animate-gradient' : 'bg-orange-50 group-hover:bg-primary'
                  }`}>
                    <Icon className={`h-6 w-6 transition-colors ${
                      feature.link ? 'text-purple-600 group-hover:text-white' : 'text-primary group-hover:text-white'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                  {feature.link && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 font-semibold group-hover:gap-3 transition-all">
                      Coba Sekarang <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-orange-600 to-orange-700 text-white animate-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE zNGMwLTYuNjI3LTUuMzczLTEyLTEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyem0wIDYwYzAtNi42MjctNS4zNzMtMTItMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl mb-6 font-extrabold animate-scale-in">
            Siap Mulai Perjalanan Bahasa Inggris Anda?
          </h2>
          <p className="text-xl mb-8 text-orange-50 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Bergabunglah dengan ribuan siswa yang telah meningkatkan kemampuan
            bahasa Inggris mereka
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate("courses")}
            className="gap-2 hover:scale-110 hover:shadow-2xl transition-all duration-300 animate-bounce-slow hover-shine"
          >
            Jelajahi Kursus
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
