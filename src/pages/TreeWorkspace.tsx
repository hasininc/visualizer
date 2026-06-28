import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

interface TreeWorkspaceProps {
  elements: DSNode[];
  setElements: React.Dispatch<React.SetStateAction<DSNode[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
}

export const TreeWorkspace: React.FC<TreeWorkspaceProps> = ({
  elements,
  setElements,
  selectedId,
  onSelectNode,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrag = (id: string, info: any) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          return {
            ...el,
            x: el.x + info.delta.x,
            y: el.y + info.delta.y,
          };
        }
        return el;
      })
    );
  };

  // Custom vector drawing for links between parent and child circles
  const renderLink = (child: DSNode) => {
    if (!child.parentId) return null;
    const parent = elements.find((n) => n.id === child.parentId);
    if (!parent) return null;

    const r = 20; // Node Circle Radius
    const dx = child.x - parent.x;
    const dy = child.y - parent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < r * 2.2) return null; // Hide if too close to avoid jitter

    const angle = Math.atan2(dy, dx);
    const x1 = parent.x + r * Math.cos(angle);
    const y1 = parent.y + r * Math.sin(angle);
    const x2 = child.x - r * Math.cos(angle);
    const y2 = child.y - r * Math.sin(angle);

    return (
      <line
        key={`link-${child.id}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#b19ffb"
        strokeWidth="2.5"
        strokeDasharray="4 4" // Dashed links look super cute and educational
        strokeLinecap="round"
      />
    );
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative p-4 gap-4 select-none">
      {/* Instructions header */}
      <div className="text-center text-[10px] text-purple-400 font-black tracking-widest uppercase z-10 px-6">
        Select a node in the tree to attach children. Drag nodes freely to customize layout!
      </div>

      <div
        ref={canvasRef}
        className="w-full h-[320px] bg-purple-50/5 rounded-3xl border border-purple-100/60 relative overflow-hidden flex items-center justify-center"
      >
        {/* SVG Links Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {elements.map((el) => renderLink(el))}
        </svg>

        {elements.length === 0 ? (
          <div className="text-purple-300 font-display font-medium text-sm select-none z-10">
            Tree empty. Add root node in the left panel!
          </div>
        ) : (
          /* Render Nodes absolutely */
          elements.map((el) => {
            const isSelected = selectedId === el.id;
            const isRoot = !el.parentId;
            
            return (
              <motion.div
                key={el.id}
                drag
                dragConstraints={canvasRef}
                dragElastic={0.05}
                dragMomentum={false}
                onDrag={(_, info) => handleDrag(el.id, info)}
                onClick={() => onSelectNode(isSelected ? null : el.id)}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1 }}
                style={{
                  position: 'absolute',
                  left: el.x - 20, // Center coordinate on (x, y)
                  top: el.y - 20,
                }}
                className={`
                  w-10 h-10 rounded-full border-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing font-bold text-xs font-display z-10 transition-shadow duration-150
                  ${
                    isSelected
                      ? 'bg-gradient-to-tr from-purple-200 to-indigo-200 border-purple-400 text-purple-950 shadow-md shadow-purple-500/10 active-glow'
                      : isRoot
                      ? 'bg-white border-indigo-300 text-indigo-800 shadow-sm'
                      : 'bg-white border-purple-200 text-purple-800 shadow-sm'
                  }
                `}
              >
                <span>{el.value}</span>
                <span className="text-[6px] text-purple-400 font-mono -mt-0.5 uppercase tracking-tighter">
                  {isRoot ? 'Root' : isSelected ? 'Sel' : ''}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
