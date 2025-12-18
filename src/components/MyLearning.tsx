interface MyLearningProps {
  onNavigate: (page: string, courseId?: number) => void;
}

export function MyLearning({ onNavigate }: MyLearningProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">Video Learning (kosong)</h1>
        <p className="text-sm text-gray-500">
          Halaman Video Learning telah dikosongkan. Anda dapat mulai mendesain
          ulang konten di sini.
        </p>
        <div className="mt-6">
          <button
            className="px-4 py-2 rounded bg-primary text-white"
            onClick={() => onNavigate("home")}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
