import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiMoreHorizontal, FiFire, FiCheckCircle } = FiIcons;

function HabitCard({ habit, selectedDate }) {
  const { toggleCompletion, isHabitCompleted, getHabitStreak } = useHabits();
  
  const isCompleted = isHabitCompleted(habit.id, selectedDate);
  const streak = getHabitStreak(habit.id);
  
  const handleToggle = () => {
    toggleCompletion(habit.id, selectedDate);
  };

  const iconMap = {
    'Book': FiIcons.FiBook,
    'Coffee': FiIcons.FiCoffee,
    'Heart': FiIcons.FiHeart,
    'Zap': FiIcons.FiZap,
    'Target': FiIcons.FiTarget,
    'Sun': FiIcons.FiSun,
    'Moon': FiIcons.FiMoon,
    'Activity': FiIcons.FiActivity,
  };

  const HabitIcon = iconMap[habit.icon] || FiIcons.FiTarget;

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all duration-300 ${
        isCompleted 
          ? 'border-success-200 bg-gradient-to-r from-success-50 to-success-100' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 ${
              isCompleted 
                ? 'bg-success-100 border-2 border-success-200' 
                : `bg-${habit.color}-100 border-2 border-${habit.color}-200`
            }`}
          >
            <SafeIcon 
              icon={HabitIcon} 
              className={`w-7 h-7 ${
                isCompleted 
                  ? 'text-success-600' 
                  : `text-${habit.color}-600`
              }`} 
            />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg ${
              isCompleted ? 'text-success-800' : 'text-gray-900'
            }`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className={`text-sm mt-1 ${
                isCompleted ? 'text-success-600' : 'text-gray-500'
              }`}>
                {habit.description}
              </p>
            )}
            {streak.current > 0 && (
              <div className="flex items-center mt-2">
                <SafeIcon icon={FiFire} className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm font-medium text-orange-600">
                  {streak.current} day streak
                </span>
                {streak.current >= 7 && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    🔥 Hot!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
              isCompleted
                ? 'bg-success-500 text-white shadow-success-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <SafeIcon 
              icon={isCompleted ? FiCheckCircle : FiCheck} 
              className={`w-6 h-6 ${isCompleted ? 'opacity-100' : 'opacity-0'}`} 
            />
          </motion.button>

          <motion.a
            href={`#/habit/${habit.id}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
          >
            <SafeIcon icon={FiMoreHorizontal} className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export default HabitCard;