import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon,
  disabled = false,
  type = 'button',
  title,
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-2xl font-bold font-display transition-all duration-300 text-sm focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none border';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-[0_4px_12px_rgba(139,92,246,0.15)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.25)] border-transparent',
    secondary: 'bg-white/80 text-purple-700 hover:text-purple-800 border-purple-100 hover:border-purple-200/80 shadow-[0_2px_8px_rgba(139,92,246,0.04)]',
    ghost: 'text-purple-400 hover:text-purple-600 hover:bg-purple-50/50 border-transparent',
    danger: 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-[0_4px_12px_rgba(244,63,94,0.12)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.2)] border-transparent',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && <span className="text-base flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
