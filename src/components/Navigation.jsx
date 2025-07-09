import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiPlus, FiTrendingUp, FiUser } = FiIcons;

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/add-habit', icon: FiPlus, label: 'Add' },
    { path: '/stats', icon: FiTrendingUp, label: 'Stats' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.hash === '#/';
    }
    return location.hash === `#${path}`;
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom"
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <motion.a
                key={item.path}
                href={`#${item.path}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
                  active
                    ? 'text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <SafeIcon 
                  icon={item.icon} 
                  className={`w-6 h-6 mb-1 ${
                    active ? 'text-primary-600' : 'text-gray-400'
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  active ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
                
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"
                  />
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navigation;