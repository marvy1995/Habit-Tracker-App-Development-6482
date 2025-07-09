import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import HabitCard from './HabitCard';
import WeeklyCalendar from './WeeklyCalendar';
import StatsOverview from './StatsOverview';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrendingUp, FiCalendar, FiTarget, FiSun, FiMoon } = FiIcons;

function Dashboard() {
  const { habits } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today');

  const todayHabits = habits.filter(habit => 
    activeTab === 'today' || 
    (activeTab === 'all')
  );

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning! 🌅', icon: FiSun };
    if (hour < 17) return { text: 'Good afternoon! ☀️', icon: FiSun };
    return { text: 'Good evening! 🌙', icon: FiMoon };
  };

  const greeting = getCurrentGreeting();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-600 text-white">
        <div className="px-6 pt-12 pb-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                {greeting.text}
              </h1>
              <p className="text-primary-100 text-sm">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <SafeIcon icon={greeting.icon} className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Quick Stats */}
        <StatsOverview />
      </div>

      {/* Weekly Calendar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 -mt-4"
      >
        <WeeklyCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </motion.div>

      {/* Tab Navigation */}
      <div className="px-6 mt-6">
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
          {[
            { key: 'today', label: 'Today', icon: FiCalendar },
            { key: 'all', label: 'All Habits', icon: FiTarget }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Habits List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 mt-6 space-y-4"
      >
        {todayHabits.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <SafeIcon icon={FiTarget} className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
              Start building positive habits by adding your first one! Small steps lead to big changes.
            </p>
            <motion.a
              href="#/add-habit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium shadow-lg"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
              Add Your First Habit
            </motion.a>
          </motion.div>
        ) : (
          todayHabits.map((habit) => (
            <motion.div key={habit.id} variants={itemVariants}>
              <HabitCard habit={habit} selectedDate={selectedDate} />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Floating Action Button */}
      {habits.length > 0 && (
        <motion.a
          href="#/add-habit"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-2xl flex items-center justify-center z-10"
        >
          <SafeIcon icon={FiPlus} className="w-7 h-7" />
        </motion.a>
      )}
    </div>
  );
}

export default Dashboard;