import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUser, FiSettings, FiAward, FiTrendingUp, FiCalendar, 
  FiFire, FiTarget, FiEdit3, FiDownload, FiUpload, 
  FiTrash2, FiStar, FiShield, FiCamera, FiMapPin, 
  FiPhone, FiMail, FiCalendar as FiCalendarIcon, 
  FiSave, FiX
} = FiIcons;

function Profile() {
  const { habits, isHabitCompleted, getHabitStreak, getCompletionRate } = useHabits();
  const [showSettings, setShowSettings] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Extended user profile data
  const [userProfile, setUserProfile] = useState({
    name: 'Habit Tracker User',
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    birthdate: '1990-01-01',
    location: 'San Francisco, CA',
    bio: 'Passionate about building better habits and personal growth.',
    joinDate: new Date('2024-01-01'),
    avatar: null,
    notifications: true,
    reminders: true,
    weekStart: 'monday',
    darkMode: false,
    privacyLevel: 'private',
    language: 'english',
    timezone: 'UTC-8'
  });

  const today = new Date();
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => isHabitCompleted(habit.id, today)).length;
  const daysActive = differenceInDays(today, userProfile.joinDate);
  
  // Calculate achievements
  const totalCompletions = habits.reduce((sum, habit) => {
    let completions = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      if (isHabitCompleted(habit.id, checkDate)) {
        completions++;
      }
    }
    return sum + completions;
  }, 0);

  const bestStreak = Math.max(...habits.map(habit => getHabitStreak(habit.id).best), 0);
  const currentStreaks = habits.filter(habit => getHabitStreak(habit.id).current > 0).length;
  const perfectDays = (() => {
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const completed = habits.filter(habit => isHabitCompleted(habit.id, checkDate)).length;
      if (completed === totalHabits && totalHabits > 0) {
        count++;
      }
    }
    return count;
  })();

  // Achievement badges
  const achievements = [
    {
      id: 'first_habit',
      name: 'Getting Started',
      description: 'Created your first habit',
      icon: FiTarget,
      unlocked: totalHabits > 0,
      color: 'blue'
    },
    {
      id: 'week_streak',
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      icon: FiFire,
      unlocked: bestStreak >= 7,
      color: 'orange'
    },
    {
      id: 'month_streak',
      name: 'Monthly Master',
      description: 'Maintained a 30-day streak',
      icon: FiAward,
      unlocked: bestStreak >= 30,
      color: 'yellow'
    },
    {
      id: 'perfect_week',
      name: 'Perfect Week',
      description: 'Completed all habits for 7 days',
      icon: FiStar,
      unlocked: perfectDays >= 7,
      color: 'purple'
    },
    {
      id: 'habit_collector',
      name: 'Habit Collector',
      description: 'Created 10 different habits',
      icon: FiShield,
      unlocked: totalHabits >= 10,
      color: 'green'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  const handleExportData = () => {
    const data = {
      habits,
      profile: userProfile,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${format(today, 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          // Here you would implement the import logic
          console.log('Import data:', data);
        } catch (error) {
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      <div className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
        <div className="px-6 pt-12 pb-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <div 
                onClick={handleProfilePictureClick}
                className="relative w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 cursor-pointer group overflow-hidden"
              >
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <SafeIcon icon={FiUser} className="w-8 h-8" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <SafeIcon icon={FiCamera} className="w-6 h-6 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                <div className="flex items-center text-primary-100 text-sm">
                  <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
                  <span>{userProfile.location}</span>
                  <span className="mx-2">•</span>
                  <span>Active for {daysActive} days</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditProfile(!editProfile)}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
              >
                <SafeIcon icon={editProfile ? FiX : FiEdit3} className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
              >
                <SafeIcon icon={FiSettings} className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 -mt-4 space-y-6"
      >
        {/* Profile Edit Form */}
        {editProfile && (
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <SafeIcon icon={FiEdit3} className="w-5 h-5 mr-2" />
                Edit Profile
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditProfile(false)}
                className="flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                Save Changes
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div 
                  onClick={handleProfilePictureClick}
                  className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3 cursor-pointer group overflow-hidden"
                >
                  {userProfile.avatar ? (
                    <img 
                      src={userProfile.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <SafeIcon icon={FiUser} className="w-10 h-10 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <SafeIcon icon={FiCamera} className="w-8 h-8 text-white" />
                  </div>
                </div>
                <span className="text-sm text-gray-500">Tap to change profile photo</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <SafeIcon icon={FiUser} className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <SafeIcon icon={FiMail} className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <SafeIcon icon={FiPhone} className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                  <div className="relative">
                    <SafeIcon icon={FiCalendarIcon} className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={userProfile.birthdate}
                      onChange={(e) => handleInputChange('birthdate', e.target.value)}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <SafeIcon icon={FiMapPin} className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={userProfile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={userProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Info Card (when not editing) */}
        {!editProfile && (
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{userProfile.email}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium text-gray-900">{userProfile.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <SafeIcon icon={FiCalendarIcon} className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Birthdate</div>
                  <div className="font-medium text-gray-900">
                    {new Date(userProfile.birthdate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium text-gray-900">{userProfile.location}</div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="text-sm text-gray-500">Bio</div>
                </div>
                <div className="pl-12 font-medium text-gray-900">
                  {userProfile.bio}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Stats */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{totalHabits}</div>
              <div className="text-sm text-gray-500">Total Habits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{totalCompletions}</div>
              <div className="text-sm text-gray-500">Completions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{bestStreak}</div>
              <div className="text-sm text-gray-500">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{perfectDays}</div>
              <div className="text-sm text-gray-500">Perfect Days</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiAward} className="w-5 h-5 mr-2" />
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? `border-${achievement.color}-200 bg-${achievement.color}-50`
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  achievement.unlocked
                    ? `bg-${achievement.color}-100`
                    : 'bg-gray-100'
                }`}>
                  <SafeIcon 
                    icon={achievement.icon} 
                    className={`w-6 h-6 ${
                      achievement.unlocked
                        ? `text-${achievement.color}-600`
                        : 'text-gray-400'
                    }`} 
                  />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </div>
                  <div className={`text-sm ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <SafeIcon icon={FiAward} className={`w-5 h-5 text-${achievement.color}-600`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next Goal */}
        {nextAchievement && (
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <SafeIcon icon={FiTarget} className="w-5 h-5 mr-2" />
              Next Goal
            </h3>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full bg-${nextAchievement.color}-100 flex items-center justify-center mr-4`}>
                <SafeIcon 
                  icon={nextAchievement.icon} 
                  className={`w-6 h-6 text-${nextAchievement.color}-600`} 
                />
              </div>
              <div>
                <div className="font-medium text-gray-900">{nextAchievement.name}</div>
                <div className="text-sm text-gray-600">{nextAchievement.description}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiSettings} className="w-5 h-5 mr-2" />
              Settings
            </h3>
            
            <div className="space-y-4">
              {/* Preferences */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Notifications</span>
                    <button
                      onClick={() => handleInputChange('notifications', !userProfile.notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        userProfile.notifications ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        userProfile.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Daily Reminders</span>
                    <button
                      onClick={() => handleInputChange('reminders', !userProfile.reminders)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        userProfile.reminders ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        userProfile.reminders ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Dark Mode</span>
                    <button
                      onClick={() => handleInputChange('darkMode', !userProfile.darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        userProfile.darkMode ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        userProfile.darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Week starts on</label>
                    <select
                      value={userProfile.weekStart}
                      onChange={(e) => handleInputChange('weekStart', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="monday">Monday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={userProfile.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="japanese">Japanese</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      value={userProfile.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                      <option value="UTC+1">Central European Time (UTC+1)</option>
                      <option value="UTC+8">China Standard Time (UTC+8)</option>
                      <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Level</label>
                    <select
                      value={userProfile.privacyLevel}
                      onChange={(e) => handleInputChange('privacyLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="private">Private - Only you can see your habits</option>
                      <option value="friends">Friends - Share with friends only</option>
                      <option value="public">Public - Share with everyone</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Data Management</h4>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExportData}
                    className="w-full flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  >
                    <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                    Export Data
                  </motion.button>
                  
                  <label className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                    <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                    Import Data
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-error-500 text-white rounded-lg font-medium hover:bg-error-600 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
                    Clear All Data
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* App Info */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>Version: 1.0.0</div>
            <div>Built with React & Tailwind CSS</div>
            <div>© 2024 Habit Tracker</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Profile;