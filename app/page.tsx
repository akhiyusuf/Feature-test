import AudioRecorder from '@/components/audio-recorder';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Recite After Me</h1>
      <p className="text-xl mb-8 text-center max-w-lg">
        Improve your Quran recitation with real-time, AI-powered feedback.
      </p>
      
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <AudioRecorder />
      </div>
    </main>
  );
}
