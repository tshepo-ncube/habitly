import React, { useState } from "react";
import { Plus, LogOut, Crown, LifeBuoy, Target } from "lucide-react";
import { Link } from "react-router-dom";
import DayNavigation from "./DayNavigation";
import HabitCard from "./HabitCard";
import AddHabitModal from "./AddHabitModal";
import ReflectionInput from "./ReflectionInput";
import { User } from "../types";
import { useHabits } from "../hooks/useHabits";

interface HabitTrackerProps {
  user: User;
  onLogout: () => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ user, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [processingReflection, setProcessingReflection] = useState(false);

  const {
    habits,
    habitCompletions,
    reflections,
    loading,
    addHabit,
    updateHabit,
    softDeleteHabit,
    toggleHabitCompletion,
    addReflection,
  } = useHabits(user.id);

  const isHabitCompleted = (habitId: string): boolean => {
    return habitCompletions.some(
      (c) => c.habitId === habitId && c.date === selectedDate
    );
  };

  const shouldShowHabit = (habit: any): boolean => {
    const currentDay = new Date(selectedDate).getDay();

    switch (habit.frequency) {
      case "daily":
        return true;
      case "weekdays":
        return currentDay >= 1 && currentDay <= 5; // Monday to Friday
      case "custom":
        return habit.customDays?.includes(currentDay) || false;
      default:
        return true;
    }
  };

  const handleEditHabit = (habit: any) => {
    setEditingHabit(habit);
    setShowAddModal(true);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      softDeleteHabit(habitId);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingHabit(null);
  };

  const handleReflectionSubmit = async (reflection: {
    text?: string;
    voiceNote?: { url: string; duration: number };
  }) => {
    setProcessingReflection(true);

    const reflectionData = {
      date: selectedDate,
      text: reflection.text || "",
      voiceNote: reflection.voiceNote || undefined,
      aiResponse: "",
    };

    await addReflection(reflectionData);

    // Simulate AI response for voice notes
    if (reflection.voiceNote) {
      setTimeout(async () => {
        const aiResponse =
          "Great reflection! I can hear the determination in your voice. Keep focusing on building these positive habits - consistency is key to long-term success. 🌟";

        await addReflection({
          date: selectedDate,
          text: reflection.text || "",
          voiceNote: reflection.voiceNote || undefined,
          aiResponse,
        });

        setProcessingReflection(false);
      }, 3000);
    } else {
      setProcessingReflection(false);
    }
  };

  const todayReflection = reflections.find((r) => r.date === selectedDate);
  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const visibleHabits = habits.filter(shouldShowHabit);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto bg-white min-h-screen shadow-lg lg:rounded-2xl lg:my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 lg:rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Habitly</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-white/30"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{user.email}</span>
                    {user.isPaid && (
                      <div className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Crown size={10} />
                        <span>PRO</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Link
                to="/support"
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <LifeBuoy size={18} />
              </Link>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <DayNavigation
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Main Content */}
        <div className="p-4 pb-20 lg:pb-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Habits */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Today's Habits
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {visibleHabits.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <Plus size={48} className="mx-auto mb-4 opacity-50" />
                    </div>
                    <p className="text-gray-500 text-lg">No habits yet</p>
                    <p className="text-gray-400 text-sm">
                      Tap the + button to add your first habit
                    </p>
                  </div>
                ) : (
                  visibleHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompleted={isHabitCompleted(habit.id)}
                      onToggle={() =>
                        toggleHabitCompletion(habit.id, selectedDate)
                      }
                      onEdit={() => handleEditHabit(habit)}
                      onDelete={() => handleDeleteHabit(habit.id)}
                      disabled={!isToday}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Reflection */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Daily Reflection
              </h2>
              <ReflectionInput
                onSubmit={handleReflectionSubmit}
                disabled={!isToday}
                placeholder={
                  isToday
                    ? "How did today go? Reflect on your progress..."
                    : "Reflection not available for past days"
                }
                existingReflection={
                  todayReflection
                    ? {
                        text: todayReflection.text,
                        voiceNote: todayReflection.voiceNote,
                        aiResponse: todayReflection.aiResponse,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        {/* Add/Edit Habit Modal */}
        {showAddModal && (
          <AddHabitModal
            onClose={handleCloseModal}
            onAdd={addHabit}
            onUpdate={updateHabit}
            editingHabit={editingHabit}
          />
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
