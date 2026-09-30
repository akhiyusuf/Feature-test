'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  PRELOADED_SURAHS,
  ALL_SURAHS,
  getSurahData,
  QuranVerse,
  SurahMeta,
} from '@/lib/quran-data';
import { AlignmentResult, WordAlignment } from '@/lib/arabic-aligner';
import {
  Mic,
  Square,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  ArrowRight,
  Repeat,
  Flame,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReciteAfterMe() {
  // Surah and Verse State
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [surahMeta, setSurahMeta] = useState<SurahMeta>(PRELOADED_SURAHS[1].meta);
  const [verses, setVerses] = useState<QuranVerse[]>(PRELOADED_SURAHS[1].verses);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [chunkMode, setChunkMode] = useState<'verse' | 'word'>('verse');
  const [currentWordChunkIndex, setCurrentWordChunkIndex] = useState<number>(0);

  // Audio Playback State (The Model / Qari Recitation)
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);
  const qariAudioRef = useRef<HTMLAudioElement | null>(null);

  // User Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Alignment and Feedback State
  const [lastTranscribedText, setLastTranscribedText] = useState<string | null>(null);
  const [alignment, setAlignment] = useState<AlignmentResult | null>(null);
  const [consecutiveMistakes, setConsecutiveMistakes] = useState<number>(0);
  const [masteredVerses, setMasteredVerses] = useState<Set<number>>(new Set());
  const [streak, setStreak] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const currentVerse = verses[currentVerseIndex] || verses[0];

  // Break current verse into words
  const verseWords = currentVerse?.uthmaniText ? currentVerse.uthmaniText.split(/\s+/).filter(Boolean) : [];
  const currentTargetText =
    chunkMode === 'word'
      ? verseWords[currentWordChunkIndex] || currentVerse?.uthmaniText
      : currentVerse?.uthmaniText;

  // Load Surah
  const loadSurah = useCallback(async (surahNum: number) => {
    setErrorStatus(null);
    setAlignment(null);
    setLastTranscribedText(null);
    setCurrentVerseIndex(0);
    setCurrentWordChunkIndex(0);
    setConsecutiveMistakes(0);

    if (PRELOADED_SURAHS[surahNum]) {
      setSurahMeta(PRELOADED_SURAHS[surahNum].meta);
      setVerses(PRELOADED_SURAHS[surahNum].verses);
    } else {
      setIsAnalyzing(true);
      const data = await getSurahData(surahNum);
      setSurahMeta(data.meta);
      setVerses(data.verses);
      setIsAnalyzing(false);
    }
  }, []);

  const handleSurahChange = (num: number) => {
    setSelectedSurahNumber(num);
    loadSurah(num);
  };

  // Play Sheikh Mishary Audio for the current verse
  const playQariAudio = () => {
    if (!currentVerse?.audioUrl) return;

    if (qariAudioRef.current) {
      qariAudioRef.current.pause();
    }

    const audio = new Audio(currentVerse.audioUrl);
    qariAudioRef.current = audio;
    setIsPlayingModelAudio(true);

    audio.onended = () => {
      setIsPlayingModelAudio(false);
    };
    audio.onerror = () => {
      setIsPlayingModelAudio(false);
      setErrorStatus('Could not load Qari audio. You can still recite directly!');
    };

    audio.play().catch(() => {
      setIsPlayingModelAudio(false);
    });
  };

  const stopQariAudio = () => {
    if (qariAudioRef.current) {
      qariAudioRef.current.pause();
      qariAudioRef.current.currentTime = 0;
      setIsPlayingModelAudio(false);
    }
  };

  // Clean up audio on unmount or verse change
  useEffect(() => {
    return () => {
      if (qariAudioRef.current) {
        qariAudioRef.current.pause();
      }
    };
  }, [currentVerseIndex]);

  // Play subtle feedback chime using Web Audio API
  const playChime = (success: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        osc.frequency.setValueAtTime(293.66, ctx.currentTime + 0.15); // D4
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // AudioContext not allowed or not supported, ignore silently
    }
  };

  // Start Recording User Recitation
  const startRecording = async () => {
    stopQariAudio();
    setErrorStatus(null);
    setAlignment(null);
    setLastTranscribedText(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000, // Optimal for Whisper speech recognition
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : undefined,
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioForAnalysis(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Mic access error:', err);
      setErrorStatus(`Microphone error: ${err.message || 'Permission denied'}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  // Send audio to API and process result
  const sendAudioForAnalysis = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    setErrorStatus(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recitation.webm');
      formData.append('expected_text', currentTargetText);

      const response = await fetch('/api/recite', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setLastTranscribedText(data.text || '');

      if (data.alignment) {
        const alignResult: AlignmentResult = data.alignment;
        setAlignment(alignResult);

        if (alignResult.isMatch) {
          // Success!
          playChime(true);
          setStreak((prev) => prev + 1);
          setConsecutiveMistakes(0);

          if (chunkMode === 'word') {
            if (currentWordChunkIndex < verseWords.length - 1) {
              if (autoAdvance) {
                setTimeout(() => {
                  setCurrentWordChunkIndex((prev) => prev + 1);
                  setAlignment(null);
                  setLastTranscribedText(null);
                }, 1000);
              }
            } else {
              // Mastered all words in verse!
              setMasteredVerses((prev) => new Set(prev).add(currentVerseIndex));
            }
          } else {
            setMasteredVerses((prev) => new Set(prev).add(currentVerseIndex));

            if (autoAdvance && currentVerseIndex < verses.length - 1) {
              setTimeout(() => {
                goToNextVerse();
              }, 1200);
            }
          }
        } else {
          // Mistake detected!
          playChime(false);
          setStreak(0);
          setConsecutiveMistakes((prev) => prev + 1);
        }
      }
    } catch (err: any) {
      console.error('Recitation processing error:', err);
      setErrorStatus(err.message || 'Could not process recitation');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const goToNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex((prev) => prev + 1);
      setCurrentWordChunkIndex(0);
      setAlignment(null);
      setLastTranscribedText(null);
      setConsecutiveMistakes(0);
      stopQariAudio();
    }
  };

  const goToPrevVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex((prev) => prev - 1);
      setCurrentWordChunkIndex(0);
      setAlignment(null);
      setLastTranscribedText(null);
      setConsecutiveMistakes(0);
      stopQariAudio();
    }
  };

  const retryCurrent = () => {
    setAlignment(null);
    setLastTranscribedText(null);
    stopQariAudio();
  };

  // Step back: If user struggles on full verse, switch to word-by-word chunking
  const stepBackToWords = () => {
    setChunkMode('word');
    setCurrentWordChunkIndex(alignment?.firstMistakeIndex ?? 0);
    setAlignment(null);
    setLastTranscribedText(null);
  };

  const progressPercent = verses.length > 0
    ? Math.round((masteredVerses.size / verses.length) * 100)
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Bar: Surah Selector & Stats */}
      <div className="bg-slate-900/90 text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-800 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block">Select Surah to Memorize</label>
            <select
              value={selectedSurahNumber}
              onChange={(e) => handleSurahChange(Number(e.target.value))}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {ALL_SURAHS.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName} ({s.name}) - {s.numberOfAyahs} ayahs
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress & Streak Indicators */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
            <div>
              <span className="text-xs text-slate-400 block">Streak</span>
              <span className="font-bold text-sm text-white">{streak} in a row</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-400 block">Mastered</span>
              <span className="font-bold text-sm text-emerald-400">
                {masteredVerses.size}/{verses.length} ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Practice Stage Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Stage Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
              Ayah {currentVerse?.ayahNumber} of {verses.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {surahMeta.englishName} • {surahMeta.revelationType}
            </span>
            {masteredVerses.has(currentVerseIndex) && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
              </span>
            )}
          </div>

          {/* Mode switch: Full Verse vs Chunk by Chunk */}
          <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl">
            <button
              onClick={() => {
                setChunkMode('verse');
                setAlignment(null);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                chunkMode === 'verse'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Verse
            </button>
            <button
              onClick={() => {
                setChunkMode('word');
                setCurrentWordChunkIndex(0);
                setAlignment(null);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                chunkMode === 'word'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Word by Word
            </button>
          </div>
        </div>

        {/* Quran Verse Display Area */}
        <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-slate-50/50 min-h-[220px]">
          {/* Uthmani Arabic Text with Word-Level Highlighting */}
          <div
            dir="rtl"
            className="text-3xl sm:text-4xl md:text-5xl font-serif leading-[2.2] tracking-wide text-slate-800 max-w-3xl flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
          >
            {verseWords.map((word, wIdx) => {
              // Determine status of this word from alignment
              let wordClass = 'text-slate-800 transition-colors duration-300';
              let badge = null;

              if (alignment && alignment.words) {
                const alignWord = alignment.words[wIdx];
                if (alignWord?.status === 'correct') {
                  wordClass = 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-300 font-bold';
                } else if (alignWord?.status === 'incorrect') {
                  wordClass = 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-300 font-bold animate-pulse';
                  badge = 'mistake';
                } else if (alignWord?.status === 'missing') {
                  wordClass = 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-dashed border-amber-300';
                  badge = 'missing';
                }
              } else if (chunkMode === 'word' && wIdx === currentWordChunkIndex) {
                wordClass = 'text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-lg ring-2 ring-emerald-500 font-bold';
              }

              return (
                <span key={wIdx} className={`relative inline-block cursor-pointer ${wordClass}`}>
                  {word}
                  {badge === 'mistake' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-sans not-italic font-bold">
                      retry
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          {/* Transliteration & Translation */}
          <div className="mt-6 max-w-xl">
            {currentVerse?.transliteration && (
              <p className="text-sm font-medium text-slate-500 italic mb-1">
                {currentVerse.transliteration}
              </p>
            )}
            {currentVerse?.translation && (
              <p className="text-sm text-slate-600">
                "{currentVerse.translation}"
              </p>
            )}
          </div>

          {/* Word-by-word chunk indicator if in word mode */}
          {chunkMode === 'word' && (
            <div className="mt-4 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <span>Reciting word {currentWordChunkIndex + 1} of {verseWords.length}</span>
              <span className="font-serif text-sm font-bold text-emerald-900">({verseWords[currentWordChunkIndex]})</span>
            </div>
          )}
        </div>

        {/* Recitation Evaluation & Feedback Panel */}
        {alignment && (
          <div
            className={`px-6 py-5 border-t transition-all ${
              alignment.isMatch
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {alignment.isMatch ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-base">
                    {alignment.isMatch
                      ? 'Masha’Allah! Flawless Recitation!'
                      : 'Mistake Detected — Let’s Practice This Chunk!'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {alignment.isMatch
                      ? `Accuracy score: ${alignment.score}%. Moving forward to reinforce your memorization!`
                      : `Accuracy score: ${alignment.score}%. Notice the highlighted word above.`}
                  </p>
                  {lastTranscribedText && (
                    <div className="mt-2 text-xs bg-white/80 p-2 rounded-lg border border-slate-200" dir="rtl">
                      <span className="font-semibold text-slate-500 font-sans block not-italic text-[11px] mb-0.5">
                        What was heard:
                      </span>
                      <span className="text-slate-800 font-serif text-base">{lastTranscribedText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons on mistake */}
              {!alignment.isMatch && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                  <Button
                    onClick={retryCurrent}
                    variant="outline"
                    size="sm"
                    className="border-rose-300 text-rose-800 hover:bg-rose-100"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Try Again
                  </Button>

                  {chunkMode === 'verse' && (
                    <Button
                      onClick={stepBackToWords}
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      <Repeat className="w-3.5 h-3.5 mr-1" /> Practice Word-by-Word
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorStatus && (
          <div className="px-6 py-3 bg-amber-50 border-t border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              {errorStatus}
            </span>
            <Button
              onClick={() => setErrorStatus(null)}
              variant="ghost"
              size="sm"
              className="text-xs h-6 text-amber-800"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Interactive Controls Toolbar */}
        <div className="p-6 bg-slate-900 text-white border-t border-slate-800 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Step 1: Listen to Sheikh Mishary */}
            <div className="flex items-center gap-2">
              <Button
                onClick={isPlayingModelAudio ? stopQariAudio : playQariAudio}
                variant="outline"
                className={`border-slate-700 text-white hover:bg-slate-800 ${
                  isPlayingModelAudio ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' : ''
                }`}
              >
                {isPlayingModelAudio ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2 text-rose-400" /> Stop Listening
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2 text-emerald-400" /> Listen to Sheikh
                  </>
                )}
              </Button>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Step 1: Hear the model recitation
              </span>
            </div>

            {/* Step 2: Recite After Me Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
                className={`relative group px-6 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all transform active:scale-95 shadow-lg ${
                  isRecording
                    ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse'
                    : isAnalyzing
                    ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/25'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-5 h-5 fill-current" />
                    <span>Done Reciting</span>
                  </>
                ) : isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                    <span>AI Checking...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-slate-950" />
                    <span>Recite After Me</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation between Ayahs */}
            <div className="flex items-center gap-2">
              <Button
                onClick={goToPrevVerse}
                disabled={currentVerseIndex === 0}
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs font-medium text-slate-400 px-1">
                {currentVerseIndex + 1}/{verses.length}
              </span>
              <Button
                onClick={goToNextVerse}
                disabled={currentVerseIndex === verses.length - 1}
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick instructions strip */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <strong>Tip:</strong> Click <em>Listen to Sheikh</em> to memorize the tajweed, then click <em>Recite After Me</em> to verify your recitation!
            </span>
            <label className="flex items-center gap-2 cursor-pointer mt-1 sm:mt-0">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Auto-advance on success</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
