import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiCalendar, FiFire, FiTarget, FiAward, FiBarChart3, FiPieChart, FiActivity } = FiIcons;

function Stats() {
  const { habits, isHabitCompleted, getHabitStreak, getCompletionRate } = useHabits();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  const today = new Date();
  const periods = {
    week: { label: 'This Week', days: 7 },
    month: { label: 'This Month', days: 30 },
    quarter: { label: 'Last 90 Days', days: 90 }
  };

  // Calculate overall statistics
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => isHabitCompleted(habit.id, today)).length;
  const todayCompletionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  // Best streak across all habits
  const bestOverallStreak = Math.max(...habits.map(habit => getHabitStreak(habit.id).best), 0);
  
  // Current active streaks
  const activeStreaks = habits.filter(habit => getHabitStreak(habit.id).current > 0).length;
  
  // Average completion rate for selected period
  const avgCompletionRate = totalHabits > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + getCompletionRate(habit.id, periods[selectedPeriod].days), 0) / totalHabits)
    : 0;

  // Calculate habit performance data
  const habitPerformance = habits.map(habit => {
    const streak = getHabitStreak(habit.id);
    const completionRate = getCompletionRate(habit.id, periods[selectedPeriod].days);
    return {
      ...habit,
      streak: streak.current,
      bestStreak: streak.best,
      completionRate
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  // Weekly progress data
  const weeklyProgress = () => {
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return weekDays.map(day => {
      const completed = habits.filter(habit => isHabitCompleted(habit.id, day)).length;
      const rate = totalHabits > 0 ? (completed / totalHabits) * 100 : 0;
      return {
        day: format(day, 'EEE'),
        date: day,
        completed,
        total: totalHabits,
        rate: Math.round(rate)
      };
    });
  };

  // Category statistics
  const categoryStats = habits.reduce((acc, habit) => {
    const category = habit.category;
    if (!acc[category]) {
      acc[category] = { count: 0, completed: 0, totalRate: 0 };
    }
    acc[category].count++;
    acc[category].totalRate += getCompletionRate(habit.id, periods[selectedPeriod].days);
    if (isHabitCompleted(habit.id, today)) {
      acc[category].completed++;
    }
    return acc;
  }, {});

  const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    count: stats.count,
    completedToday: stats.completed,
    avgCompletionRate: Math.round(stats.totalRate / stats.count)
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="px-6 pt-12 pb-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <SafeIcon icon={FiBarChart3} className="w-6 h-6 mr-3" />
              Statistics
            </h1>
            <p className="text-primary-100 text-sm">
              Track your progress and achievements
            </p>
          </motion.div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="px-6 -mt-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {Object.entries(periods).map(([key, period]) => (
              <button
                key={key}
                onClick={() => setSelectedPeriod(key)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  selectedPeriod === key
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 space-y-6"
      >
        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Today</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedToday}/{totalHabits}</div>
            <div className="text-xs text-gray-500">{todayCompletionRate}% completed</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <SafeIcon icon={FiFire} className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Best Streak</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{bestOverallStreak}</div>
            <div className="text-xs text-gray-500">days in a row</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <SafeIcon icon={FiActivity} className="w-5 h-5 text-success-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Active Streaks</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeStreaks}</div>
            <div className="text-xs text-gray-500">habits on streak</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-secondary-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Average</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{avgCompletionRate}%</div>
            <div className="text-xs text-gray-500">{periods[selectedPeriod].label.toLowerCase()}</div>
          </div>
        </motion.div>

        {/* Weekly Progress Chart */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiCalendar} className="w-5 h-5 mr-2" />
            Weekly Progress
          </h3>
          <div className="space-y-3">
            {weeklyProgress().map((day, index) => (
              <div key={day.day} className="flex items-center">
                <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${day.rate}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                    />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 w-16 text-right">
                  {day.completed}/{day.total}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Habit Performance */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiAward} className="w-5 h-5 mr-2" />
            Habit Performance
          </h3>
          <div className="space-y-4">
            {habitPerformance.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full bg-${habit.color}-100 flex items-center justify-center mr-3`}>
                    <SafeIcon 
                      icon={FiIcons[`Fi${habit.icon}`] || FiTarget} 
                      className={`w-5 h-5 text-${habit.color}-600`} 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{habit.name}</div>
                    <div className="text-sm text-gray-500">
                      {habit.streak > 0 ? `${habit.streak} day streak` : 'No current streak'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{habit.completionRate}%</div>
                  <div className="text-xs text-gray-500">completion</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Statistics */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiPieChart} className="w-5 h-5 mr-2" />
            Categories
          </h3>
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{category.category}</div>
                  <div className="text-sm text-gray-500">
                    {category.count} {category.count === 1 ? 'habit' : 'habits'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{category.avgCompletionRate}%</div>
                  <div className="text-xs text-gray-500">avg completion</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Stats;