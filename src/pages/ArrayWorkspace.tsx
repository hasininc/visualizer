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

interface ArrayWorkspaceProps {
  elements: DSNode[];
  setElements: React.Dispatch<React.SetStateAction<DSNode[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  onEditValue?: (id: string, newValue: string) => void;
  visualizationData?: {
    compared: number[];
    swapped: number[];
    sorted: number[];
  } | null;
}

export const ArrayWorkspace: React.FC<ArrayWorkspaceProps> = ({
  elements,
  setElements,
  selectedId,
  onSelectNode,
  onEditValue,
  visualizationData,
}) => {
  const isVisualizing = !!visualizationData;

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full py-10">
      {elements.length === 0 ? (
        <div className="text-[#4c258d]/70 font-display font-medium text-sm select-none p-8 border border-dashed border-[#a38deb]/45 rounded-3xl">
          Array empty. Add elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <div className="text-center text-[10px] text-[#4c258d]/80 font-black tracking-widest uppercase mb-4">
            {isVisualizing
              ? 'Sorting algorithm in progress... Interactivity paused.'
              : 'Drag elements horizontally to reorder • Double-click to edit value'}
          </div>

          {isVisualizing ? (
            /* Non-draggable flex view for visualization steps */
            <div className="flex items-center gap-5 justify-center flex-wrap min-h-[120px] px-6 py-2">
              {elements.map((el, idx) => {
                const isCompared = visualizationData.compared.includes(idx);
                const isSwapped = visualizationData.swapped.includes(idx);
                const isSorted = visualizationData.sorted.includes(idx);

                let cardClass = '';
                if (isSwapped) {
                  cardClass = 'ring-4 ring-rose-500 ring-offset-2 bg-rose-200 border-rose-500 text-rose-950 animate-bounce';
                } else if (isCompared) {
                  cardClass = 'ring-4 ring-amber-500 ring-offset-2 bg-[#fdf2d5] border-amber-500 text-amber-950';
                } else if (isSorted) {
                  cardClass = 'bg-emerald-300 border-emerald-500 text-emerald-950 font-extrabold shadow-md pointer-events-none';
                }

                return (
                  <motion.div
                    key={el.id}
                    layoutId={el.id}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex flex-col items-center gap-1.5 relative"
                  >
                    <span className="text-[10px] font-bold font-mono text-[#4c258d] select-none">
                      Index {idx}
                    </span>
                    <NodeCard
                      value={el.value}
                      className={cardClass}
                      onSelect={() => {}}
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Draggable workspace for building array */
            <Reorder.Group
              axis="x"
              values={elements}
              onReorder={setElements}
              className="flex items-center gap-5 justify-center flex-wrap min-h-[120px] px-6 py-2"
            >
              {elements.map((el, idx) => {
                const isSelected = selectedId === el.id;
                return (
                  <Reorder.Item
                    key={el.id}
                    value={el}
                    className="flex flex-col items-center gap-1.5 relative cursor-grab active:cursor-grabbing"
                    whileDrag={{ scale: 1.08, zIndex: 10 }}
                  >
                    <span className="text-[10px] font-bold font-mono text-[#4c258d] select-none">
                      Index {idx}
                    </span>
                    <NodeCard
                      value={el.value}
                      isSelected={isSelected}
                      onSelect={() => onSelectNode(isSelected ? null : el.id)}
                      onEditValue={(newVal) => onEditValue?.(el.id, newVal)}
                    />
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          )}
        </div>
      )}
    </div>
  );
};

