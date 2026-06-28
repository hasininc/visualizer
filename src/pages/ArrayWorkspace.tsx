import React from 'react';
import { motion } from 'framer-motion';

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
}

export const ArrayWorkspace: React.FC<ArrayWorkspaceProps> = ({
  elements,
  setElements,
  selectedId,
  onSelectNode,
}) => {
  const handleDragEnd = (draggedIdx: number, info: any) => {
    // Approximate card width + gap (approx 84px)
    const shift = Math.round(info.offset.x / 84);
    if (shift !== 0) {
      let targetIdx = draggedIdx + shift;
      targetIdx = Math.max(0, Math.min(targetIdx, elements.length - 1));
      
      if (targetIdx !== draggedIdx) {
        const reordered = [...elements];
        const [removed] = reordered.splice(draggedIdx, 1);
        reordered.splice(targetIdx, 0, removed);
        setElements(reordered);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full py-10">
      {elements.length === 0 ? (
        <div className="text-purple-300 font-display font-medium text-sm select-none p-8 border border-dashed border-purple-100 rounded-3xl">
          Canvas empty. Add elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Header instructions */}
          <div className="text-center text-[10px] text-purple-400 font-black tracking-widest uppercase mb-4">
            Drag elements horizontally to swap indices
          </div>

          <div className="flex items-center gap-5 justify-center flex-wrap min-h-[120px] px-6">
            {elements.map((el, idx) => {
              const isSelected = selectedId === el.id;
              return (
                <div key={el.id} className="flex flex-col items-center gap-1.5 relative">
                  {/* Index Header */}
                  <span className="text-[11px] font-bold font-mono text-purple-400">
                    Index {idx}
                  </span>

                  {/* Array Box element */}
                  <motion.div
                    layout
                    drag="x"
                    dragConstraints={{ left: -100, right: 100 }}
                    dragElastic={0.2}
                    dragMomentum={false}
                    onDragEnd={(_, info) => handleDragEnd(idx, info)}
                    onClick={() => onSelectNode(isSelected ? null : el.id)}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1, zIndex: 10 }}
                    className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg font-display cursor-grab active:cursor-grabbing select-none border transition-all duration-300
                      ${
                        isSelected
                          ? 'bg-gradient-to-tr from-purple-200 to-indigo-200 border-purple-400 text-purple-950 active-glow'
                          : 'bg-white border-purple-100 hover:border-purple-300 text-purple-900 shadow-sm shadow-purple-500/5'
                      }
                    `}
                  >
                    {el.value}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
