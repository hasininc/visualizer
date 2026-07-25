import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children?: React.ReactNode;
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
    primary: 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-md border-transparent hover:opacity-90 active:scale-95',
    secondary: 'bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border-[var(--btn-secondary-border)] hover:bg-[var(--btn-secondary-hover)] active:scale-95',
    ghost: 'text-[var(--btn-ghost-text)] hover:bg-[var(--btn-ghost-hover)] border-transparent',
    danger: 'bg-rose-600 text-white border-transparent hover:bg-rose-700',
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
      {children && <span>{children}</span>}
    </motion.button>
  );
};
