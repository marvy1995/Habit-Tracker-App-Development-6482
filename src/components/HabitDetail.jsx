import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, subDays, startOfDay } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiEdit3, FiTrash2, FiFire, FiTrendingUp, FiCalendar, FiTarget } = FiIcons;

function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { habits, deleteHabit, getHabitStreak, getCompletionRate, isHabitCompleted, toggleCompletion } = useHabits();
  
  const habit = habits.find(h => h.id === id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!habit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Habit not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const streak = getHabitStreak(id);
  const completionRate30 = getCompletionRate(id, 30);
  const completionRate7 = getCompletionRate(id, 7);

  const handleDelete = () => {
    deleteHabit(id);
    navigate('/');
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

  // Generate last 30 days for history
  const historyDays = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(startOfDay(new Date()), i);
    return {
      date,
      completed: isHabitCompleted(id, date)
    };
  }).reverse();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${habit.color}-500 to-${habit.color}-600 text-white`}>
        <div className="flex items-center justify-between px-6 py-4 pt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </motion.button>
          
          <div className="flex space-x-2">
            <motion.a
              href={`#/edit-habit/${id}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
            >
              <SafeIcon icon={FiEdit3} className="w-5 h-5" />
            </motion.a>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
            >
              <SafeIcon icon={FiTrash2} className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
              <SafeIcon icon={HabitIcon} className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{habit.name}</h1>
              <p className="text-white text-opacity-80 mt-1">{habit.category}</p>
            </div>
          </div>
          
          {habit.description && (
            <p className="text-white text-opacity-90 text-sm">
              {habit.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-6 grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiFire} className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">Current Streak</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{streak.current}</div>
          <div className="text-xs text-gray-500">Best: {streak.best} days</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">This Week</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{completionRate7}%</div>
          <div className="text-xs text-gray-500">30 days: {completionRate30}%</div>
        </motion.div>
      </div>

      {/* Progress History */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiCalendar} className="w-5 h-5 mr-2" />
            Last 30 Days
          </h3>
          
          <div className="grid grid-cols-10 gap-1">
            {historyDays.map((day, index) => (
              <motion.button
                key={day.date.toISOString()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleCompletion(id, day.date)}
                className={`aspect-square rounded text-xs font-medium transition-all ${
                  day.completed
                    ? `bg-${habit.color}-500 text-white`
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title={format(day.date, 'MMM d, yyyy')}
              >
                {format(day.date, 'd')}
              </motion.button>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <div className={`w-3 h-3 bg-${habit.color}-200 rounded`}></div>
              <div className={`w-3 h-3 bg-${habit.color}-400 rounded`}></div>
              <div className={`w-3 h-3 bg-${habit.color}-500 rounded`}></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-6"
      >
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCompletion(id, new Date())}
              className={`w-full p-3 rounded-lg font-medium transition-all ${
                isHabitCompleted(id, new Date())
                  ? 'bg-success-100 text-success-700 border border-success-200'
                  : `bg-${habit.color}-50 text-${habit.color}-700 border border-${habit.color}-200`
              }`}
            >
              {isHabitCompleted(id, new Date()) ? 'Mark as Incomplete Today' : 'Mark as Complete Today'}
            </motion.button>
            
            <motion.a
              href={`#/edit-habit/${id}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all text-center block"
            >
              Edit Habit Details
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Habit</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{habit.name}"? This action cannot be undone and will remove all progress data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg font-medium hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default HabitDetail;