import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NodeCard } from '../components/NodeCard';

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
  onEditValue?: (id: string, newValue: string) => void;
}

export const TreeWorkspace: React.FC<TreeWorkspaceProps> = ({
  elements,
  setElements,
  selectedId,
  onSelectNode,
  onEditValue,
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

  const autoLayoutTree = () => {
    if (elements.length === 0) return;
    const root = elements.find((n) => !n.parentId);
    if (!root) return;

    const positions = new Map<string, { x: number; y: number }>();
    const canvasWidth = 480;
    const levelHeight = 70;

    const traverse = (nodeId: string, depth: number, leftBound: number, rightBound: number) => {
      const node = elements.find((n) => n.id === nodeId);
      if (!node) return;

      const x = (leftBound + rightBound) / 2;
      const y = 50 + depth * levelHeight;
      positions.set(nodeId, { x, y });

      const children = elements.filter((n) => n.parentId === nodeId);
      if (children.length === 0) return;

      const segmentWidth = (rightBound - leftBound) / children.length;
      children.forEach((child, idx) => {
        const childLeft = leftBound + idx * segmentWidth;
        const childRight = childLeft + segmentWidth;
        traverse(child.id, depth + 1, childLeft, childRight);
      });
    };

    traverse(root.id, 0, 40, canvasWidth - 40);

    setElements((prev) =>
      prev.map((el) => {
        const pos = positions.get(el.id);
        if (pos) {
          return { ...el, x: pos.x, y: pos.y };
        }
        return el;
      })
    );
  };

  // Run layout once elements list size changes (Add or Delete events)
  useEffect(() => {
    autoLayoutTree();
  }, [elements.length]);

  const renderLink = (child: DSNode) => {
    if (!child.parentId) return null;
    const parent = elements.find((n) => n.id === child.parentId);
    if (!parent) return null;

    const r = 20; // Node Circle Radius
    const dx = child.x - parent.x;
    const dy = child.y - parent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < r * 2.2) return null;

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
        stroke="#4c258d"
        strokeWidth="2.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
    );
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative p-4 gap-4 select-none">
      <div className="text-center text-[10px] text-[#4c258d]/80 font-black tracking-widest uppercase z-10 px-6">
        Auto-spaces parent & children • Drag freely • Double-click to edit
      </div>

      <div
        ref={canvasRef}
        className="w-full h-[320px] bg-[#e3dcf7]/30 rounded-3xl border border-[#a38deb]/50 relative overflow-hidden flex items-center justify-center shadow-inner"
      >
        {/* SVG Links Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {elements.map((el) => renderLink(el))}
        </svg>

        {elements.length === 0 ? (
          <div className="text-[#4c258d]/70 font-display font-medium text-sm select-none z-10">
            Tree empty. Add root node in the left panel!
          </div>
        ) : (
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
                animate={{
                  x: el.x - 20, // Center coordinate on (x, y)
                  y: el.y - 20,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                }}
                className="z-10"
              >
                {/* Reusable Double-click Node Card */}
                <NodeCard
                  value={el.value}
                  isSelected={isSelected}
                  onSelect={() => onSelectNode(isSelected ? null : el.id)}
                  onEditValue={(newVal) => onEditValue?.(el.id, newVal)}
                  size="sm"
                  className="rounded-full"
                />
                
                {/* Small indicator tag */}
                <span className="text-[6px] text-[#4c258d] font-mono absolute -bottom-3 left-1/2 -translate-x-1/2 uppercase tracking-tighter select-none font-bold">
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
