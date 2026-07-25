import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative flex items-center justify-between w-16 h-8 p-1 rounded-full cursor-pointer transition-colors duration-300 select-none border focus:outline-none focus:ring-2 focus:ring-purple-400
        ${
          isDark
            ? 'bg-[#221b3a] border-[#52407d] text-purple-300'
            : 'bg-[#d0c4fc] border-[#a38deb] text-[#4c258d]'
        }
      `}
    >
      {/* Background Icons */}
      <Sun className={`w-4 h-4 z-0 transition-opacity duration-300 ${isDark ? 'opacity-40 text-amber-300/60' : 'opacity-100 text-amber-500'}`} />
      <Moon className={`w-4 h-4 z-0 transition-opacity duration-300 ${isDark ? 'opacity-100 text-indigo-300' : 'opacity-40 text-[#4c258d]/50'}`} />

      {/* Animated Sliding Pill */}
      <motion.div
        className={`
          absolute w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10
          ${isDark ? 'bg-indigo-600 text-white shadow-indigo-900/50' : 'bg-amber-400 text-amber-950 shadow-amber-500/30'}
        `}
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-current text-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-current text-amber-950" />
        )}
      </motion.div>
    </button>
  );
};
