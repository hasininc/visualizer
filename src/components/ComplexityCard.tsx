import React from 'react';
import { Clock, HardDrive, AlertCircle } from 'lucide-react';
import { Card } from './Card';

interface ComplexityCardProps {
  algorithmName: string;
  timeBest: string;
  timeAverage: string;
  timeWorst: string;
  spaceWorst: string;
  className?: string;
}

export const ComplexityCard: React.FC<ComplexityCardProps> = ({
  algorithmName,
  timeBest,
  timeAverage,
  timeWorst,
  spaceWorst,
  className = '',
}) => {
  return (
    <Card className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <AlertCircle className="w-5 h-5 text-accent-blue" />
        <h3 className="font-semibold text-white text-base font-display">
          {algorithmName} Specs
        </h3>
      </div>
      
      <div className="flex flex-col gap-3.5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Time Complexity</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-2 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Best</span>
              <code className="text-emerald-400 text-xs font-mono font-medium">{timeBest}</code>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-2 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Average</span>
              <code className="text-accent-blue text-xs font-mono font-medium">{timeAverage}</code>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-2 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Worst</span>
              <code className="text-accent-pink text-xs font-mono font-medium">{timeWorst}</code>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-3.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1.5">
            <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
            <span>Space Complexity</span>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Worst Case</span>
            <code className="text-accent-purple text-sm font-mono font-semibold">{spaceWorst}</code>
          </div>
        </div>
      </div>

      <div className="mt-1 text-[10px] text-zinc-500 leading-normal bg-white/5 rounded-lg p-2 border border-white/5">
        Note: <span className="font-semibold text-zinc-400">n</span> represents the size of the data structure (e.g., number of elements in the array, nodes in a tree/graph).
      </div>
    </Card>
  );
};
