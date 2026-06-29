import React from 'react';
import { Reorder, motion } from 'framer-motion';
import { NodeCard } from '../components/NodeCard';

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

interface StackWorkspaceProps {
  elements: DSNode[];
  setElements: React.Dispatch<React.SetStateAction<DSNode[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  onEditValue?: (id: string, newValue: string) => void;
  visualizationData?: {
    stack: string[];
    activeCharIdx: number;
    description: string;
    isValid: boolean;
  } | null;
}

export const StackWorkspace: React.FC<StackWorkspaceProps> = ({
  elements,
  setElements,
  selectedId,
  onSelectNode,
  onEditValue,
  visualizationData,
}) => {
  const isVisualizing = !!visualizationData;
  const stackElements = [...elements].reverse();

  const handleReorder = (newVisualOrder: DSNode[]) => {
    setElements([...newVisualOrder].reverse());
  };

  // Determine container styling based on validation status
  let containerBorderColor = 'border-[#a38deb]';
  let containerBgColor = 'bg-[#a28ceb]/10';
  if (isVisualizing) {
    if (!visualizationData.isValid) {
      containerBorderColor = 'border-rose-500 animate-pulse';
      containerBgColor = 'bg-rose-50';
    } else if (visualizationData.stack.length === 0 && visualizationData.description.includes('balanced')) {
      containerBorderColor = 'border-emerald-500';
      containerBgColor = 'bg-emerald-50/50';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full py-6">
      {elements.length === 0 && !isVisualizing ? (
        <div className="text-[#4c258d]/70 font-display font-medium text-sm select-none p-8 border border-dashed border-[#a38deb]/45 rounded-3xl">
          Stack empty. Push elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-xs">
          <div className="text-center text-[10px] text-[#4c258d]/80 font-black tracking-widest uppercase mb-6">
            {isVisualizing
              ? 'Balancing validation in progress... Interactivity paused.'
              : 'Drag vertically to reorder stack • Double-click to edit'}
          </div>

          {/* Figma Vertical Auto-Layout Stack Capsule */}
          <div className={`border-x-4 border-b-4 ${containerBorderColor} rounded-b-3xl p-4 ${containerBgColor} min-w-[150px] relative pt-6 flex flex-col items-center transition-all duration-300 min-h-[160px] justify-end`}>
            {/* Top Indicator Label */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-[#4c258d] font-bold font-mono tracking-widest uppercase select-none">
              Top of Stack
            </div>

            {isVisualizing ? (
              /* Non-draggable view during algorithm playback */
              <div className="flex flex-col items-center gap-3.5 w-full">
                {stackElements.map((el, idx) => {
                  const isTop = idx === 0;
                  const isInvalidState = !visualizationData.isValid;

                  let nodeClass = '';
                  if (isTop && isInvalidState) {
                    nodeClass = 'bg-rose-200 border-rose-500 text-rose-950 ring-4 ring-rose-500 ring-offset-1 animate-bounce';
                  } else if (isTop) {
                    nodeClass = 'bg-purple-600 border-purple-800 text-white ring-2 ring-purple-400';
                  } else {
                    nodeClass = 'bg-[#dfd7fc]/60 border-[#a38deb]/40 text-[#250d4f]';
                  }

                  return (
                    <motion.div
                      key={el.id}
                      layoutId={el.id}
                      className="flex items-center justify-between gap-3 px-3 py-1 border rounded-2xl w-full select-none"
                    >
                      <NodeCard
                        value={el.value}
                        size="sm"
                        className={`flex-shrink-0 ${nodeClass}`}
                        onSelect={() => {}}
                      />
                      <span className="text-[9px] text-[#4c258d] font-mono font-bold uppercase select-none">
                        {isTop ? 'TOP' : `[${elements.length - 1 - idx}]`}
                      </span>
                    </motion.div>
                  );
                })}
                {stackElements.length === 0 && (
                  <div className="text-[10px] text-[#4c258d]/50 italic select-none py-4">
                    Stack is empty
                  </div>
                )}
              </div>
            ) : (
              /* Draggable configuration view */
              <Reorder.Group
                axis="y"
                values={stackElements}
                onReorder={handleReorder}
                className="flex flex-col items-center gap-3.5 w-full"
              >
                {stackElements.map((el, idx) => {
                  const isTop = idx === 0;
                  const isSelected = selectedId === el.id;

                  return (
                    <Reorder.Item
                      key={el.id}
                      value={el}
                      className="cursor-grab active:cursor-grabbing flex items-center justify-between gap-3 px-3 py-1 bg-[#dfd7fc]/40 hover:bg-[#dfd7fc]/60 border border-[#a38deb]/30 rounded-2xl w-full select-none"
                      whileDrag={{ scale: 1.05, zIndex: 10 }}
                    >
                      <NodeCard
                        value={el.value}
                        isSelected={isSelected}
                        onSelect={() => onSelectNode(isSelected ? null : el.id)}
                        onEditValue={(newVal) => onEditValue?.(el.id, newVal)}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      
                      <span className="text-[9px] text-[#4c258d] font-mono font-bold uppercase select-none">
                        {isTop ? 'TOP' : `[${elements.length - 1 - idx}]`}
                      </span>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

