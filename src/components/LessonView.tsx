import { ArrowLeft, CheckCircle2, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState, useRef } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { InteractiveTranscript } from "./InteractiveTranscript";

interface TranscriptSegment {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  speaker: string;
}

interface LessonViewProps {
  lessonId: number;
  onBack: () => void;
  onComplete: () => void;
}

export function LessonView({ lessonId, onBack, onComplete }: LessonViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement>(null);

  const lessonData = {
    1: {
      title: "Welcome to English Learning",
      duration: "5 menit",
      content: {
        text: `Selamat datang di kursus English for Beginners! 

Kursus ini dirancang khusus untuk Anda yang ingin memulai perjalanan belajar bahasa Inggris dari nol. Kami akan membantu Anda memahami dasar-dasar bahasa Inggris dengan cara yang mudah dan menyenangkan.

Apa yang akan Anda pelajari:
• Alphabet dan pronunciation
• Vocabulary dasar sehari-hari
• Grammar fundamental
• Conversation sederhana
• Listening comprehension

Metode pembelajaran:
Kami menggunakan pendekatan interaktif yang menggabungkan video, audio, teks, dan latihan interaktif. Setiap lesson dirancang untuk membangun pemahaman Anda secara bertahap.

Tips untuk sukses:
1. Luangkan waktu 20-30 menit setiap hari untuk belajar
2. Jangan takut membuat kesalahan - itu bagian dari proses belajar
3. Praktikkan apa yang Anda pelajari dalam kehidupan sehari-hari
4. Ulangi materi yang sulit sampai Anda memahaminya

Mari kita mulai perjalanan belajar bahasa Inggris Anda!`,
        vocabulary: [
          {
            word: "Welcome",
            meaning: "Selamat datang",
            example: "Welcome to our class!",
          },
          {
            word: "Learning",
            meaning: "Pembelajaran",
            example: "English learning is fun!",
          },
          {
            word: "Beginner",
            meaning: "Pemula",
            example: "This course is for beginners.",
          },
        ],
        quiz: {
          question: 'Apa arti dari kata "Welcome"?',
          options: [
            "Selamat tinggal",
            "Selamat datang",
            "Terima kasih",
            "Sampai jumpa",
          ],
          correctAnswer: 1,
        },
      },
    },
    2: {
      title: "Basic Greetings & Introductions",
      duration: "12 menit",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 7,
          text: "Hello everyone! Today we're going to learn about greetings and introductions in English.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 7,
          endTime: 14,
          text: "We use different greetings for different times of the day. Good morning, good afternoon, and good evening.",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 14,
          endTime: 22,
          text: "When meeting someone for the first time, you can say: Nice to meet you! or Pleased to meet you!",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 22,
          endTime: 30,
          text: "Let's practice these greetings together. Remember to smile and make eye contact!",
          speaker: "Teacher",
        },
      ] as TranscriptSegment[],
      content: {
        text: `Greetings (Salam) adalah cara kita menyapa orang lain dalam bahasa Inggris. Mari pelajari berbagai cara menyapa dalam situasi berbeda.

Common Greetings:
• Hello / Hi - Halo (informal)
• Good morning - Selamat pagi
• Good afternoon - Selamat siang
• Good evening - Selamat sore/malam
• How are you? - Apa kabar?

Responding to Greetings:
• I'm fine, thank you - Saya baik, terima kasih
• I'm good - Saya baik
• Not bad - Lumayan
• I'm great! - Saya sangat baik!

Self Introduction:
"Hello, my name is [Your Name]. I'm from [Your City]. Nice to meet you!"

Practice:
Coba perkenalkan diri Anda dalam bahasa Inggris menggunakan format di atas. Ulangi beberapa kali sampai Anda merasa nyaman.`,
        vocabulary: [
          { word: "Hello", meaning: "Halo", example: "Hello! How are you?" },
          {
            word: "Morning",
            meaning: "Pagi",
            example: "Good morning, everyone!",
          },
          { word: "Meet", meaning: "Bertemu", example: "Nice to meet you!" },
          { word: "Name", meaning: "Nama", example: "My name is Sarah." },
        ],
        quiz: {
          question:
            "Bagaimana cara menyapa orang di pagi hari dalam bahasa Inggris?",
          options: [
            "Good night",
            "Good morning",
            "Good evening",
            "Good afternoon",
          ],
          correctAnswer: 1,
        },
      },
    },
    3: {
      title: "Practice: Self Introduction",
      duration: "10 menit",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 8,
          text: "Welcome back! In this lesson, we'll practice introducing ourselves in English.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 8,
          endTime: 16,
          text: "Let's start with a basic template: Hello, my name is [your name]. I'm from [your city].",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 16,
          endTime: 24,
          text: "You can add more information like your job or hobbies. For example: I'm a teacher. I like reading books.",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 24,
          endTime: 32,
          text: "Always end with a friendly phrase like 'Nice to meet you!' or 'Pleased to meet you!'",
          speaker: "Teacher",
        },
        {
          id: 5,
          startTime: 32,
          endTime: 40,
          text: "Now practice saying your own introduction out loud. Don't be shy!",
          speaker: "Teacher",
        },
      ],
      content: {
        text: `Sekarang saatnya praktek! Mari kita latih kemampuan memperkenalkan diri dalam bahasa Inggris.

Template Perkenalan Diri:

Basic Introduction:
"Hello, my name is _____. I'm from _____. Nice to meet you!"

Extended Introduction:
"Hi! My name is _____. I'm from _____ in _____. 
I'm a _____ (pekerjaan/status). 
I like _____ (hobi). 
Pleased to meet you!"

Contoh:
"Hi! My name is Budi. I'm from Jakarta in Indonesia.
I'm a student.
I like reading and playing football.
Pleased to meet you!"

Exercise:
Buatlah perkenalan diri Anda sendiri menggunakan template di atas. Tuliskan dan ucapkan dengan lantang beberapa kali.

Key Phrases:
• My name is... - Nama saya adalah...
• I'm from... - Saya berasal dari...
• I like... - Saya suka...
• Nice to meet you - Senang bertemu denganmu
• Pleased to meet you - Senang berkenalan denganmu`,
        vocabulary: [
          {
            word: "Introduction",
            meaning: "Perkenalan",
            example: "Let me make an introduction.",
          },
          {
            word: "Student",
            meaning: "Pelajar/Mahasiswa",
            example: "I am a student.",
          },
          { word: "Like", meaning: "Suka", example: "I like music." },
          {
            word: "Pleased",
            meaning: "Senang",
            example: "Pleased to meet you!",
          },
        ],
        quiz: {
          question: 'Apa bahasa Inggris dari "Senang bertemu denganmu"?',
          options: [
            "See you later",
            "Nice to meet you",
            "Good bye",
            "How are you",
          ],
          correctAnswer: 1,
        },
      },
    },
    // Intermediate English Mastery - Lesson 1
    4: {
      title: "Present Perfect Tense",
      duration: "18 menit",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 10,
          text: "Today we're learning about Present Perfect Tense. This is an important grammar structure in English.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 10,
          endTime: 20,
          text: "We use Present Perfect to talk about actions that happened at an unspecified time or actions that affect the present.",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 20,
          endTime: 30,
          text: "The formula is: Subject plus have or has, plus the past participle form of the verb.",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 30,
          endTime: 40,
          text: "For example: I have studied English for five years. She has visited Bali twice.",
          speaker: "Teacher",
        },
        {
          id: 5,
          startTime: 40,
          endTime: 50,
          text: "Common time markers include: already, yet, just, ever, and never. These help us know when to use Present Perfect.",
          speaker: "Teacher",
        },
        {
          id: 6,
          startTime: 50,
          endTime: 60,
          text: "Remember: Have you ever been to Japan? Has she called you today? These are typical Present Perfect questions.",
          speaker: "Teacher",
        },
      ],
      content: {
        text: `Present Perfect Tense digunakan untuk menyatakan tindakan yang telah selesai di waktu yang tidak spesifik atau tindakan yang masih berhubungan dengan saat ini.

Formula:
Subject + have/has + past participle (V3)

Positive:
• I have studied English for 5 years.
• She has visited Bali twice.
• They have finished their homework.

Negative:
• I have not (haven't) eaten breakfast.
• He has not (hasn't) arrived yet.

Question:
• Have you ever been to Japan?
• Has she called you today?

Time Markers:
• already - sudah
• yet - belum (dalam kalimat negatif/tanya)
• just - baru saja
• ever - pernah
• never - tidak pernah
• for - selama (durasi)
• since - sejak (titik waktu)

Contoh dalam Percakapan:
A: "Have you finished your project?"
B: "Yes, I have just completed it."

A: "Has John arrived?"
B: "No, he hasn't arrived yet."

Perbedaan dengan Simple Past:
• Simple Past: I went to Paris in 2020. (waktu spesifik)
• Present Perfect: I have been to Paris. (pengalaman, waktu tidak penting)`,
        vocabulary: [
          {
            word: "Already",
            meaning: "Sudah",
            example: "I have already finished my homework.",
          },
          {
            word: "Yet",
            meaning: "Belum",
            example: "Have you finished yet?",
          },
          {
            word: "Just",
            meaning: "Baru saja",
            example: "She has just left the office.",
          },
          {
            word: "Experience",
            meaning: "Pengalaman",
            example: "I have experience in teaching.",
          },
        ],
        quiz: {
          question: "Mana kalimat Present Perfect yang benar?",
          options: [
            "I have went to London.",
            "I have go to London.",
            "I have gone to London.",
            "I has gone to London.",
          ],
          correctAnswer: 2,
        },
      },
    },
    // Intermediate English Mastery - Lesson 2
    5: {
      title: "Business & Professional Vocabulary",
      duration: "16 menit",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 8,
          text: "Welcome to Business and Professional Vocabulary. Today we'll learn essential business terms.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 8,
          endTime: 16,
          text: "Let's start with common office words: Meeting, Deadline, Project, Presentation, and Report.",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 16,
          endTime: 24,
          text: "In business communication, we often say: Could you please send me the report? or Let's schedule a meeting.",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 24,
          endTime: 32,
          text: "Important business verbs include: negotiate, collaborate, implement, analyze, and coordinate.",
          speaker: "Teacher",
        },
        {
          id: 5,
          startTime: 32,
          endTime: 40,
          text: "Remember to be professional and polite in all business communications. Use phrases like 'I appreciate your help' or 'Thank you for your time'.",
          speaker: "Teacher",
        },
      ],
      content: {
        text: `Vocabulary profesional sangat penting untuk berkomunikasi di lingkungan kerja. Mari pelajari istilah-istilah bisnis yang umum digunakan.

Office & Workplace:
• Meeting - Rapat/Pertemuan
• Deadline - Tenggat waktu
• Project - Proyek
• Presentation - Presentasi
• Report - Laporan
• Schedule - Jadwal
• Colleague - Rekan kerja
• Manager - Manajer
• Department - Departemen
• Client - Klien

Business Actions:
• To schedule - Menjadwalkan
• To attend - Menghadiri
• To submit - Menyerahkan
• To review - Meninjau
• To approve - Menyetujui
• To negotiate - Bernegosiasi
• To collaborate - Berkolaborasi

Email Phrases:
• "I am writing to..." - Saya menulis untuk...
• "Please find attached..." - Terlampir...
• "Thank you for your prompt reply" - Terima kasih atas balasan cepatnya
• "I look forward to hearing from you" - Saya menunggu kabar dari Anda
• "Best regards" - Salam hormat

Meeting Phrases:
• "Let's get started" - Mari kita mulai
• "I'd like to suggest..." - Saya ingin menyarankan...
• "What do you think about...?" - Apa pendapat Anda tentang...?
• "Could you elaborate on that?" - Bisakah Anda menjelaskan lebih detail?

Contoh Situasi:
"Good morning everyone. Let's get started with today's meeting. First, I'd like to review the progress on our current project. The deadline is next Friday, so we need to collaborate effectively to submit the final report on time."`,
        vocabulary: [
          {
            word: "Deadline",
            meaning: "Tenggat waktu",
            example: "The deadline for this project is Monday.",
          },
          {
            word: "Colleague",
            meaning: "Rekan kerja",
            example: "My colleagues are very supportive.",
          },
          {
            word: "Negotiate",
            meaning: "Bernegosiasi",
            example: "We need to negotiate the contract terms.",
          },
          {
            word: "Collaborate",
            meaning: "Berkolaborasi",
            example: "Let's collaborate on this project.",
          },
        ],
        quiz: {
          question: 'Apa arti dari "deadline" dalam konteks bisnis?',
          options: [
            "Waktu istirahat",
            "Tenggat waktu",
            "Waktu mulai",
            "Waktu kerja",
          ],
          correctAnswer: 1,
        },
      },
    },
    // Intermediate English Mastery - Lesson 3
    6: {
      title: "Small Talk & Social Situations",
      duration: "16 menit",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      transcript: [
        {
          id: 1,
          startTime: 0,
          endTime: 8,
          text: "Small talk is an important skill for building relationships. Let's learn how to do it naturally.",
          speaker: "Teacher",
        },
        {
          id: 2,
          startTime: 8,
          endTime: 16,
          text: "Safe topics include weather, weekend plans, hobbies, and recent events. Avoid politics, religion, or personal finances.",
          speaker: "Teacher",
        },
        {
          id: 3,
          startTime: 16,
          endTime: 24,
          text: "To start: Nice weather today, isn't it? Or: Do you have any plans for the weekend?",
          speaker: "Teacher",
        },
        {
          id: 4,
          startTime: 24,
          endTime: 32,
          text: "Keep the conversation going with follow-up questions: That's interesting! Tell me more. Or: Really? How did that happen?",
          speaker: "Teacher",
        },
        {
          id: 5,
          startTime: 32,
          endTime: 40,
          text: "To close politely: It was nice talking to you! or I should get going, but let's catch up soon!",
          speaker: "Teacher",
        },
      ],
      content: {
        text: `Small talk adalah percakapan ringan yang penting untuk membangun hubungan sosial dan profesional. Mari pelajari cara melakukan small talk yang natural.

Common Small Talk Topics:
1. Weather (Cuaca)
"Nice weather today, isn't it?"
"It's quite hot/cold today."

2. Weekend Plans (Rencana Akhir Pekan)
"Do you have any plans for the weekend?"
"What did you do last weekend?"

3. Hobbies & Interests (Hobi & Minat)
"What do you like to do in your free time?"
"Have you seen any good movies lately?"

4. Current Events (Berita Terkini)
"Did you hear about...?"
"Have you been following...?"

Opening Small Talk:
• "How's your day going?"
• "How have you been?"
• "What have you been up to?"
• "Long time no see!"

Keeping the Conversation Going:
• "That's interesting! Tell me more."
• "Really? How did that happen?"
• "I know what you mean."
• "That reminds me of..."

Closing Small Talk:
• "It was nice talking to you."
• "I should get going, but let's catch up soon."
• "Take care!"
• "See you around!"

Contoh Dialog:
A: "Hi Sarah! How's your day going?"
B: "Pretty good, thanks! How about you?"
A: "Not bad. Do you have any plans for the weekend?"
B: "I'm thinking of going hiking. The weather looks great!"
A: "That sounds fun! I love hiking too."

Tips:
• Tunjukkan minat dengan pertanyaan follow-up
• Hindari topik sensitif (politik, agama, gaji)
• Perhatikan body language
• Tersenyum dan maintain eye contact`,
        vocabulary: [
          {
            word: "Lately",
            meaning: "Akhir-akhir ini",
            example: "Have you been busy lately?",
          },
          {
            word: "Catch up",
            meaning: "Mengobrol/berbincang lagi",
            example: "Let's catch up over coffee sometime.",
          },
          {
            word: "Long time no see",
            meaning: "Lama tidak bertemu",
            example: "Hey John! Long time no see!",
          },
          {
            word: "What have you been up to",
            meaning: "Apa yang sudah kamu lakukan",
            example: "What have you been up to these days?",
          },
        ],
        quiz: {
          question: "Frasa mana yang tepat untuk membuka small talk?",
          options: [
            "What is your salary?",
            "How's your day going?",
            "How old are you?",
            "Where do you live exactly?",
          ],
          correctAnswer: 1,
        },
      },
    },
    // Business English Professional - Lesson 1
    101: {
      title: "Professional Email Writing",
      duration: "20 menit",
      content: {
        text: `Email profesional adalah keterampilan penting dalam dunia bisnis modern. Mari pelajari cara menulis email yang efektif dan profesional.

Email Structure (Struktur Email):

1. Subject Line (Subjek)
• Clear and specific - Jelas dan spesifik
• Include key information - Sertakan informasi penting
• Examples: "Meeting Request - Project Update", "Follow-up: Q4 Sales Report"

2. Greeting/Salutation (Salam Pembuka)
• Formal: "Dear Mr./Ms. [Last Name],"
• Semi-formal: "Hello [First Name],"
• Team email: "Dear Team," or "Hi everyone,"

3. Opening (Pembukaan)
• State your purpose immediately
• "I am writing to..."
• "I hope this email finds you well..."
• "Following up on our conversation..."

4. Body (Isi Utama)
• Keep it concise and clear
• Use bullet points for multiple items
• One topic per paragraph
• Be specific and actionable

5. Closing (Penutup)
• Thank you statement
• Call to action
• "Please let me know if you need any further information."
• "I look forward to hearing from you."

6. Sign-off (Salam Penutup)
• Formal: "Sincerely," "Best regards," "Kind regards,"
• Semi-formal: "Thanks," "Best," "Cheers,"

Professional Email Phrases:

Opening:
• "I hope this email finds you well."
• "Thank you for your email regarding..."
• "I am writing to inquire about..."

Requesting:
• "Could you please...?"
• "I would appreciate if you could..."
• "Would it be possible to...?"

Responding:
• "Thank you for bringing this to my attention."
• "I appreciate your prompt response."
• "As discussed in our meeting..."

Apologizing:
• "I apologize for any inconvenience."
• "Sorry for the delayed response."
• "I regret to inform you that..."

Example Professional Email:

Subject: Project Timeline - Q1 2024

Dear Ms. Johnson,

I hope this email finds you well. I am writing to follow up on our discussion about the Q1 2024 project timeline.

As discussed in our meeting, I would like to propose the following schedule:
• Project kickoff: January 15, 2024
• First milestone: February 1, 2024
• Final delivery: March 30, 2024

Could you please review this timeline and let me know if it works for your team?

I look forward to your feedback.

Best regards,
John Smith
Project Manager`,
        vocabulary: [
          {
            word: "Inquire",
            meaning: "Menanyakan",
            example: "I am writing to inquire about the position.",
          },
          {
            word: "Regarding",
            meaning: "Mengenai",
            example: "Regarding your email, I have some questions.",
          },
          {
            word: "Appreciate",
            meaning: "Menghargai",
            example: "I appreciate your quick response.",
          },
          {
            word: "Prompt",
            meaning: "Cepat/Segera",
            example: "Thank you for your prompt reply.",
          },
          {
            word: "Attach",
            meaning: "Melampirkan",
            example: "Please find attached the document.",
          },
        ],
        quiz: {
          question: "What is the most professional way to start a business email?",
          options: [
            "Hey, what's up?",
            "Dear Mr. Smith,",
            "Yo!",
            "Hi there!",
          ],
          correctAnswer: 1,
        },
      },
    },
    // TOEFL Preparation - Lesson 1
    201: {
      title: "TOEFL Reading Strategies",
      duration: "25 menit",
      content: {
        text: `TOEFL Reading section mengukur kemampuan Anda memahami teks akademik dalam bahasa Inggris. Mari pelajari strategi efektif untuk menghadapi section ini.

TOEFL Reading Section Overview:

Format:
• 3-4 passages (700 words each)
• 10 questions per passage
• 54-72 minutes total
• Academic topics from various fields

Question Types:

1. Factual Information Questions
• "According to the paragraph..."
• "The author mentions X in order to..."
• Strategy: Scan for specific information

2. Negative Factual Information
• "All of the following are mentioned EXCEPT..."
• Strategy: Eliminate wrong answers

3. Inference Questions
• "What can be inferred about...?"
• "The author implies that..."
• Strategy: Read between the lines

4. Vocabulary Questions
• "The word X in the passage is closest in meaning to..."
• Strategy: Use context clues

5. Reference Questions
• "The word 'it' in the passage refers to..."
• Strategy: Check preceding sentences

6. Sentence Simplification
• "Which sentence best expresses the essential information?"
• Strategy: Identify main ideas

7. Insert Text Questions
• "Where would the sentence best fit?"
• Strategy: Look for logical transitions

8. Prose Summary
• Choose 3 main ideas from 6 options
• Strategy: Focus on big picture

9. Fill in a Table
• Categorize information
• Strategy: Understand organizational structure

Key Strategies:

1. Time Management:
• Spend 20 minutes per passage
• Don't get stuck on one question
• Flag difficult questions and return later

2. Skimming Technique:
• Read title and introduction
• Read first sentence of each paragraph
• Read conclusion
• Get the main idea before details

3. Scanning for Details:
• Use keywords from questions
• Locate specific information quickly
• Don't read every word

4. Vocabulary Building:
• Learn academic word list
• Study prefixes and suffixes
• Practice context clues

5. Note-Taking:
• Write key points briefly
• Use abbreviations
• Note paragraph main ideas

Practice Tips:

1. Read academic articles daily
• Science journals
• History texts
• Social sciences

2. Build reading speed
• Start with 250 words/minute
• Gradually increase speed

3. Practice with time limits
• Simulate test conditions
• Use official practice tests

4. Analyze mistakes
• Understand why answers are wrong
• Learn from error patterns

Common Mistakes to Avoid:

1. Reading too slowly
• Don't try to understand every word
• Focus on main ideas

2. Choosing answers based on memory
• Always refer back to passage
• Don't rely on prior knowledge

3. Overthinking
• Trust your first impression
• Don't second-guess excessively

4. Ignoring transition words
• "However," "Therefore," "In contrast"
• These signal relationships

Remember: Practice makes perfect! Take multiple practice tests to improve your skills.`,
        vocabulary: [
          {
            word: "Inference",
            meaning: "Kesimpulan",
            example: "Make an inference based on the passage.",
          },
          {
            word: "Imply",
            meaning: "Mengisyaratkan",
            example: "The author implies that climate change is serious.",
          },
          {
            word: "Paraphrase",
            meaning: "Mengungkapkan kembali",
            example: "Paraphrase the main idea in your own words.",
          },
          {
            word: "Skim",
            meaning: "Membaca sekilas",
            example: "Skim the passage to get the main idea.",
          },
          {
            word: "Scan",
            meaning: "Memindai",
            example: "Scan the text for specific information.",
          },
        ],
        quiz: {
          question: "How much time should you spend on each TOEFL reading passage?",
          options: [
            "10 minutes",
            "20 minutes",
            "30 minutes",
            "40 minutes",
          ],
          correctAnswer: 1,
        },
      },
    },
  };

  const lesson = lessonData[lessonId as keyof typeof lessonData];
  
  // Guard clause for lessons without content
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Lesson Belum Tersedia</h2>
          <p className="text-gray-600 mb-6">
            Konten untuk lesson ini sedang dalam pengembangan. Silakan coba lesson lain atau kembali nanti.
          </p>
          <Button onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Course
          </Button>
        </Card>
      </div>
    );
  }
  
  const steps = ["Materi", "Vocabulary", "Quiz"];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">{lesson.duration}</span>
            </div>
          </div>

          <h1 className="text-2xl mb-3">{lesson.title}</h1>

          <div className="flex items-center gap-4 mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 ${
                    index === currentStep
                      ? "text-blue-600"
                      : index < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${
                        index === currentStep
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                  )}
                  <span className="text-sm">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>

          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {currentStep === 0 && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 shadow-2xl animate-[fadeIn_0.5s_ease-in]">
              {/* Header Section with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
                <h2
                  className="text-3xl font-black mb-2 drop-shadow-lg animate-[slideDown_0.5s_ease-out] text-black"
                  style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
                >
                  📚 Materi Pembelajaran
                </h2>
                <p className="text-sm font-medium animate-[slideDown_0.7s_ease-out] text-black">
                  Pelajari dengan seksama untuk memahami konsep dasar
                </p>
              </div>

              {/* Content Section */}
              <div className="p-8">
                  {/* Video Player & Transcript - Only if lesson has video */}
                  {'videoUrl' in lesson && 'transcript' in lesson && lesson.videoUrl && lesson.transcript && lesson.transcript.length > 0 && (
                    <div className="mb-8 space-y-6">
                      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-inner border border-blue-200/50">
                        <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                          🎥 Video Pembelajaran
                        </h3>
                        <div ref={videoPlayerRef}>
                          <VideoPlayer
                            videoUrl={lesson.videoUrl}
                            onTimeUpdate={setCurrentVideoTime}
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                          />
                        </div>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-inner border border-blue-200/50">
                        <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                          📝 Interactive Transcript
                        </h3>
                        <InteractiveTranscript
                          segments={lesson.transcript}
                          currentTime={currentVideoTime}
                          onSegmentClick={(time) => {
                            setCurrentVideoTime(time);
                            if (videoPlayerRef.current) {
                              const video = videoPlayerRef.current.querySelector('video');
                              if (video) {
                                video.currentTime = time;
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="prose max-w-none">
                    <div
                      className="whitespace-pre-line text-gray-800 leading-loose text-lg font-normal animate-[fadeInUp_0.8s_ease-out] bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-inner border border-blue-200/50"
                      style={{
                        fontFamily: '"Georgia", "Times New Roman", serif',
                        lineHeight: "1.8",
                      }}
                    >
                      {lesson.content.text}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 flex justify-end animate-[slideUp_1s_ease-out]">
                    <Button
                      onClick={handleNext}
                      className="gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Lanjut ke Vocabulary
                      <ChevronRight className="h-5 w-5 animate-[bounce_1s_ease-in-out_infinite]" />
                    </Button>
                  </div>
              </div>
            </Card>
          )}

          {currentStep === 1 && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-2xl animate-[fadeIn_0.5s_ease-in]">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6">
                <h2
                  className="text-3xl font-black mb-2 drop-shadow-lg animate-[slideDown_0.5s_ease-out] text-black"
                  style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
                >
                  📖 Vocabulary
                </h2>
                <p className="text-sm font-medium animate-[slideDown_0.7s_ease-out] text-black">
                  Pelajari kosakata penting dan contoh penggunaannya
                </p>
              </div>

              {/* Vocabulary Cards */}
              <div className="p-8 space-y-4">
                {lesson.content.vocabulary.map((item, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 animate-[fadeInUp_0.5s_ease-out]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3
                        className="text-2xl font-bold text-orange-700"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {item.word}
                      </h3>
                      <span className="text-lg font-semibold text-amber-600 bg-amber-100 px-4 py-1 rounded-full border border-amber-300">
                        {item.meaning}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border-l-4 border-orange-500">
                      <p
                        className="text-sm font-medium text-gray-800 italic"
                        style={{ fontFamily: '"Georgia", serif' }}
                      >
                        💬 Example: "{item.example}"
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action Button */}
              <div className="px-8 pb-8 flex justify-end animate-[slideUp_1s_ease-out]">
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Lanjut ke Quiz
                  <ChevronRight className="h-5 w-5 animate-[bounce_1s_ease-in-out_infinite]" />
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 shadow-2xl animate-[fadeIn_0.5s_ease-in]">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6">
                <h2
                  className="text-3xl font-black mb-2 drop-shadow-lg animate-[slideDown_0.5s_ease-out] text-black"
                  style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
                >
                  🎯 Quiz Time!
                </h2>
                <p className="text-sm font-medium animate-[slideDown_0.7s_ease-out] text-black">
                  Uji pemahaman Anda dengan quiz interaktif
                </p>
              </div>

              {/* Quiz Content */}
              <div className="p-8">
                <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-200 shadow-lg animate-[fadeInUp_0.6s_ease-out]">
                  <p
                    className="text-xl font-semibold text-gray-800 leading-relaxed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {lesson.content.quiz.question}
                  </p>
                </div>

                <div className="space-y-4">
                  {lesson.content.quiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-5 text-left rounded-xl border-3 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-md hover:shadow-xl animate-[fadeInUp_0.5s_ease-out] ${
                        !showResult
                          ? "border-2 border-gray-300 bg-white/80 hover:border-green-500 hover:bg-green-50"
                          : index === lesson.content.quiz.correctAnswer
                          ? "border-3 border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 shadow-green-200"
                          : index === selectedAnswer
                          ? "border-3 border-red-500 bg-gradient-to-r from-red-100 to-rose-100 shadow-red-200"
                          : "border-2 border-gray-200 bg-gray-50 opacity-50"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full border-3 flex items-center justify-center font-bold transition-all ${
                            !showResult
                              ? "border-gray-400 bg-white text-gray-600"
                              : index === lesson.content.quiz.correctAnswer
                              ? "border-green-600 bg-green-500 text-white shadow-lg"
                              : index === selectedAnswer
                              ? "border-red-600 bg-red-500 text-white shadow-lg"
                              : "border-gray-300 bg-gray-100 text-gray-400"
                          }`}
                        >
                          {!showResult && String.fromCharCode(65 + index)}
                          {showResult &&
                            index === lesson.content.quiz.correctAnswer && (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            )}
                          {showResult &&
                            index === selectedAnswer &&
                            index !== lesson.content.quiz.correctAnswer && (
                              <span className="text-white font-bold">✕</span>
                            )}
                        </div>
                        <span
                          className="text-lg font-medium text-gray-800"
                          style={{ fontFamily: '"Inter", sans-serif' }}
                        >
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {showResult && (
                <div className="px-8 pb-6">
                  <div
                    className={`p-6 rounded-xl mb-6 shadow-xl border-2 animate-[bounceIn_0.5s_ease-out] ${
                      selectedAnswer === lesson.content.quiz.correctAnswer
                        ? "bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-green-400"
                        : "bg-gradient-to-r from-red-100 via-rose-100 to-pink-100 border-red-400"
                    }`}
                  >
                    <p
                      className={`text-lg font-bold ${
                        selectedAnswer === lesson.content.quiz.correctAnswer
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      {selectedAnswer === lesson.content.quiz.correctAnswer
                        ? "🎉 Sempurna! Jawaban Anda benar!"
                        : "❌ Kurang tepat. Jawaban yang benar adalah: " +
                          lesson.content.quiz.options[
                            lesson.content.quiz.correctAnswer
                          ]}
                    </p>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="px-8 pb-8 flex justify-end animate-[slideUp_1s_ease-out]">
                  <Button
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-6 text-lg"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Selesaikan Lesson
                    <CheckCircle2 className="h-5 w-5 animate-[bounce_1s_ease-in-out_infinite]" />
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
