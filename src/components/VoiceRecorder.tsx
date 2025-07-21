import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(40).fill(0));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startRecording();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        onRecordingComplete(audioBlob, duration);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      // Start visualization and timer
      updateVisualization();
      updateTimer();
    } catch (error) {
      console.error('Error starting recording:', error);
      onCancel();
    }
  };

  const updateVisualization = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Create wave-like visualization
    const newLevels = new Array(40).fill(0).map((_, i) => {
      const index = Math.floor((i / 40) * bufferLength);
      return Math.min(dataArray[index] / 255, 1);
    });

    setAudioLevels(newLevels);
    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  };

  const updateTimer = () => {
    if (isRecording) {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      setTimeout(updateTimer, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <div className="flex items-center space-x-4">
        <button
          onClick={stopRecording}
          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
        >
          <Square size={20} />
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-1 h-8">
            {audioLevels.map((level, index) => (
              <div
                key={index}
                className="bg-red-500 rounded-full transition-all duration-100"
                style={{
                  width: '3px',
                  height: `${Math.max(4, level * 32)}px`,
                  opacity: level > 0.1 ? 1 : 0.3
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 font-mono">
          {formatDuration(duration)}
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">Recording... Tap stop when done</p>
      </div>
    </div>
  );
};

export default VoiceRecorder;