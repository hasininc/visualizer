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

interface ArrayWorkspaceProps {
  elements: DSNode[];
  setElements: React.Dispatch<React.SetStateAction<DSNode[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  onEditValue?: (id: string, newValue: string) => void;
}

export const ArrayWorkspace: React.FC<ArrayWorkspaceProps> = ({
  elements,
  setElements,
  selectedId,
  onSelectNode,
  onEditValue,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full py-10">
      {elements.length === 0 ? (
        <div className="text-purple-300 font-display font-medium text-sm select-none p-8 border border-dashed border-purple-100 rounded-3xl">
          Array empty. Add elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <div className="text-center text-[10px] text-purple-400 font-black tracking-widest uppercase mb-4">
            Drag elements horizontally to reorder • Double-click to edit value
          </div>

          {/* Figma Auto-Layout Horizontal Frame */}
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
                  {/* Index Header */}
                  <span className="text-[10px] font-bold font-mono text-purple-400 select-none">
                    Index {idx}
                  </span>

                  {/* Smart Node Card Component */}
                  <NodeCard
                    id={el.id}
                    value={el.value}
                    isSelected={isSelected}
                    onSelect={() => onSelectNode(isSelected ? null : el.id)}
                    onEditValue={(newVal) => onEditValue?.(el.id, newVal)}
                  />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>
      )}
    </div>
  );
};
