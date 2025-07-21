import React from "react";
import {
  Check,
  Coffee,
  Book,
  Dumbbell,
  Heart,
  Zap,
  Target,
  Pencil,
  Trash2,
} from "lucide-react";
import { Habit } from "../types";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

const iconMap = {
  coffee: Coffee,
  book: Book,
  dumbbell: Dumbbell,
  heart: Heart,
  zap: Zap,
  target: Target,
};

const colorGradients = {
  yellow: "from-yellow-400 to-orange-400",
  red: "from-red-400 to-pink-400",
  purple: "from-purple-400 to-indigo-400",
  green: "from-green-400 to-emerald-400",
  pink: "from-pink-400 to-rose-400",
  blue: "from-blue-400 to-cyan-400",
};

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
  disabled = false,
}) => {
  const IconComponent = iconMap[habit.icon as keyof typeof iconMap] || Target;
  const gradientClass =
    colorGradients[habit.color as keyof typeof colorGradients] ||
    colorGradients.blue;
  const streak = habit.currentStreak;

  return (
    <div
      className={`group relative bg-gradient-to-r ${gradientClass} p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${isCompleted ? "ring-2 ring-white ring-offset-2" : ""}`}
      onClick={(e) => {
        if (disabled) return;
        // Ensure clicking on buttons doesn't also toggle completion
        const target = e.target as HTMLElement;
        if (target.closest(".habit-actions")) return;
        onToggle();
      }}
    >
      <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 habit-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 bg-white/20 rounded-full hover:bg-white/40"
        >
          <Pencil size={14} className="text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 bg-white/20 rounded-full hover:bg-white/40"
        >
          <Trash2 size={14} className="text-white" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="bg-white/20 p-2 rounded-xl">
            <IconComponent size={20} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg truncate">
              {habit.title}
            </h3>
            <p className="text-white/80 text-sm truncate">
              {habit.description}
            </p>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-white/70 text-xs font-medium">
                {habit.time}
              </span>
              {streak > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white font-medium">
                  🔥 {streak} day{streak !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={`ml-3 ${isCompleted ? "animate-pulse" : ""}`}>
          <div
            className={`w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center transition-all duration-200 ${
              isCompleted ? "bg-white/30 border-white" : "hover:bg-white/20"
            }`}
          >
            {isCompleted && <Check size={16} className="text-white" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
