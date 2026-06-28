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

interface LinkedListWorkspaceProps {
  elements: DSNode[];
  setElements: React.Dispatch<React.SetStateAction<DSNode[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  onEditValue?: (id: string, newValue: string) => void;
}

export const LinkedListWorkspace: React.FC<LinkedListWorkspaceProps> = ({
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
          Linked List empty. Add nodes in the left panel!
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <div className="text-center text-[10px] text-purple-400 font-black tracking-widest uppercase mb-4">
            Drag nodes horizontally to reorder • Double-click to edit
          </div>

          {/* Figma Auto-Layout Linked List Row */}
          <div className="w-full bg-purple-50/5 rounded-3xl border border-purple-100/60 p-8 flex items-center justify-center min-h-[160px]">
            <Reorder.Group
              axis="x"
              values={elements}
              onReorder={setElements}
              className="flex items-center gap-4 justify-center flex-wrap"
            >
              {elements.map((el, idx) => {
                const isLast = idx === elements.length - 1;
                const isSelected = selectedId === el.id;

                return (
                  <Reorder.Item
                    key={el.id}
                    value={el}
                    className="flex items-center gap-4 cursor-grab active:cursor-grabbing select-none"
                    whileDrag={{ scale: 1.05, zIndex: 10 }}
                  >
                    {/* Node Circle */}
                    <div className="relative pb-3">
                      <NodeCard
                        id={el.id}
                        value={el.value}
                        isSelected={isSelected}
                        onSelect={() => onSelectNode(isSelected ? null : el.id)}
                        onEditValue={(newVal) => onEditValue?.(el.id, newVal)}
                        className="rounded-full" // Circles for list nodes
                      />
                      
                      {/* Subtitle tag */}
                      <span className="text-[7px] text-purple-400 font-mono absolute bottom-0.5 left-1/2 -translate-x-1/2 uppercase tracking-tighter font-black select-none">
                        {idx === 0 ? 'Head' : isLast ? 'Tail' : `n${idx}`}
                      </span>
                    </div>

                    {/* Inline vector connector arrow */}
                    {!isLast && (
                      <div className="flex items-center text-purple-300 pointer-events-none select-none">
                        <svg className="w-6 h-6 fill-current animate-pulse" viewBox="0 0 24 24">
                          <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
                        </svg>
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
