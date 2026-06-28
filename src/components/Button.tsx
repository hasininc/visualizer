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
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-transparent',
    secondary: 'glass-panel text-gray-200 hover:text-white border border-white/10 hover:border-accent-purple/50',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-transparent',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && <span className="text-base flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
