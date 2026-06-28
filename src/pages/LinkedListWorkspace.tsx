import React, { useRef } from 'react';
import { motion } from 'framer-motion';

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
}

export const LinkedListWorkspace: React.FC<LinkedListWorkspaceProps> = ({
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

  // Custom vector drawing for links (stopping exactly at the circle boundary)
  const renderArrow = (node1: DSNode, node2: DSNode) => {
    const r = 24; // Node Circle Radius
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < r * 2.5) return null; // Too close, hide connection to prevent jitter

    const angle = Math.atan2(dy, dx);
    const x1 = node1.x + r * Math.cos(angle);
    const y1 = node1.y + r * Math.sin(angle);
    
    // Stop 8px before target boundary to fit the arrowhead cleanly
    const x2 = node2.x - (r + 8) * Math.cos(angle);
    const y2 = node2.y - (r + 8) * Math.sin(angle);

    return (
      <g key={`arrow-${node1.id}-${node2.id}`}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#b19ffb"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Draw vector pointer arrow head */}
        <polygon
          points={`
            ${x2 + 8 * Math.cos(angle)},${y2 + 8 * Math.sin(angle)}
            ${x2 - 8 * Math.cos(angle - Math.PI / 6)},${y2 - 8 * Math.sin(angle - Math.PI / 6)}
            ${x2 - 8 * Math.cos(angle + Math.PI / 6)},${y2 - 8 * Math.sin(angle + Math.PI / 6)}
          `}
          fill="#b19ffb"
        />
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative p-4 gap-4 select-none">
      {/* Instructions header */}
      <div className="text-center text-[10px] text-purple-400 font-black tracking-widest uppercase z-10">
        Drag nodes freely anywhere in 2D space. Links adjust automatically!
      </div>

      <div
        ref={canvasRef}
        className="w-full h-[320px] bg-purple-50/5 rounded-3xl border border-purple-100/60 relative overflow-hidden flex items-center justify-center"
      >
        {/* SVG Arrow Links Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {elements.map((el, idx) => {
            if (idx === elements.length - 1) return null;
            return renderArrow(el, elements[idx + 1]);
          })}
        </svg>

        {elements.length === 0 ? (
          <div className="text-purple-300 font-display font-medium text-sm select-none z-10">
            Linked List empty. Add nodes in the left panel!
          </div>
        ) : (
          /* Render Nodes Absolutely */
          elements.map((el, idx) => {
            const isSelected = selectedId === el.id;
            
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
                  left: el.x - 24, // Center coordinate on (x, y)
                  top: el.y - 24,
                }}
                className={`
                  w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing font-bold text-sm font-display z-10 transition-shadow duration-150
                  ${
                    isSelected
                      ? 'bg-gradient-to-tr from-purple-200 to-indigo-200 border-purple-400 text-purple-950 shadow-md shadow-purple-500/10 active-glow'
                      : 'bg-white border-purple-200 text-purple-800 shadow-sm'
                  }
                `}
              >
                <span>{el.value}</span>
                <span className="text-[7px] text-purple-400 font-mono -mt-0.5 uppercase">
                  {idx === 0 ? 'Head' : idx === elements.length - 1 ? 'Tail' : `n${idx}`}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
