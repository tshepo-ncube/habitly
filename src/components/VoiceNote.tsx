import React, { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface VoiceNoteProps {
  audioUrl: string;
  duration: number;
  transcript?: string;
  aiResponse?: string;
  isProcessing?: boolean;
}

const VoiceNote: React.FC<VoiceNoteProps> = ({
  audioUrl,
  duration,
  transcript,
  aiResponse,
  isProcessing,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Voice Note Player */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayback}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex-1 bg-white/50 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-blue-400 rounded-full"
                  style={{
                    width: "2px",
                    height: `${Math.random() * 16 + 4}px`,
                    opacity: i < progress / 5 ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>

      {/* AI Response */}
      {isProcessing && (
        <div className="bg-gray-100 p-4 rounded-2xl">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span className="text-sm text-gray-600">
              AI is analyzing your reflection...
            </span>
          </div>
        </div>
      )}

      {aiResponse && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-2xl border border-green-200">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {aiResponse}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceNote;
