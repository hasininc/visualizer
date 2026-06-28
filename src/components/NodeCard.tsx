import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NodeCardProps {
  id: string;
  value: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onEditValue?: (newValue: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NodeCard: React.FC<NodeCardProps> = ({
  value,
  isSelected = false,
  onSelect,
  onEditValue,
  className = '',
  size = 'md',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditValue) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value && onEditValue) {
      onEditValue(trimmed);
    } else {
      setEditValue(value); // revert
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-14 h-14 text-base rounded-2xl',
    lg: 'w-18 h-18 text-lg rounded-3xl',
  };

  return (
    <motion.div
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: isEditing ? 1 : 1.05 }}
      whileTap={{ scale: isEditing ? 1 : 0.96 }}
      animate={{
        scale: isSelected && !isEditing ? 1.08 : 1,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`
        flex items-center justify-center font-bold font-display select-none border transition-all duration-300 relative cursor-pointer
        ${sizeClasses[size]}
        ${
          isSelected && !isEditing
            ? 'bg-gradient-to-tr from-purple-200 to-indigo-200 border-purple-400 text-purple-950 shadow-md shadow-purple-500/10 active-glow'
            : isEditing
            ? 'bg-white border-purple-400 ring-2 ring-purple-100'
            : 'bg-white border-purple-100 hover:border-purple-300 text-purple-900 shadow-sm shadow-purple-500/5'
        }
        ${className}
      `}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          maxLength={4}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-full text-center bg-transparent outline-none text-purple-950 font-bold border-none p-0 focus:ring-0"
        />
      ) : (
        <span>{value}</span>
      )}
    </motion.div>
  );
};
