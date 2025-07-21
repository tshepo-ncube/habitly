import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DayNavigationProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DayNavigation: React.FC<DayNavigationProps> = ({ selectedDate, onDateChange }) => {
  const currentDate = new Date(selectedDate);
  const today = new Date();
  const isToday = selectedDate === today.toISOString().split('T')[0];
  const canGoForward = currentDate < today;

  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    if (canGoForward) {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      onDateChange(nextDay.toISOString().split('T')[0]);
    }
  };

  const formatDate = (date: Date) => {
    if (isToday) return 'Today';
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={goToPreviousDay}
        className="p-2 rounded-full hover:bg-white/20 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="text-center">
        <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
        <p className="text-sm opacity-80">
          {currentDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
      
      <button
        onClick={goToNextDay}
        disabled={!canGoForward}
        className={`p-2 rounded-full transition-colors ${
          canGoForward 
            ? 'hover:bg-white/20' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default DayNavigation;