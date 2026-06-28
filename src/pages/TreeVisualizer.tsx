import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Info } from 'lucide-react';
import { VisualizerContainer } from '../components/VisualizerContainer';
import { Button } from '../components/Button';

interface TreeVisualizerProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onPlayToggle: (playing: boolean) => void;
  onSelectCode: (code: string) => void;
  onSelectComplexity: (info: any) => void;
}

interface TreeNode {
  value: number;
  x: number;
  y: number;
  leftValue?: number;
  rightValue?: number;
  id: string;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  speed,
  onSpeedChange,
  isPlaying,
  onPlayToggle,
  onSelectCode,
  onSelectComplexity,
}) => {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [currentNodeIdx, setCurrentNodeIdx] = useState(0);
  const [traversalQueue, setTraversalQueue] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs' | null>(null);
  const [nodeInputVal, setNodeInputVal] = useState<string>('');
  
  const timerRef = useRef<any>(null);

  const treeCode = `// Binary Search Tree (BST) DFS Traversal
function traverseDFS(node) {
  if (!node) return;
  
  highlight(node.value); // Process Root
  
  traverseDFS(node.left);  // Left Child
  traverseDFS(node.right); // Right Child
}`;

  const complexityInfo = {
    algorithmName: 'Binary Search Tree (BST)',
    timeBest: 'O(log n)',
    timeAverage: 'O(log n)',
    timeWorst: 'O(n)',
    spaceWorst: 'O(n)',
  };

  // Default BST layout
  const initializeDefaultTree = () => {
    onPlayToggle(false);
    setTraversalType(null);
    setActiveNode(null);
    setVisitedNodes([]);
    
    // Predetermined coordinates representing a balanced BST
    const initialNodes: TreeNode[] = [
      { id: '1', value: 50, x: 250, y: 50, leftValue: 30, rightValue: 70 },
      { id: '2', value: 30, x: 140, y: 130, leftValue: 20, rightValue: 40 },
      { id: '3', value: 70, x: 360, y: 130 },
      { id: '4', value: 20, x: 80, y: 210 },
      { id: '5', value: 40, x: 200, y: 210 },
    ];
    setNodes(initialNodes);
  };

  useEffect(() => {
    initializeDefaultTree();
    onSelectCode(treeCode);
    onSelectComplexity(complexityInfo);
  }, []);

  // Handle running DFS or BFS
  const startTraversal = (type: 'bfs' | 'dfs') => {
    onPlayToggle(false);
    setVisitedNodes([]);
    setActiveNode(null);
    setTraversalType(type);

    // Hardcode traversal sequences based on default BST
    let queue: number[] = [];
    if (type === 'bfs') {
      queue = [50, 30, 70, 20, 40]; // Level-order
    } else {
      queue = [50, 30, 20, 40, 70]; // Pre-order
    }

    // Adapt to custom additions if nodes list grew
    if (nodes.length > 5) {
      // Create a simplified traversal order for current nodes
      const customQueue = [...nodes].sort((a,b) => a.y - b.y).map(n => n.value);
      queue = customQueue;
    }

    setTraversalQueue(queue);
    setCurrentNodeIdx(0);
    onPlayToggle(true);
  };

  // Traversal loop
  useEffect(() => {
    if (isPlaying && traversalType) {
      const intervalMs = Math.max(300, 2000 / speed);
      timerRef.current = setInterval(() => {
        if (currentNodeIdx >= traversalQueue.length) {
          onPlayToggle(false);
          setActiveNode(null);
          return;
        }

        const nextVal = traversalQueue[currentNodeIdx];
        setActiveNode(nextVal);
        setVisitedNodes((prev) => [...prev, nextVal]);
        setCurrentNodeIdx((prev) => prev + 1);
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentNodeIdx, traversalQueue, traversalType, speed]);

  const handleAddNode = () => {
    const val = parseInt(nodeInputVal);
    if (isNaN(val) || val < 1 || val > 99) {
      alert('Please enter a value between 1 and 99');
      return;
    }
    
    // Check duplication
    if (nodes.some(n => n.value === val)) {
      alert('Node already exists!');
      return;
    }

    // Insert algorithm to find location
    let newX = 250;
    let newY = 50;
    let parentNode: TreeNode | null = null;
    let isLeft = false;

    // Simulate simple positioning relative to BST root
    const root = nodes.find(n => n.value === 50);
    if (root) {
      parentNode = root;
      if (val < 50) {
        // Left branch
        const leftChild = nodes.find(n => n.value === 30);
        if (leftChild) {
          parentNode = leftChild;
          if (val < 30) {
            const leftLeft = nodes.find(n => n.value === 20);
            if (leftLeft) {
              alert('Tree depth restricted to 3 for visual clarity!');
              return;
            } else {
              newX = 80;
              newY = 210;
              isLeft = true;
            }
          } else {
            const leftRight = nodes.find(n => n.value === 40);
            if (leftRight) {
              alert('Tree depth restricted to 3 for visual clarity!');
              return;
            } else {
              newX = 200;
              newY = 210;
              isLeft = false;
            }
          }
        } else {
          newX = 140;
          newY = 130;
          isLeft = true;
        }
      } else {
        // Right branch
        const rightChild = nodes.find(n => n.value === 70);
        if (rightChild) {
          parentNode = rightChild;
          if (val < 70) {
            newX = 290;
            newY = 210;
            isLeft = true;
          } else {
            newX = 430;
            newY = 210;
            isLeft = false;
          }
        } else {
          newX = 360;
          newY = 130;
          isLeft = false;
        }
      }
    }

    // Update parent link
    const updatedNodes = nodes.map(n => {
      if (parentNode && n.value === parentNode.value) {
        if (isLeft) return { ...n, leftValue: val };
        else return { ...n, rightValue: val };
      }
      return n;
    });

    const newNode: TreeNode = {
      id: Math.random().toString(),
      value: val,
      x: newX,
      y: newY,
    };

    setNodes([...updatedNodes, newNode]);
    setNodeInputVal('');
  };

  const handleReset = () => {
    initializeDefaultTree();
  };

  return (
    <VisualizerContainer
      title="Tree Structure Visualizer (Binary Search Tree)"
      isPlaying={isPlaying}
      onPlayToggle={() => onPlayToggle(!isPlaying)}
      onStepForward={currentNodeIdx < traversalQueue.length ? () => {
        const nextVal = traversalQueue[currentNodeIdx];
        setActiveNode(nextVal);
        setVisitedNodes((prev) => [...prev, nextVal]);
        setCurrentNodeIdx(currentNodeIdx + 1);
      } : undefined}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={onSpeedChange}
      controlsExtra={
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Node val"
            value={nodeInputVal}
            onChange={(e) => setNodeInputVal(e.target.value)}
            className="w-20 px-2 py-1 bg-zinc-950 border border-white/5 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-accent-blue"
          />
          <Button
            variant="secondary"
            onClick={handleAddNode}
            icon={<Plus className="w-3.5 h-3.5" />}
            className="px-3 py-1.5 rounded-lg"
          >
            Add Node
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-between w-full h-full p-4 gap-4">
        {/* Run Controls */}
        <div className="flex justify-center gap-2 z-20">
          <Button
            variant={traversalType === 'bfs' ? 'primary' : 'secondary'}
            onClick={() => startTraversal('bfs')}
            className="px-4 py-1.5 text-xs rounded-lg font-bold"
          >
            Run BFS
          </Button>
          <Button
            variant={traversalType === 'dfs' ? 'primary' : 'secondary'}
            onClick={() => startTraversal('dfs')}
            className="px-4 py-1.5 text-xs rounded-lg font-bold"
          >
            Run DFS
          </Button>
        </div>

        {/* Tree Canvas */}
        <div className="w-full max-w-lg h-64 bg-zinc-950/40 rounded-xl relative flex items-center justify-center">
          <svg className="w-full h-full select-none" viewBox="0 0 500 260">
            {/* Draw Links/Lines */}
            {nodes.map((node) => {
              const leftChild = node.leftValue ? nodes.find(n => n.value === node.leftValue) : null;
              const rightChild = node.rightValue ? nodes.find(n => n.value === node.rightValue) : null;
              
              return (
                <g key={`links-${node.value}`}>
                  {leftChild && (
                    <motion.line
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                      x1={node.x}
                      y1={node.y}
                      x2={leftChild.x}
                      y2={leftChild.y}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="2.5"
                    />
                  )}
                  {rightChild && (
                    <motion.line
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                      x1={node.x}
                      y1={node.y}
                      x2={rightChild.x}
                      y2={rightChild.y}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="2.5"
                    />
                  )}
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isActive = activeNode === node.value;
              const isVisited = visitedNodes.includes(node.value);

              let nodeColor = 'fill-[#121216] stroke-zinc-700';
              let textStyle = 'fill-zinc-300';
              let shadowClass = '';

              if (isActive) {
                nodeColor = 'fill-accent-blue/20 stroke-accent-blue';
                textStyle = 'fill-white font-bold';
                shadowClass = 'pulse-node';
              } else if (isVisited) {
                nodeColor = 'fill-accent-purple/20 stroke-accent-purple';
                textStyle = 'fill-purple-200';
              }

              return (
                <g key={`node-${node.value}`} className="cursor-pointer">
                  {/* Outer shadow aura */}
                  {(isActive || isVisited) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      className="fill-none stroke-none"
                      style={{
                        filter: 'drop-shadow(0px 0px 8px rgba(139, 92, 246, 0.4))',
                      }}
                    />
                  )}
                  
                  {/* Core circle */}
                  <motion.circle
                    layout
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    className={`${nodeColor} stroke-2 transition-all duration-300 ${shadowClass}`}
                  />
                  
                  {/* Inside Text */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    className={`${textStyle} text-xs font-mono select-none`}
                  >
                    {node.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Console step info */}
        <div className="text-zinc-500 font-mono text-[10px] text-center w-full max-w-sm border-t border-white/5 pt-2 flex items-center justify-center gap-1.5">
          <Info className="w-3 h-3 text-zinc-500" />
          <span>Active queue trace: [{visitedNodes.join(', ')}]</span>
        </div>
      </div>
    </VisualizerContainer>
  );
};
