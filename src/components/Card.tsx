import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  hoverEffect = false,
  onClick,
}) => {
  const CardComponent = onClick ? motion.div : 'div';
  const customProps = onClick
    ? {
        whileHover: hoverEffect ? { y: -2, scale: 1.01 } : {},
        whileTap: { scale: 0.99 },
        onClick,
        style: { cursor: 'pointer' },
      }
    : {};

  return (
    // @ts-ignore
    <CardComponent
      {...customProps}
      className={`
        ${glow ? 'glass-panel-glow' : 'glass-panel'}
        ${hoverEffect && !onClick ? 'glow-card' : ''}
        rounded-2xl p-6 transition-all duration-300 relative overflow-hidden
        ${className}
      `}
    >
      {/* Decorative inner ambient light */}
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-accent-blue/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-accent-purple/10 rounded-full blur-2xl pointer-events-none" />
      
      {children}
    </CardComponent>
  );
};
