import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

interface QueueWorkspaceProps {
  elements: DSNode[];
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
}

export const QueueWorkspace: React.FC<QueueWorkspaceProps> = ({
  elements,
  selectedId,
  onSelectNode,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full py-10">
      {elements.length === 0 ? (
        <div className="text-purple-300 font-display font-medium text-sm select-none p-8 border border-dashed border-purple-100 rounded-3xl">
          Queue empty. Enqueue elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          {/* Header instructions */}
          <div className="text-center text-[10px] text-purple-400 font-black tracking-widest uppercase mb-6 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Elements flow from Rear (Right) to Front (Left)</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>

          {/* Queue Pipeline Outer limits */}
          <div className="w-full max-w-2xl border-y-4 border-dashed border-purple-100/80 py-6 flex items-center justify-center gap-4 bg-purple-50/5 relative overflow-x-auto min-h-[140px] px-6">
            
            <AnimatePresence initial={false}>
              {elements.map((el, idx) => {
                const isFront = idx === 0;
                const isRear = idx === elements.length - 1;
                const isSelected = selectedId === el.id;

                return (
                  <motion.div
                    key={el.id}
                    layout
                    initial={{ x: 80, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -80, opacity: 0, scale: 0.8 }}
                    drag="x"
                    dragConstraints={{ left: -20, right: 20 }}
                    dragElastic={0.15}
                    dragMomentum={false}
                    onClick={() => onSelectNode(isSelected ? null : el.id)}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.08 }}
                    className={`
                      w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-base font-display cursor-grab active:cursor-grabbing select-none border relative transition-all duration-300 flex-shrink-0
                      ${
                        isFront
                          ? 'bg-gradient-to-tr from-purple-200 to-indigo-200 border-purple-400 text-purple-950 active-glow'
                          : isSelected
                          ? 'bg-purple-100/70 border-purple-300 text-purple-900 shadow-sm'
                          : 'bg-white border-purple-100 text-purple-800 shadow-sm'
                      }
                    `}
                  >
                    {/* Element Value */}
                    <span className="text-lg">{el.value}</span>
                    
                    {/* Index small tag */}
                    <span className="text-[8px] text-purple-400 font-mono absolute bottom-1 right-2">
                      [{idx}]
                    </span>

                    {/* Pointer Banners */}
                    {isFront && (
                      <div className="absolute -top-7 bg-purple-500 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase shadow-sm">
                        Front
                      </div>
                    )}
                    {isRear && !isFront && (
                      <div className="absolute -top-7 bg-indigo-400 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase shadow-sm">
                        Rear
                      </div>
                    )}
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
