import React from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Card } from './Card';
import { Slider } from './Slider';
import { Button } from './Button';

interface VisualizerContainerProps {
  title: string;
  children: React.ReactNode;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  className?: string;
  controlsExtra?: React.ReactNode;
}

export const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
  title,
  children,
  isPlaying,
  onPlayToggle,
  onStepForward,
  onStepBackward,
  onReset,
  speed,
  onSpeedChange,
  className = '',
  controlsExtra,
}) => {
  return (
    <Card className={`flex flex-col gap-4 min-h-[480px] ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h3 className="text-lg font-bold text-white font-display tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse" />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {controlsExtra}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 min-h-[300px] bg-zinc-950/80 rounded-xl border border-white/5 relative flex items-center justify-center overflow-hidden">
        {/* Aesthetic digital grids inside canvas */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 border-t border-white/5 pt-4">
        {/* Left Side: Buttons */}
        <div className="flex items-center justify-center md:justify-start gap-2">
          <Button
            variant="secondary"
            onClick={onStepBackward}
            disabled={!onStepBackward || isPlaying}
            icon={<SkipBack className="w-4 h-4" />}
            className="p-2.5"
            title="Step Back"
          >
            Prev
          </Button>
          
          <Button
            variant="primary"
            onClick={onPlayToggle}
            icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            className="px-6"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            variant="secondary"
            onClick={onStepForward}
            disabled={!onStepForward || isPlaying}
            icon={<SkipForward className="w-4 h-4" />}
            className="p-2.5"
            title="Step Forward"
          >
            Next
          </Button>

          <Button
            variant="ghost"
            onClick={onReset}
            icon={<RotateCcw className="w-4 h-4" />}
            className="p-2.5 text-zinc-400 hover:text-white"
            title="Reset Simulation"
          >
            Reset
          </Button>
        </div>

        {/* Center: Slider */}
        <div className="flex justify-center w-full px-2">
          <Slider
            label="Animation Speed"
            min={0.5}
            max={4.0}
            value={speed}
            onChange={onSpeedChange}
            className="w-full max-w-[240px]"
          />
        </div>

        {/* Right: Operational indicators */}
        <div className="flex justify-center md:justify-end text-xs text-zinc-500 font-mono font-medium">
          Status: {isPlaying ? (
            <span className="text-accent-blue animate-pulse">RUNNING</span>
          ) : (
            <span className="text-zinc-400">IDLE</span>
          )}
        </div>
      </div>
    </Card>
  );
};
