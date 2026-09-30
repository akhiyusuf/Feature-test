'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setFeedback(null);
    setStatus('Recording...');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone API not supported by this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setStatus('Analyzing...');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recitation.webm');

        try {
          const response = await fetch('/api/recite', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            setFeedback(result.message || 'Analysis complete.');
          } else {
            setFeedback('Error analyzing recitation.');
          }
        } catch (error) {
          setFeedback('Internal error.');
        } finally {
          setStatus(null);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Full microphone error:', error);
      // Display the specific error message from the browser
      const errorMessage = error instanceof Error ? error.message : String(error);
      setFeedback(`Error (${errorMessage}). Please ensure this site has microphone permissions enabled in your browser settings.`);
      setStatus(null);
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? <Square className="mr-2" /> : <Mic className="mr-2" />}
        {isRecording ? 'Stop Recording' : 'Start Reciting'}
      </Button>
      {status && (
        <div className="flex items-center text-blue-500">
          <Loader2 className="mr-2 animate-spin" />
          {status}
        </div>
      )}
      {feedback && <div className="p-4 bg-gray-100 rounded text-center">{feedback}</div>}
    </div>
  );
}
