import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

interface StackWorkspaceProps {
  elements: DSNode[];
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
}

export const StackWorkspace: React.FC<StackWorkspaceProps> = ({
  elements,
  selectedId,
  onSelectNode,
}) => {
  // Elements are rendered vertically. Top of the stack is the last element (index length - 1)
  const stackElements = [...elements].reverse();

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full py-6">
      {elements.length === 0 ? (
        <div className="text-purple-300 font-display font-medium text-sm select-none p-8 border border-dashed border-purple-100 rounded-3xl">
          Stack empty. Push elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Stack containment lines */}
          <div className="border-x-4 border-b-4 border-purple-100 rounded-b-3xl p-4 flex flex-col items-center gap-3.5 bg-purple-50/10 min-w-[140px] relative">
            
            {/* Top Indicator Label */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-purple-400 font-bold font-mono tracking-widest uppercase">
              Top of Stack
            </div>

            <AnimatePresence initial={false}>
              {stackElements.map((el, idx) => {
                const isTop = idx === 0;
                const isSelected = selectedId === el.id;
                
                return (
                  <motion.div
                    key={el.id}
                    layout
                    initial={{ y: -60, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -60, opacity: 0, scale: 0.8 }}
                    drag="y"
                    dragConstraints={{ top: -20, bottom: 20 }}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onClick={() => onSelectNode(isSelected ? null : el.id)}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.08 }}
                    className={`
                      w-24 py-3 rounded-2xl flex items-center justify-between px-4 font-bold text-base font-display cursor-grab active:cursor-grabbing select-none border transition-all duration-300
                      ${
                        isTop
                          ? 'bg-gradient-to-tr from-purple-200 to-indigo-200 border-purple-400 text-purple-950 shadow-md shadow-purple-500/10 active-glow'
                          : isSelected
                          ? 'bg-purple-100/60 border-purple-300 text-purple-900 shadow-sm'
                          : 'bg-white border-purple-100 text-purple-800 shadow-sm'
                      }
                    `}
                  >
                    <span>{el.value}</span>
                    <span className="text-[9px] text-purple-400 font-mono font-medium">
                      {isTop ? 'TOP' : `[${elements.length - 1 - idx}]`}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
