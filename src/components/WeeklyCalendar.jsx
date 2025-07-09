import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { useHabits } from '../context/HabitContext';

function WeeklyCalendar({ selectedDate, onDateSelect }) {
  const { habits, isHabitCompleted } = useHabits();
  
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getCompletedHabitsCount = (date) => {
    return habits.filter(habit => isHabitCompleted(habit.id, date)).length;
  };

  const getTotalHabitsCount = () => habits.length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const completedCount = getCompletedHabitsCount(day);
          const totalCount = getTotalHabitsCount();
          const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
          
          return (
            <motion.button
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day)}
              className={`relative p-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : isCurrentDay
                  ? 'bg-primary-50 text-primary-600 border-2 border-primary-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-xs font-medium mb-1">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-bold ${
                isSelected ? 'text-white' : isCurrentDay ? 'text-primary-700' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
              
              {/* Progress indicator */}
              {totalCount > 0 && (
                <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1.5 rounded-full ${
                  isSelected ? 'bg-white bg-opacity-30' : 'bg-gray-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected 
                        ? 'bg-white' 
                        : completionRate === 100 
                        ? 'bg-success-500' 
                        : 'bg-primary-400'
                    }`}
                  />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyCalendar;