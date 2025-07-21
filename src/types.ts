export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: string; // e.g., "07:00" or "30 MIN"
  frequency: "daily" | "weekdays" | "custom";
  customDays?: number[]; // 0-6 (Sunday-Saturday) for custom frequency
  color: string;
  icon: string;
  createdAt: any; // Can be a server timestamp
  currentStreak: number;
  lastCompletedDate: string;
  deleted: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  completedAt: string; // ISO timestamp
}

export interface DailyReflection {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  text: string;
  voiceNote?: {
    url: string;
    duration: number;
    transcript?: string;
  };
  aiResponse?: string;
  createdAt: string; // ISO timestamp
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPaid: boolean;
  provider: "google" | "microsoft";
}
