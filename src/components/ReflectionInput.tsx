import React, { useState } from 'react';
import { Send, MessageCircle, Mic } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import VoiceNote from './VoiceNote';

interface ReflectionInputProps {
  onSubmit: (reflection: { text?: string; voiceNote?: { url: string; duration: number } }) => void;
  disabled?: boolean;
  placeholder?: string;
  existingReflection?: {
    text?: string;
    voiceNote?: { url: string; duration: number; transcript?: string };
    aiResponse?: string;
  };
}

const ReflectionInput: React.FC<ReflectionInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = "How did today go? Reflect on your progress...",
  existingReflection,
}) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [processingVoice, setProcessingVoice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    
    onSubmit({ text: text.trim() });
    setText('');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    setIsRecording(false);
    setProcessingVoice(true);

    // Create audio URL
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Submit voice note
    onSubmit({ 
      voiceNote: { 
        url: audioUrl, 
        duration 
      } 
    });

    // Simulate AI processing
    setTimeout(() => {
      setProcessingVoice(false);
    }, 3000);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
  };

  if (existingReflection) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <MessageCircle size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">Daily Reflection</span>
        </div>
        
        {existingReflection.text && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-2xl border border-green-200">
            <p className="text-gray-700">{existingReflection.text}</p>
          </div>
        )}
        
        {existingReflection.voiceNote && (
          <VoiceNote
            audioUrl={existingReflection.voiceNote.url}
            duration={existingReflection.voiceNote.duration}
            transcript={existingReflection.voiceNote.transcript}
            aiResponse={existingReflection.aiResponse}
            isProcessing={processingVoice}
          />
        )}
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <MessageCircle size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">Daily Reflection</span>
        </div>
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          onCancel={handleCancelRecording}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <MessageCircle size={16} className="text-gray-500" />
        <span className="text-sm text-gray-600 font-medium">Daily Reflection</span>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-3">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
            className={`w-full p-3 bg-white border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
        
        {text.trim() ? (
          <button
            type="submit"
            disabled={disabled}
            className={`p-3 rounded-xl transition-all ${
              disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105'
            }`}
          >
            <Send size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartRecording}
            disabled={disabled}
            className={`p-3 rounded-xl transition-all ${
              disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105'
            }`}
          >
            <Mic size={18} />
          </button>
        )}
      </form>
      </div>
    </div>
  );
};

export default ReflectionInput;