import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import HabitForm from './components/HabitForm';
import HabitDetail from './components/HabitDetail';
import Stats from './components/Stats';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import { HabitProvider } from './context/HabitContext';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-white border-t-transparent rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Habit Tracker
          </h1>
          <p className="text-gray-600 mt-2">Building better habits, one day at a time</p>
        </motion.div>
      </div>
    );
  }

  return (
    <HabitProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-habit" element={<HabitForm />} />
              <Route path="/edit-habit/:id" element={<HabitForm />} />
              <Route path="/habit/:id" element={<HabitDetail />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <Navigation />
          </div>
        </div>
      </Router>
    </HabitProvider>
  );
}

export default App;