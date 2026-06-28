import React from 'react';
import { Reorder } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { NodeCard } from '../components/NodeCard';

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

interface QueueWorkspaceProps {
  elements: DSNode[];
  setElements: React.Dispatch<React.SetStateAction<DSNode[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  onEditValue?: (id: string, newValue: string) => void;
}

export const QueueWorkspace: React.FC<QueueWorkspaceProps> = ({
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
          Queue empty. Enqueue elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-2xl">
          {/* Header instructions */}
          <div className="text-center text-[10px] text-purple-400 font-black tracking-widest uppercase mb-6 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Drag elements to reorder • Double-click to edit</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>

          {/* Figma Auto-Layout Horizontal Queue pipeline */}
          <div className="w-full border-y-4 border-dashed border-purple-100/80 py-8 bg-purple-50/5 relative flex items-center justify-center min-h-[140px] px-6">
            <Reorder.Group
              axis="x"
              values={elements}
              onReorder={setElements}
              className="flex items-center gap-5 justify-center flex-wrap"
            >
              {elements.map((el, idx) => {
                const isFront = idx === 0;
                const isRear = idx === elements.length - 1;
                const isSelected = selectedId === el.id;

                return (
                  <Reorder.Item
                    key={el.id}
                    value={el}
                    className="relative cursor-grab active:cursor-grabbing"
                    whileDrag={{ scale: 1.08, zIndex: 10 }}
                  >
                    {/* Node Card Component */}
                    <NodeCard
                      id={el.id}
                      value={el.value}
                      isSelected={isSelected}
                      onSelect={() => onSelectNode(isSelected ? null : el.id)}
                      onEditValue={(newVal) => onEditValue?.(el.id, newVal)}
                    />
                    
                    {/* Index small tag */}
                    <span className="text-[8px] text-purple-400 font-mono absolute bottom-1 right-2 select-none">
                      [{idx}]
                    </span>

                    {/* Pointer Banners */}
                    {isFront && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase shadow-sm select-none">
                        Front
                      </div>
                    )}
                    {isRear && !isFront && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-indigo-400 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase shadow-sm select-none">
                        Rear
                      </div>
                    )}
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
