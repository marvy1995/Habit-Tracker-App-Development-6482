import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiSave, FiTarget, FiBook, FiCoffee, FiHeart, FiZap, FiSun, FiMoon, FiActivity } = FiIcons;

const HABIT_ICONS = [
  { name: 'Target', icon: FiTarget },
  { name: 'Book', icon: FiBook },
  { name: 'Coffee', icon: FiCoffee },
  { name: 'Heart', icon: FiHeart },
  { name: 'Zap', icon: FiZap },
  { name: 'Sun', icon: FiSun },
  { name: 'Moon', icon: FiMoon },
  { name: 'Activity', icon: FiActivity },
];

const HABIT_COLORS = [
  'blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray'
];

const CATEGORIES = [
  'Health & Fitness',
  'Learning',
  'Productivity',
  'Mindfulness',
  'Social',
  'Creative',
  'Personal Care',
  'Other'
];

function HabitForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { habits, addHabit, updateHabit } = useHabits();
  
  const isEditing = !!id;
  const existingHabit = isEditing ? habits.find(h => h.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Health & Fitness',
    targetDays: 7,
    color: 'blue',
    icon: 'Target'
  });

  useEffect(() => {
    if (existingHabit) {
      setFormData({
        name: existingHabit.name,
        description: existingHabit.description || '',
        category: existingHabit.category,
        targetDays: existingHabit.targetDays,
        color: existingHabit.color,
        icon: existingHabit.icon
      });
    }
  }, [existingHabit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    if (isEditing) {
      updateHabit(id, formData);
    } else {
      addHabit(formData);
    }
    
    navigate('/');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 text-gray-600" />
          </motion.button>
          
          <h1 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Habit' : 'New Habit'}
          </h1>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              formData.name.trim()
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Habit Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habit Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Read for 30 minutes"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            autoFocus
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Add more details about this habit..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
          />
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Icon Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Icon
          </label>
          <div className="grid grid-cols-4 gap-3">
            {HABIT_ICONS.map(({ name, icon }) => (
              <motion.button
                key={name}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInputChange('icon', name)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.icon === name
                    ? `border-${formData.color}-500 bg-${formData.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <SafeIcon 
                  icon={icon} 
                  className={`w-6 h-6 mx-auto ${
                    formData.icon === name 
                      ? `text-${formData.color}-600` 
                      : 'text-gray-400'
                  }`} 
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Color Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {HABIT_COLORS.map(color => (
              <motion.button
                key={color}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInputChange('color', color)}
                className={`w-12 h-12 rounded-lg bg-${color}-500 border-4 transition-all ${
                  formData.color === color
                    ? 'border-gray-800 shadow-lg'
                    : 'border-gray-200'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Weekly Target */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Target
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="7"
              value={formData.targetDays}
              onChange={(e) => handleInputChange('targetDays', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
              {formData.targetDays} {formData.targetDays === 1 ? 'day' : 'days'} / week
            </span>
          </div>
        </motion.div>
      </form>
    </div>
  );
}

export default HabitForm;