import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTarget, FiFire, FiTrendingUp, FiCalendar } = FiIcons;

function StatsOverview() {
  const { habits, isHabitCompleted, getHabitStreak, getCompletionRate } = useHabits();
  
  const today = new Date();
  const completedToday = habits.filter(habit => isHabitCompleted(habit.id, today)).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  const bestStreak = Math.max(...habits.map(habit => getHabitStreak(habit.id).best), 0);
  const averageCompletion = totalHabits > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + getCompletionRate(habit.id, 7), 0) / totalHabits)
    : 0;

  const stats = [
    {
      label: 'Today',
      value: `${completedToday}/${totalHabits}`,
      percentage: completionPercentage,
      icon: FiTarget,
      color: 'text-white',
      bgColor: 'bg-white bg-opacity-20'
    },
    {
      label: 'Best Streak',
      value: `${bestStreak}`,
      subtitle: 'days',
      icon: FiFire,
      color: 'text-white',
      bgColor: 'bg-white bg-opacity-20'
    },
    {
      label: 'This Week',
      value: `${averageCompletion}%`,
      subtitle: 'avg',
      icon: FiTrendingUp,
      color: 'text-white',
      bgColor: 'bg-white bg-opacity-20'
    }
  ];

  return (
    <div className="px-6 pb-8">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-2xl p-4 text-center backdrop-blur-sm`}
          >
            <div className="flex justify-center mb-3">
              <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className={`text-xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-xs text-white text-opacity-80">
              {stat.label}
            </div>
            {stat.percentage !== undefined && (
              <div className="mt-2">
                <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="bg-white h-1.5 rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StatsOverview;