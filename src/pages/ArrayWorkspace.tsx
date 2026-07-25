import React from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { NodeCard } from '../components/NodeCard';

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

export interface VisualizationData {
  compared: number[];
  swapped: number[];
  sorted: number[];
  arrayState?: (string | number)[];
  elementIds?: string[];
  pivotIdx?: number;
  minIdx?: number;
  keyIdx?: number;
  description?: string;
}

interface ArrayWorkspaceProps {
  elements: DSNode[];
  setElements: React.Dispatch<React.SetStateAction<DSNode[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
  onEditValue?: (id: string, newValue: string) => void;
  visualizationData?: VisualizationData | null;
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

  const visualItems = React.useMemo(() => {
    if (!isVisualizing || !visualizationData) return [];
    if (visualizationData.elementIds && visualizationData.elementIds.length === elements.length) {
      return visualizationData.elementIds.map((id, currentIdx) => {
        const origNode = elements.find((e) => e.id === id);
        const val =
          visualizationData.arrayState && visualizationData.arrayState[currentIdx] !== undefined
            ? String(visualizationData.arrayState[currentIdx])
            : origNode
            ? origNode.value
            : '';
        return {
          id,
          value: val,
          currentIdx,
        };
      });
    }
    return elements.map((el, currentIdx) => ({
      id: el.id,
      value:
        visualizationData.arrayState && visualizationData.arrayState[currentIdx] !== undefined
          ? String(visualizationData.arrayState[currentIdx])
          : el.value,
      currentIdx,
    }));
  }, [isVisualizing, visualizationData, elements]);

  return (
    <div className="flex flex-col items-center justify-start gap-4 w-full py-2">
      {elements.length === 0 ? (
        <div className="text-[var(--text-muted)] font-display font-medium text-sm select-none p-8 border border-dashed border-[var(--empty-border)] rounded-3xl transition-colors duration-300">
          Array empty. Add elements in the left panel!
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <div className="text-center text-[10px] text-[var(--text-muted)] font-black tracking-widest uppercase mb-2 transition-colors duration-300">
            {isVisualizing
              ? 'Sorting algorithm in progress... Interactivity paused.'
              : 'Drag elements horizontally to reorder • Double-click to edit value'}
          </div>

          {isVisualizing ? (
            /* Non-draggable flex view for visualization steps with 3D up/down motion */
            <div className="flex items-center gap-6 justify-center flex-wrap min-h-[180px] px-6 pt-12 pb-6 relative select-none">
              <AnimatePresence mode="sync">
                {visualItems.map((item) => {
                  const idx = item.currentIdx;
                  const isCompared = visualizationData?.compared?.includes(idx) ?? false;
                  const isSwapped = visualizationData?.swapped?.includes(idx) ?? false;
                  const isSorted = visualizationData?.sorted?.includes(idx) ?? false;
                  const isPivot = visualizationData?.pivotIdx === idx;
                  const isMin = visualizationData?.minIdx === idx;
                  const isKey = visualizationData?.keyIdx === idx;

                  // Determine vertical offset, scale, zIndex, and badge text/styling
                  let yOffset = 0;
                  let scaleVal = 1;
                  let zIndexVal = 1;
                  let badgeText = '';
                  let badgeColor = '';
                  let cardClass = '';

                  if (isSwapped) {
                    const swapOrderIndex = visualizationData?.swapped.indexOf(idx) ?? 0;
                    // First swapped box lifts UP (-38px), second box shifts DOWN (28px) for 3D crossover effect
                    yOffset = swapOrderIndex === 0 ? -38 : 28;
                    scaleVal = 1.14;
                    zIndexVal = 40;
                    badgeText = 'SWAP ⇄';
                    badgeColor =
                      'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/40 ring-2 ring-rose-300';
                    cardClass =
                      'ring-4 ring-rose-500 ring-offset-2 bg-gradient-to-br from-rose-500 to-pink-600 text-white border-rose-600 shadow-2xl shadow-rose-500/40 font-black';
                  } else if (isKey) {
                    yOffset = -46;
                    scaleVal = 1.16;
                    zIndexVal = 50;
                    badgeText = 'KEY ⬇';
                    badgeColor =
                      'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/40 ring-2 ring-cyan-200';
                    cardClass =
                      'ring-4 ring-cyan-400 ring-offset-2 bg-gradient-to-br from-cyan-400 to-blue-600 text-white border-cyan-500 shadow-2xl shadow-cyan-500/40 font-black';
                  } else if (isPivot) {
                    yOffset = -32;
                    scaleVal = 1.1;
                    zIndexVal = 30;
                    badgeText = 'PIVOT 🎯';
                    badgeColor =
                      'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/40 ring-2 ring-purple-300';
                    cardClass =
                      'ring-4 ring-purple-500 ring-offset-2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-600 shadow-xl shadow-purple-500/30 font-black';
                  } else if (isMin) {
                    yOffset = -26;
                    scaleVal = 1.08;
                    zIndexVal = 25;
                    badgeText = 'MIN 📍';
                    badgeColor =
                      'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-500/40 ring-2 ring-teal-200';
                    cardClass =
                      'ring-4 ring-teal-400 ring-offset-2 bg-gradient-to-br from-teal-400 to-emerald-600 text-white border-teal-500 shadow-xl shadow-teal-500/30 font-black';
                  } else if (isCompared) {
                    yOffset = -16;
                    scaleVal = 1.06;
                    zIndexVal = 20;
                    badgeText = 'COMPARE 🔍';
                    badgeColor =
                      'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-amber-500/30 ring-2 ring-amber-200 font-bold';
                    cardClass =
                      'ring-4 ring-amber-400 ring-offset-2 bg-gradient-to-br from-amber-400 to-amber-500 border-amber-600 text-amber-950 shadow-lg shadow-amber-500/20 font-bold';
                  } else if (isSorted) {
                    yOffset = 0;
                    scaleVal = 1.0;
                    zIndexVal = 1;
                    badgeText = 'SORTED ✓';
                    badgeColor =
                      'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30 font-bold';
                    cardClass =
                      'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-600 text-white font-extrabold shadow-md pointer-events-none';
                  }

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{
                        scale: scaleVal,
                        opacity: 1,
                        y: yOffset,
                        zIndex: zIndexVal,
                      }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        layout: { type: 'spring', stiffness: 350, damping: 25, mass: 0.8 },
                        y: { type: 'spring', stiffness: 380, damping: 22 },
                        scale: { type: 'spring', stiffness: 300, damping: 25 },
                      }}
                      className="flex flex-col items-center gap-1.5 relative"
                      style={{ zIndex: zIndexVal }}
                    >
                      {/* Live Action Badge */}
                      <AnimatePresence>
                        {badgeText && (
                          <motion.span
                            initial={{ opacity: 0, y: 6, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute -top-7 text-[9px] px-2 py-0.5 rounded-full font-black tracking-wider uppercase shadow-md whitespace-nowrap z-50 ${badgeColor}`}
                          >
                            {badgeText}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <span className="text-[10px] font-bold font-mono text-[var(--text-muted)] select-none transition-colors duration-300">
                        Index {idx}
                      </span>
                      <NodeCard
                        value={item.value}
                        className={cardClass}
                        onSelect={() => {}}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
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
                    <span className="text-[10px] font-bold font-mono text-[var(--text-muted)] select-none transition-colors duration-300">
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

