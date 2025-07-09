import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { format, startOfDay, isSameDay, subDays } from 'date-fns';

const HabitContext = createContext();

const initialState = {
  habits: [],
  completions: {},
  streaks: {},
};

function habitReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        habits: action.payload.habits || [],
        completions: action.payload.completions || {},
        streaks: action.payload.streaks || {},
      };

    case 'ADD_HABIT':
      const newHabit = {
        id: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description,
        category: action.payload.category,
        targetDays: action.payload.targetDays,
        color: action.payload.color,
        icon: action.payload.icon,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        habits: [...state.habits, newHabit],
        streaks: {
          ...state.streaks,
          [newHabit.id]: { current: 0, best: 0 }
        }
      };

    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        ),
      };

    case 'DELETE_HABIT':
      const { [action.payload]: removed, ...remainingCompletions } = state.completions;
      const { [action.payload]: removedStreak, ...remainingStreaks } = state.streaks;
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        completions: remainingCompletions,
        streaks: remainingStreaks,
      };

    case 'TOGGLE_COMPLETION':
      const { habitId, date } = action.payload;
      const dateKey = format(date, 'yyyy-MM-dd');
      const habitCompletions = state.completions[habitId] || {};
      const isCompleted = habitCompletions[dateKey];
      
      const updatedCompletions = {
        ...state.completions,
        [habitId]: {
          ...habitCompletions,
          [dateKey]: !isCompleted
        }
      };

      // Calculate new streak
      const newStreaks = { ...state.streaks };
      newStreaks[habitId] = calculateStreak(habitId, updatedCompletions);

      return {
        ...state,
        completions: updatedCompletions,
        streaks: newStreaks,
      };

    default:
      return state;
  }
}

function calculateStreak(habitId, completions) {
  const habitCompletions = completions[habitId] || {};
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Check from today backwards
  const today = startOfDay(new Date());
  for (let i = 0; i < 365; i++) {
    const checkDate = subDays(today, i);
    const dateKey = format(checkDate, 'yyyy-MM-dd');
    
    if (habitCompletions[dateKey]) {
      tempStreak++;
      if (i === 0 || habitCompletions[format(subDays(today, i - 1), 'yyyy-MM-dd')]) {
        currentStreak = tempStreak;
      }
    } else {
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
      if (i === 0) {
        currentStreak = 0;
      }
      tempStreak = 0;
    }
  }
  
  bestStreak = Math.max(bestStreak, tempStreak, currentStreak);
  
  return { current: currentStreak, best: bestStreak };
}

export function HabitProvider({ children }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('habitTracker');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsed });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes
    localStorage.setItem('habitTracker', JSON.stringify(state));
  }, [state]);

  const addHabit = (habitData) => {
    dispatch({ type: 'ADD_HABIT', payload: habitData });
  };

  const updateHabit = (id, updates) => {
    dispatch({ type: 'UPDATE_HABIT', payload: { id, updates } });
  };

  const deleteHabit = (id) => {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  };

  const toggleCompletion = (habitId, date = new Date()) => {
    dispatch({ type: 'TOGGLE_COMPLETION', payload: { habitId, date } });
  };

  const isHabitCompleted = (habitId, date = new Date()) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return !!(state.completions[habitId] && state.completions[habitId][dateKey]);
  };

  const getHabitStreak = (habitId) => {
    return state.streaks[habitId] || { current: 0, best: 0 };
  };

  const getCompletionRate = (habitId, days = 30) => {
    const habitCompletions = state.completions[habitId] || {};
    const today = startOfDay(new Date());
    let completed = 0;
    
    for (let i = 0; i < days; i++) {
      const checkDate = subDays(today, i);
      const dateKey = format(checkDate, 'yyyy-MM-dd');
      if (habitCompletions[dateKey]) {
        completed++;
      }
    }
    
    return Math.round((completed / days) * 100);
  };

  const value = {
    habits: state.habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isHabitCompleted,
    getHabitStreak,
    getCompletionRate,
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}