import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
  runTransaction,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { Habit, HabitCompletion, DailyReflection } from "../types";

export const useHabits = (userId: string | null) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>(
    []
  );
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setHabits([]);
      setHabitCompletions([]);
      setReflections([]);
      setLoading(false);
      return;
    }

    // Subscribe to habits
    const habitsQuery = query(
      collection(db, "habits"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      const habitsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];
      setHabits(habitsData);
    });

    // Subscribe to habit completions
    const completionsQuery = query(
      collection(db, "habitCompletions"),
      where("userId", "==", userId)
    );

    const unsubscribeCompletions = onSnapshot(completionsQuery, (snapshot) => {
      const completionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HabitCompletion[];
      setHabitCompletions(completionsData);
    });

    // Subscribe to reflections
    const reflectionsQuery = query(
      collection(db, "reflections"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribeReflections = onSnapshot(reflectionsQuery, (snapshot) => {
      const reflectionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DailyReflection[];
      setReflections(reflectionsData);
      setLoading(false);
    });

    return () => {
      unsubscribeHabits();
      unsubscribeCompletions();
      unsubscribeReflections();
    };
  }, [userId]);

  const addHabit = async (
    habit: Omit<
      Habit,
      "id" | "userId" | "createdAt" | "currentStreak" | "lastCompletedDate"
    >
  ) => {
    if (!userId) return;

    await addDoc(collection(db, "habits"), {
      ...habit,
      userId,
      createdAt: Timestamp.fromDate(new Date()),
      currentStreak: 0,
      lastCompletedDate: "",
    });
  };

  const toggleHabitCompletion = async (habitId: string, date: string) => {
    if (!userId) return;

    const habitRef = doc(db, "habits", habitId);
    const completionCol = collection(db, "habitCompletions");
    const completionQuery = query(
      completionCol,
      where("habitId", "==", habitId),
      where("date", "==", date)
    );

    try {
      await runTransaction(db, async (transaction) => {
        const habitDoc = await transaction.get(habitRef);
        if (!habitDoc.exists()) {
          throw "Habit document does not exist!";
        }

        const habitData = habitDoc.data() as Habit;
        const completionSnapshot = await getDocs(completionQuery);

        if (completionSnapshot.empty) {
          // Add completion
          const completionRef = doc(completionCol);
          transaction.set(completionRef, {
            habitId,
            userId,
            date,
            completedAt: Timestamp.fromDate(new Date()),
          });

          // Update streak
          const today = new Date(date);
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          if (
            habitData.lastCompletedDate ===
            yesterday.toISOString().split("T")[0]
          ) {
            // Increment streak
            transaction.update(habitRef, {
              currentStreak: habitData.currentStreak + 1,
              lastCompletedDate: date,
            });
          } else {
            // Reset streak
            transaction.update(habitRef, {
              currentStreak: 1,
              lastCompletedDate: date,
            });
          }
        } else {
          // Remove completion
          const completionDoc = completionSnapshot.docs[0];
          transaction.delete(completionDoc.ref);

          // Note: More complex logic would be needed to correctly revert streaks.
          // For now, we'll just decrement if it was the last completed date.
          if (habitData.lastCompletedDate === date) {
            transaction.update(habitRef, {
              currentStreak: Math.max(0, habitData.currentStreak - 1),
              // This should ideally revert to the previous completion date.
              // This simplification can lead to incorrect streaks on un-completion.
              lastCompletedDate: "",
            });
          }
        }
      });
    } catch (e) {
      console.error("Transaction failed: ", e);
    }
  };

  const addReflection = async (
    reflection: Omit<DailyReflection, "id" | "userId" | "createdAt">
  ) => {
    if (!userId) return;

    await addDoc(collection(db, "reflections"), {
      ...reflection,
      userId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  return {
    habits,
    habitCompletions,
    reflections,
    loading,
    addHabit,
    toggleHabitCompletion,
    addReflection,
  };
};
