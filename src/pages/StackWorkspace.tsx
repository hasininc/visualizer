import React from 'react';
import { Reorder } from 'framer-motion';
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
}

export const StackWorkspace: React.FC<StackWorkspaceProps> = ({
  elements,
  setElements,
  selectedId,
  onSelectNode,
  onEditValue,
}) => {
  // Visual rendering order (Top of stack first in the flex column)
  const stackElements = [...elements].reverse();

  const handleReorder = (newVisualOrder: DSNode[]) => {
    // Reverse back to maintain proper stack LIFO index array
    setElements([...newVisualOrder].reverse());
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full py-6">
      {elements.length === 0 ? (
        <div className="text-[#4c258d]/70 font-display font-medium text-sm select-none p-8 border border-dashed border-[#a38deb]/45 rounded-3xl">
          Stack empty. Push elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-xs">
          <div className="text-center text-[10px] text-[#4c258d]/80 font-black tracking-widest uppercase mb-6">
            Drag vertically to reorder stack • Double-click to edit
          </div>

          {/* Figma Vertical Auto-Layout Stack Capsule */}
          <div className="border-x-4 border-b-4 border-[#a38deb] rounded-b-3xl p-4 bg-[#a28ceb]/10 min-w-[150px] relative pt-6 flex flex-col items-center">
            {/* Top Indicator Label */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-[#4c258d] font-bold font-mono tracking-widest uppercase select-none">
              Top of Stack
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
};
