import React from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  minLabel = 'Slow',
  maxLabel = 'Fast',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
        <span>{label}</span>
        <span className="text-accent-blue font-mono">{value}x</span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent-blue focus:outline-none"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${( (value - min) / (max - min) ) * 100}%, #27272a ${( (value - min) / (max - min) ) * 100}%, #27272a 100%)`
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};
