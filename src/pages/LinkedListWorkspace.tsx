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

interface LinkedListWorkspaceProps {
  elements: DSNode[];
  setElements: React.Dispatch<React.SetStateAction<DSNode[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  onEditValue?: (id: string, newValue: string) => void;
  visualizationData?: {
    activeId: string | null;
    visitedIds: string[];
    description: string;
  } | null;
}

export const LinkedListWorkspace: React.FC<LinkedListWorkspaceProps> = ({
  elements,
  setElements,
  selectedId,
  onSelectNode,
  onEditValue,
  visualizationData,
}) => {
  const isVisualizing = !!visualizationData;

  return (
    <div className="flex flex-col items-center justify-start gap-4 w-full py-2">
      {elements.length === 0 ? (
        <div className="text-[var(--text-muted)] font-display font-medium text-sm select-none p-8 border border-dashed border-[var(--empty-border)] rounded-3xl transition-colors duration-300">
          Linked List empty. Add nodes in the left panel!
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <div className="text-center text-[10px] text-[var(--text-muted)] font-black tracking-widest uppercase mb-2 transition-colors duration-300">
            {isVisualizing
              ? 'Searching node in list... Interactivity paused.'
              : 'Drag nodes horizontally to reorder • Double-click to edit'}
          </div>

          {/* Auto-Layout Linked List Row Container */}
          <div className="w-full bg-[var(--canvas-bg)] rounded-3xl border border-[var(--canvas-border)] p-8 flex items-center justify-center min-h-[160px] shadow-inner transition-colors duration-300">
            {isVisualizing ? (
              /* Non-draggable horizontal layout for playback */
              <div className="flex items-center gap-4 justify-center flex-wrap">
                {elements.map((el, idx) => {
                  const isLast = idx === elements.length - 1;
                  const isActive = visualizationData.activeId === el.id;
                  const isVisited = visualizationData.visitedIds.includes(el.id);

                  let nodeClass = 'rounded-full';
                  if (isActive) {
                    nodeClass += ' ring-4 ring-purple-500 ring-offset-2 bg-purple-600 border-purple-700 text-white animate-pulse';
                  } else if (isVisited) {
                    nodeClass += ' bg-emerald-500 border-emerald-600 text-white shadow-sm';
                  }

                  return (
                    <motion.div
                      key={el.id}
                      layoutId={el.id}
                      className="flex items-center gap-4 select-none"
                    >
                      <div className="relative pb-3">
                        <NodeCard
                          value={el.value}
                          className={nodeClass}
                          onSelect={() => {}}
                        />
                        <span className="text-[7px] text-[var(--text-muted)] font-mono absolute bottom-0.5 left-1/2 -translate-x-1/2 uppercase tracking-tighter font-black select-none transition-colors duration-300">
                          {idx === 0 ? 'Head' : isLast ? 'Tail' : `n${idx}`}
                        </span>
                      </div>

                      {!isLast && (
                        <div className="flex items-center text-[var(--link-stroke)] pointer-events-none select-none transition-colors duration-300">
                          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Draggable workspace view */
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
                      <div className="relative pb-3">
                        <NodeCard
                          value={el.value}
                          isSelected={isSelected}
                          onSelect={() => onSelectNode(isSelected ? null : el.id)}
                          onEditValue={(newVal) => onEditValue?.(el.id, newVal)}
                          className="rounded-full"
                        />
                        <span className="text-[7px] text-[var(--text-muted)] font-mono absolute bottom-0.5 left-1/2 -translate-x-1/2 uppercase tracking-tighter font-black select-none transition-colors duration-300">
                          {idx === 0 ? 'Head' : isLast ? 'Tail' : `n${idx}`}
                        </span>
                      </div>

                      {!isLast && (
                        <div className="flex items-center text-[var(--link-stroke)] pointer-events-none select-none transition-colors duration-300">
                          <svg className="w-6 h-6 fill-current animate-pulse" viewBox="0 0 24 24">
                            <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
                          </svg>
                        </div>
                      )}
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
