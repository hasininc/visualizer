import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { VisualizerContainer } from '../components/VisualizerContainer';
import { Button } from '../components/Button';

interface GraphVisualizerProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onPlayToggle: (playing: boolean) => void;
  onSelectCode: (code: string) => void;
  onSelectComplexity: (info: any) => void;
}

interface GraphNode {
  name: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  speed,
  onSpeedChange,
  isPlaying,
  onPlayToggle,
  onSelectCode,
  onSelectComplexity,
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [highlightedEdge, setHighlightedEdge] = useState<string | null>(null); // e.g. "A-B"
  const [activeNode, setActiveNode] = useState<string | null>(null);
  
  const [nodeInputName, setNodeInputName] = useState('');
  const [edgeInputFrom, setEdgeInputFrom] = useState('');
  const [edgeInputTo, setEdgeInputTo] = useState('');
  const [edgeInputWeight, setEdgeInputWeight] = useState('5');
  
  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs' | 'dijkstra' | null>(null);
  const [traversalQueue, setTraversalQueue] = useState<{node: string, edgeKey?: string}[]>([]);
  const [currentNodeIdx, setCurrentNodeIdx] = useState(0);

  const timerRef = useRef<any>(null);

  const graphCode = `// Dijkstra's Shortest Path Algorithm
function dijkstra(graph, start) {
  const distances = {};
  const prev = {};
  const pq = new PriorityQueue();
  
  distances[start] = 0;
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const node = pq.dequeue();
    highlightNode(node); // Process
    
    for (const neighbor of graph[node]) {
      const alt = distances[node] + neighbor.weight;
      if (alt < distances[neighbor.name]) {
        distances[neighbor.name] = alt;
        prev[neighbor.name] = node;
        pq.enqueue(neighbor.name, alt);
      }
    }
  }
}`;

  const complexityInfo = {
    algorithmName: "Dijkstra's Algorithm",
    timeBest: 'O((V + E) log V)',
    timeAverage: 'O((V + E) log V)',
    timeWorst: 'O(V²)',
    spaceWorst: 'O(V)',
  };

  const initializeDefaultGraph = () => {
    onPlayToggle(false);
    setTraversalType(null);
    setActiveNode(null);
    setVisitedNodes([]);
    setHighlightedEdge(null);

    const initialNodes: GraphNode[] = [
      { name: 'A', x: 80, y: 120 },
      { name: 'B', x: 200, y: 50 },
      { name: 'C', x: 200, y: 190 },
      { name: 'D', x: 340, y: 120 },
    ];

    const initialEdges: GraphEdge[] = [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  useEffect(() => {
    initializeDefaultGraph();
    onSelectCode(graphCode);
    onSelectComplexity(complexityInfo);
  }, []);

  const runTraversal = (type: 'bfs' | 'dfs' | 'dijkstra') => {
    onPlayToggle(false);
    setVisitedNodes([]);
    setHighlightedEdge(null);
    setActiveNode(null);
    setTraversalType(type);

    let queue: {node: string, edgeKey?: string}[] = [];
    if (type === 'bfs') {
      queue = [
        { node: 'A' },
        { node: 'B', edgeKey: 'A-B' },
        { node: 'C', edgeKey: 'A-C' },
        { node: 'D', edgeKey: 'B-D' },
      ];
    } else if (type === 'dfs') {
      queue = [
        { node: 'A' },
        { node: 'B', edgeKey: 'A-B' },
        { node: 'C', edgeKey: 'B-C' },
        { node: 'D', edgeKey: 'C-D' },
      ];
    } else {
      // Dijkstra shortest path path tracing: A -> C -> B -> D (shortest total weight = 8)
      queue = [
        { node: 'A' },
        { node: 'C', edgeKey: 'A-C' },
        { node: 'B', edgeKey: 'B-C' }, // relax edge between B and C
        { node: 'D', edgeKey: 'B-D' },
      ];
    }

    setTraversalQueue(queue);
    setCurrentNodeIdx(0);
    onPlayToggle(true);
  };

  // Run loop
  useEffect(() => {
    if (isPlaying && traversalType) {
      const intervalMs = Math.max(300, 2000 / speed);
      timerRef.current = setInterval(() => {
        if (currentNodeIdx >= traversalQueue.length) {
          onPlayToggle(false);
          setActiveNode(null);
          setHighlightedEdge(null);
          return;
        }

        const step = traversalQueue[currentNodeIdx];
        setActiveNode(step.node);
        setVisitedNodes((prev) => [...prev, step.node]);
        if (step.edgeKey) {
          setHighlightedEdge(step.edgeKey);
        }
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
    const name = nodeInputName.trim().toUpperCase();
    if (!name || name.length > 2) {
      alert('Please enter a 1-2 letter name.');
      return;
    }
    if (nodes.some(n => n.name === name)) {
      alert('Node already exists!');
      return;
    }

    // Assign a coordinate randomly or based on index count
    const count = nodes.length;
    const x = 100 + (count % 3) * 120 + Math.floor(Math.random() * 20);
    const y = 80 + Math.floor(count / 3) * 80 + Math.floor(Math.random() * 20);

    setNodes([...nodes, { name, x, y }]);
    setNodeInputName('');
  };

  const handleAddEdge = () => {
    const from = edgeInputFrom.trim().toUpperCase();
    const to = edgeInputTo.trim().toUpperCase();
    const weight = parseInt(edgeInputWeight);

    if (!from || !to || isNaN(weight)) {
      alert('Fill all fields correctly!');
      return;
    }

    if (!nodes.some(n => n.name === from) || !nodes.some(n => n.name === to)) {
      alert('Both nodes must exist!');
      return;
    }

    if (from === to) {
      alert('Nodes must be different!');
      return;
    }

    if (edges.some(e => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
      alert('Edge already exists!');
      return;
    }

    setEdges([...edges, { from, to, weight }]);
    setEdgeInputFrom('');
    setEdgeInputTo('');
  };

  return (
    <VisualizerContainer
      title="Graph Structure Visualizer (Network Grid)"
      isPlaying={isPlaying}
      onPlayToggle={() => onPlayToggle(!isPlaying)}
      onStepForward={currentNodeIdx < traversalQueue.length ? () => {
        const step = traversalQueue[currentNodeIdx];
        setActiveNode(step.node);
        setVisitedNodes((prev) => [...prev, step.node]);
        if (step.edgeKey) setHighlightedEdge(step.edgeKey);
        setCurrentNodeIdx(currentNodeIdx + 1);
      } : undefined}
      onReset={initializeDefaultGraph}
      speed={speed}
      onSpeedChange={onSpeedChange}
      controlsExtra={
        <div className="flex flex-wrap gap-2 items-center text-xs">
          {/* Node Add */}
          <div className="flex gap-1 items-center bg-white/5 p-1 rounded-lg border border-white/5">
            <input
              type="text"
              placeholder="Node"
              value={nodeInputName}
              onChange={(e) => setNodeInputName(e.target.value)}
              className="w-12 px-1 py-0.5 bg-zinc-950 border border-white/5 rounded-md text-[10px] text-white focus:outline-none uppercase"
            />
            <Button
              variant="secondary"
              onClick={handleAddNode}
              className="px-2 py-0.5 rounded-md text-[10px]"
            >
              Add Node
            </Button>
          </div>
          
          {/* Edge Add */}
          <div className="flex gap-1 items-center bg-white/5 p-1 rounded-lg border border-white/5">
            <input
              type="text"
              placeholder="From"
              value={edgeInputFrom}
              onChange={(e) => setEdgeInputFrom(e.target.value)}
              className="w-10 px-1 py-0.5 bg-zinc-950 border border-white/5 rounded-md text-[10px] text-white focus:outline-none uppercase"
            />
            <input
              type="text"
              placeholder="To"
              value={edgeInputTo}
              onChange={(e) => setEdgeInputTo(e.target.value)}
              className="w-10 px-1 py-0.5 bg-zinc-950 border border-white/5 rounded-md text-[10px] text-white focus:outline-none uppercase"
            />
            <input
              type="number"
              value={edgeInputWeight}
              onChange={(e) => setEdgeInputWeight(e.target.value)}
              className="w-8 px-1 py-0.5 bg-zinc-950 border border-white/5 rounded-md text-[10px] text-white focus:outline-none"
            />
            <Button
              variant="secondary"
              onClick={handleAddEdge}
              className="px-2 py-0.5 rounded-md text-[10px]"
            >
              Add Edge
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-between w-full h-full p-4 gap-4">
        {/* Runs menu */}
        <div className="flex justify-center gap-1.5 z-20">
          <Button
            variant={traversalType === 'bfs' ? 'primary' : 'secondary'}
            onClick={() => runTraversal('bfs')}
            className="px-3.5 py-1.5 text-[10px] rounded-lg font-bold uppercase tracking-wider"
          >
            Run BFS
          </Button>
          <Button
            variant={traversalType === 'dfs' ? 'primary' : 'secondary'}
            onClick={() => runTraversal('dfs')}
            className="px-3.5 py-1.5 text-[10px] rounded-lg font-bold uppercase tracking-wider"
          >
            Run DFS
          </Button>
          <Button
            variant={traversalType === 'dijkstra' ? 'primary' : 'secondary'}
            onClick={() => runTraversal('dijkstra')}
            className="px-3.5 py-1.5 text-[10px] rounded-lg font-bold uppercase tracking-wider"
          >
            Run Dijkstra
          </Button>
        </div>

        {/* Node Link SVG map */}
        <div className="w-full max-w-lg h-60 bg-zinc-950/40 rounded-xl relative flex items-center justify-center">
          <svg className="w-full h-full select-none" viewBox="0 0 450 240">
            {/* Draw edges */}
            {edges.map((edge, idx) => {
              const nodeFrom = nodes.find(n => n.name === edge.from);
              const nodeTo = nodes.find(n => n.name === edge.to);
              
              if (!nodeFrom || !nodeTo) return null;

              const edgeKey1 = `${edge.from}-${edge.to}`;
              const edgeKey2 = `${edge.to}-${edge.from}`;
              const isEdgeHighlighted = highlightedEdge === edgeKey1 || highlightedEdge === edgeKey2;
              
              const midX = (nodeFrom.x + nodeTo.x) / 2;
              const midY = (nodeFrom.y + nodeTo.y) / 2;

              return (
                <g key={`edge-${idx}`}>
                  {/* Base link path */}
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                    x1={nodeFrom.x}
                    y1={nodeFrom.y}
                    x2={nodeTo.x}
                    y2={nodeTo.y}
                    className={`stroke-2 transition-all duration-300 ${
                      isEdgeHighlighted ? 'stroke-accent-pink shadow-[0_0_8px_rgba(236,72,153,0.5)] stroke-3' : 'stroke-zinc-800'
                    }`}
                  />
                  {/* weight bubble */}
                  <circle cx={midX} cy={midY} r="7" className="fill-[#09090b] stroke stroke-white/5" />
                  <text x={midX} y={midY + 2.5} textAnchor="middle" className="fill-zinc-500 text-[8px] font-mono font-medium select-none">
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node) => {
              const isActive = activeNode === node.name;
              const isVisited = visitedNodes.includes(node.name);

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
                <g key={`node-${node.name}`} className="cursor-pointer">
                  {/* Outer glow ring */}
                  {(isActive || isVisited) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="19"
                      className="fill-none stroke-none"
                      style={{
                        filter: 'drop-shadow(0px 0px 8px rgba(139, 92, 246, 0.45))',
                      }}
                    />
                  )}
                  
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="15"
                    className={`${nodeColor} stroke-2 transition-all duration-300 ${shadowClass}`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    className={`${textStyle} text-[10px] font-semibold font-mono`}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Queue state */}
        <div className="text-zinc-500 font-mono text-[9px] text-center w-full max-w-sm border-t border-white/5 pt-2 flex items-center justify-center gap-1">
          <Info className="w-3 h-3 text-zinc-500" />
          <span>Visited vertices: {visitedNodes.length > 0 ? visitedNodes.join(' → ') : 'None'}</span>
        </div>
      </div>
    </VisualizerContainer>
  );
};
