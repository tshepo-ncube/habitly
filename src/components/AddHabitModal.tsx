import React, { useState, useEffect } from "react";
import { X, Coffee, Book, Dumbbell, Heart, Zap, Target } from "lucide-react";
import { Habit } from "../types";

interface AddHabitModalProps {
  onClose: () => void;
  onAdd?: (
    habit: Omit<
      Habit,
      | "id"
      | "userId"
      | "createdAt"
      | "currentStreak"
      | "lastCompletedDate"
      | "deleted"
    >
  ) => void;
  onUpdate?: (habitId: string, habitData: Partial<Habit>) => void;
  editingHabit?: Habit | null;
}

const icons = [
  { id: "coffee", icon: Coffee, label: "Coffee" },
  { id: "book", icon: Book, label: "Reading" },
  { id: "dumbbell", icon: Dumbbell, label: "Exercise" },
  { id: "heart", icon: Heart, label: "Health" },
  { id: "zap", icon: Zap, label: "Energy" },
  { id: "target", icon: Target, label: "Goal" },
];

const colors = [
  { id: "yellow", class: "from-yellow-400 to-orange-400", label: "Yellow" },
  { id: "red", class: "from-red-400 to-pink-400", label: "Red" },
  { id: "purple", class: "from-purple-400 to-indigo-400", label: "Purple" },
  { id: "green", class: "from-green-400 to-emerald-400", label: "Green" },
  { id: "pink", class: "from-pink-400 to-rose-400", label: "Pink" },
  { id: "blue", class: "from-blue-400 to-cyan-400", label: "Blue" },
];

const AddHabitModal: React.FC<AddHabitModalProps> = ({
  onClose,
  onAdd,
  onUpdate,
  editingHabit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "custom">(
    "daily"
  );
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedIcon, setSelectedIcon] = useState("target");

  const isEditing = !!editingHabit;

  useEffect(() => {
    if (isEditing) {
      setTitle(editingHabit.title);
      setDescription(editingHabit.description);
      setTime(editingHabit.time);
      setFrequency(editingHabit.frequency);
      setCustomDays(editingHabit.customDays || []);
      setSelectedColor(editingHabit.color);
      setSelectedIcon(editingHabit.icon);
    }
  }, [editingHabit, isEditing]);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !time.trim()) return;
    if (frequency === "custom" && customDays.length === 0) return;

    const habitData = {
      title: title.trim(),
      description: description.trim(),
      time: time.trim(),
      frequency,
      customDays: frequency === "custom" ? customDays : [],
      color: selectedColor,
      icon: selectedIcon,
    };

    if (isEditing && onUpdate && editingHabit) {
      onUpdate(editingHabit.id, habitData);
    } else if (onAdd) {
      onAdd(habitData);
    }

    onClose();
  };

  const toggleCustomDay = (dayIndex: number) => {
    setCustomDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort()
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex w-full items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? "Edit Habit" : "Add New Habit"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Morning Exercise"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 30 minutes of cardio"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration/Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 30 MIN or 07:00 AM"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="daily"
                    checked={frequency === "daily"}
                    onChange={(e) => setFrequency(e.target.value as "daily")}
                    className="mr-2"
                  />
                  <span>Every day</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="weekdays"
                    checked={frequency === "weekdays"}
                    onChange={(e) => setFrequency(e.target.value as "weekdays")}
                    className="mr-2"
                  />
                  <span>Weekdays only (Mon-Fri)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    value="custom"
                    checked={frequency === "custom"}
                    onChange={(e) => setFrequency(e.target.value as "custom")}
                    className="mr-2"
                  />
                  <span>Custom days</span>
                </label>
              </div>

              {frequency === "custom" && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {dayNames.map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleCustomDay(index)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          customDays.includes(index)
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Icon
              </label>
              <div className="grid grid-cols-3 gap-3">
                {icons.map((iconOption) => {
                  const IconComponent = iconOption.icon;
                  return (
                    <button
                      key={iconOption.id}
                      type="button"
                      onClick={() => setSelectedIcon(iconOption.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedIcon === iconOption.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <IconComponent
                        size={20}
                        className={`mx-auto ${
                          selectedIcon === iconOption.id
                            ? "text-purple-600"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Color
              </label>
              <div className="grid grid-cols-3 gap-3">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption.id}
                    type="button"
                    onClick={() => setSelectedColor(colorOption.id)}
                    className={`h-12 rounded-xl bg-gradient-to-r ${
                      colorOption.class
                    } border-2 transition-all ${
                      selectedColor === colorOption.id
                        ? "border-gray-400 scale-105"
                        : "border-transparent hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                {isEditing ? "Save Changes" : "Add Habit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;
