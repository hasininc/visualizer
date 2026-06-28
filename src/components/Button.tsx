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
    primary: 'bg-[#4c258d] text-[#ece8ff] shadow-md border-transparent hover:bg-[#3f1c7a] active:bg-[#36166a]',
    secondary: 'bg-[#a28ceb] text-[#250d4f] border-[#947deb] hover:bg-[#9278e6] active:bg-[#8569db]',
    ghost: 'text-[#250d4f] hover:bg-[#bdabfc]/60 border-transparent',
    danger: 'bg-rose-700 text-[#ece8ff] border-transparent hover:bg-rose-850',
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
