import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash, Search, ArrowRight } from 'lucide-react';
import { VisualizerContainer } from '../components/VisualizerContainer';
import { Button } from '../components/Button';

interface LinearDSVisualizerProps {
  type: 'arrays' | 'linkedlist' | 'stack' | 'queue' | 'searching';
  speed: number;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onPlayToggle: (playing: boolean) => void;
  onSelectCode: (code: string) => void;
  onSelectComplexity: (info: any) => void;
}

export const LinearDSVisualizer: React.FC<LinearDSVisualizerProps> = ({
  type,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayToggle,
  onSelectCode,
  onSelectComplexity,
}) => {
  const [elements, setElements] = useState<number[]>([10, 20, 30, 40, 50]);
  const [highlightIdxs, setHighlightIdxs] = useState<number[]>([]);
  const [actionLabel, setActionLabel] = useState<string>('Ready.');
  const [inputVal, setInputVal] = useState<string>('');
  
  // Searching specific state
  const [searchTarget, setSearchTarget] = useState<number>(30);
  const [searchLeft, setSearchLeft] = useState<number | null>(null);
  const [searchRight, setSearchRight] = useState<number | null>(null);
  const [searchMid, setSearchMid] = useState<number | null>(null);
  
  const timerRef = useRef<any>(null);

  const getDSExtraData = () => {
    switch (type) {
      case 'arrays':
        return {
          code: `// Array Insertion At Index
function insert(arr, element, index) {
  for (let i = arr.length; i > index; i--) {
    arr[i] = arr[i - 1]; // Shift right
  }
  arr[index] = element;
  return arr;
}`,
          complexity: {
            algorithmName: 'Array Data Structure',
            timeBest: 'O(1) Access',
            timeAverage: 'O(n) Insertion/Deletion',
            timeWorst: 'O(n) Searching',
            spaceWorst: 'O(n)',
          }
        };
      case 'linkedlist':
        return {
          code: `// Singly Linked List Node Insertion
function insertNode(head, value) {
  const newNode = new Node(value);
  if (!head) return newNode;
  
  let curr = head;
  while (curr.next) {
    curr = curr.next;
  }
  curr.next = newNode;
  return head;
}`,
          complexity: {
            algorithmName: 'Singly Linked List',
            timeBest: 'O(1) Insert/Delete (Ends)',
            timeAverage: 'O(n) Search/Traversal',
            timeWorst: 'O(n) Access',
            spaceWorst: 'O(n)',
          }
        };
      case 'stack':
        return {
          code: `// Stack Push (LIFO)
class Stack {
  push(element) {
    this.items.push(element); // Insert at top
  }
  pop() {
    if (this.isEmpty()) return "Underflow";
    return this.items.pop(); // Remove from top
  }
}`,
          complexity: {
            algorithmName: 'Stack (LIFO)',
            timeBest: 'O(1) Push',
            timeAverage: 'O(1) Pop',
            timeWorst: 'O(1) Peek',
            spaceWorst: 'O(n)',
          }
        };
      case 'queue':
        return {
          code: `// Queue Enqueue (FIFO)
class Queue {
  enqueue(element) {
    this.items.push(element); // Insert at rear
  }
  dequeue() {
    if (this.isEmpty()) return "Underflow";
    return this.items.shift(); // Remove from front
  }
}`,
          complexity: {
            algorithmName: 'Queue (FIFO)',
            timeBest: 'O(1) Enqueue',
            timeAverage: 'O(1) Dequeue',
            timeWorst: 'O(1) Peek',
            spaceWorst: 'O(n)',
          }
        };
      case 'searching':
      default:
        return {
          code: `// Binary Search Algorithm (Iterative)
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
          complexity: {
            algorithmName: 'Binary Search',
            timeBest: 'O(1)',
            timeAverage: 'O(log n)',
            timeWorst: 'O(log n)',
            spaceWorst: 'O(1)',
          }
        };
    }
  };

  useEffect(() => {
    onPlayToggle(false);
    setHighlightIdxs([]);
    setActionLabel('Ready.');
    
    if (type === 'searching') {
      setElements([10, 20, 30, 40, 50, 60, 70, 80]);
      setSearchLeft(null);
      setSearchRight(null);
      setSearchMid(null);
    } else {
      setElements([10, 20, 30, 40, 50]);
    }

    const info = getDSExtraData();
    onSelectCode(info.code);
    onSelectComplexity(info.complexity);
  }, [type]);

  const handleReset = () => {
    onPlayToggle(false);
    setHighlightIdxs([]);
    setActionLabel('Reset to default values.');
    
    if (type === 'searching') {
      setElements([10, 20, 30, 40, 50, 60, 70, 80]);
      setSearchLeft(null);
      setSearchRight(null);
      setSearchMid(null);
    } else {
      setElements([10, 20, 30, 40, 50]);
    }
  };

  // Stack Push / Pop
  const handlePush = () => {
    const val = inputVal ? parseInt(inputVal) : Math.floor(Math.random() * 89) + 10;
    if (elements.length >= 7) {
      alert('Visualizer size limit reached!');
      return;
    }
    setElements([...elements, val]);
    setInputVal('');
    setActionLabel(`Pushed value ${val} to stack.`);
  };

  const handlePop = () => {
    if (elements.length === 0) {
      alert('Stack underflow!');
      return;
    }
    const popped = elements[elements.length - 1];
    setElements(elements.slice(0, -1));
    setActionLabel(`Popped value ${popped} from stack.`);
  };

  // Queue Enqueue / Dequeue
  const handleEnqueue = () => {
    const val = inputVal ? parseInt(inputVal) : Math.floor(Math.random() * 89) + 10;
    if (elements.length >= 7) {
      alert('Visualizer size limit reached!');
      return;
    }
    setElements([...elements, val]);
    setInputVal('');
    setActionLabel(`Enqueued value ${val} at rear.`);
  };

  const handleDequeue = () => {
    if (elements.length === 0) {
      alert('Queue underflow!');
      return;
    }
    const dequeued = elements[0];
    setElements(elements.slice(1));
    setActionLabel(`Dequeued value ${dequeued} from front.`);
  };

  // Array insert / delete
  const handleInsertArray = () => {
    const val = inputVal ? parseInt(inputVal) : Math.floor(Math.random() * 89) + 10;
    if (elements.length >= 8) {
      alert('Visualizer size limit reached!');
      return;
    }
    setElements([...elements, val]);
    setInputVal('');
    setActionLabel(`Inserted ${val} at index ${elements.length}.`);
  };

  const handleDeleteArray = () => {
    if (elements.length === 0) return;
    const removed = elements[elements.length - 1];
    setElements(elements.slice(0, -1));
    setActionLabel(`Deleted ${removed} from index ${elements.length - 1}.`);
  };

  // Binary Search Step play
  const triggerBinarySearch = () => {
    onPlayToggle(false);
    setSearchLeft(0);
    setSearchRight(elements.length - 1);
    setSearchMid(Math.floor((0 + elements.length - 1) / 2));
    setHighlightIdxs([]);
    onPlayToggle(true);
    setActionLabel(`Searching for target ${searchTarget}. Initialized binary search borders [Low=0, High=${elements.length - 1}].`);
  };

  useEffect(() => {
    if (isPlaying && type === 'searching') {
      const intervalMs = Math.max(400, 2000 / speed);
      timerRef.current = setInterval(() => {
        if (searchLeft === null || searchRight === null) return;
        
        if (searchLeft > searchRight) {
          onPlayToggle(false);
          setActionLabel(`Target ${searchTarget} not found in array! Search terminated.`);
          setSearchLeft(null);
          setSearchRight(null);
          setSearchMid(null);
          return;
        }

        const mid = Math.floor((searchLeft + searchRight) / 2);
        setSearchMid(mid);
        const midVal = elements[mid];

        if (midVal === searchTarget) {
          setHighlightIdxs([mid]);
          onPlayToggle(false);
          setActionLabel(`Target ${searchTarget} found at index ${mid}!`);
          setSearchLeft(null);
          setSearchRight(null);
          setSearchMid(null);
        } else if (midVal < searchTarget) {
          setSearchLeft(mid + 1);
          setActionLabel(`${midVal} < ${searchTarget}. Shifting search interval to right [Low=${mid + 1}, High=${searchRight}].`);
        } else {
          setSearchRight(mid - 1);
          setActionLabel(`${midVal} > ${searchTarget}. Shifting search interval to left [Low=${searchLeft}, High=${mid - 1}].`);
        }
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, searchLeft, searchRight, searchTarget, elements, speed]);

  return (
    <VisualizerContainer
      title={`${type.toUpperCase()} Interactive Workspace`}
      isPlaying={isPlaying}
      onPlayToggle={type === 'searching' ? () => {
        if (!isPlaying) triggerBinarySearch();
        else onPlayToggle(false);
      } : () => {}}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={onSpeedChange}
      controlsExtra={
        <div className="flex gap-2 items-center text-xs">
          {type !== 'searching' && (
            <input
              type="number"
              placeholder="Value"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-16 px-2 py-1 bg-zinc-950 border border-white/5 rounded-lg text-xs font-mono text-white focus:outline-none"
            />
          )}

          {/* Conditional CRUD Buttons based on type */}
          {type === 'arrays' && (
            <>
              <Button variant="secondary" onClick={handleInsertArray} icon={<Plus className="w-3 h-3 text-accent-blue" />} className="px-2 py-1 text-xs">
                Insert
              </Button>
              <Button variant="secondary" onClick={handleDeleteArray} icon={<Trash className="w-3 h-3 text-accent-pink" />} className="px-2 py-1 text-xs">
                Delete
              </Button>
            </>
          )}

          {type === 'linkedlist' && (
            <>
              <Button variant="secondary" onClick={handleInsertArray} icon={<Plus className="w-3 h-3 text-accent-blue" />} className="px-2 py-1 text-xs">
                Add Node
              </Button>
              <Button variant="secondary" onClick={handleDeleteArray} icon={<Trash className="w-3 h-3 text-accent-pink" />} className="px-2 py-1 text-xs">
                Remove Node
              </Button>
            </>
          )}

          {type === 'stack' && (
            <>
              <Button variant="secondary" onClick={handlePush} icon={<Plus className="w-3 h-3 text-accent-blue" />} className="px-2 py-1 text-xs">
                Push
              </Button>
              <Button variant="secondary" onClick={handlePop} icon={<Trash className="w-3 h-3 text-accent-pink" />} className="px-2 py-1 text-xs">
                Pop
              </Button>
            </>
          )}

          {type === 'queue' && (
            <>
              <Button variant="secondary" onClick={handleEnqueue} icon={<Plus className="w-3 h-3 text-accent-blue" />} className="px-2 py-1 text-xs">
                Enqueue
              </Button>
              <Button variant="secondary" onClick={handleDequeue} icon={<Trash className="w-3 h-3 text-accent-pink" />} className="px-2 py-1 text-xs">
                Dequeue
              </Button>
            </>
          )}

          {type === 'searching' && (
            <div className="flex gap-1.5 items-center">
              <input
                type="number"
                placeholder="Target"
                value={searchTarget}
                onChange={(e) => setSearchTarget(parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 bg-zinc-950 border border-white/5 rounded-lg text-xs font-mono text-white focus:outline-none"
              />
              <Button variant="secondary" onClick={triggerBinarySearch} icon={<Search className="w-3 h-3 text-accent-blue" />} className="px-2 py-1 text-xs">
                Search
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-6 items-center w-full h-full p-6 justify-between select-none">
        {/* Banner */}
        <div className="w-full text-center px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-zinc-300 font-medium max-w-xl shadow-sm">
          {actionLabel}
        </div>

        {/* Dynamic Layout canvas depending on category type */}
        <div className="flex-1 w-full flex items-center justify-center min-h-[180px]">
          {/* ARRAY TYPE */}
          {type === 'arrays' && (
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <AnimatePresence>
                {elements.map((el, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-14 h-14 bg-zinc-900 border border-white/10 text-white rounded-xl flex items-center justify-center font-bold text-lg font-mono hover:border-accent-blue/50 transition-colors shadow-lg">
                      {el}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono mt-1">idx: {idx}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* LINKED LIST TYPE */}
          {type === 'linkedlist' && (
            <div className="flex flex-wrap gap-2.5 items-center justify-center">
              <AnimatePresence>
                {elements.map((el, idx) => (
                  <React.Fragment key={idx}>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="flex border border-white/10 rounded-xl bg-zinc-900 overflow-hidden shadow-lg">
                        <div className="w-12 h-12 flex items-center justify-center font-bold text-base font-mono text-white">
                          {el}
                        </div>
                        <div className="w-6 h-12 border-l border-white/10 bg-zinc-950 flex items-center justify-center text-[10px] text-accent-purple font-mono">
                          ptr
                        </div>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono mt-1">node {idx}</span>
                    </motion.div>
                    {idx < elements.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-accent-blue flex-shrink-0 animate-pulse" />
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* STACK TYPE */}
          {type === 'stack' && (
            <div className="relative w-40 h-[210px] border-x-2 border-b-2 border-zinc-700/60 rounded-b-xl flex flex-col justify-end p-2 gap-1.5 bg-zinc-900/10">
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-zinc-500 font-semibold font-mono">
                  STACK EMPTY
                </div>
              )}
              <AnimatePresence mode="popLayout">
                {[...elements].reverse().map((el, idx) => {
                  const actualIdx = elements.length - 1 - idx;
                  const isTop = idx === 0;
                  return (
                    <motion.div
                      key={actualIdx}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      className={`w-full py-2 bg-gradient-to-r text-center rounded-lg font-bold font-mono text-sm border shadow-md flex justify-between px-3 ${
                        isTop ? 'from-accent-blue/30 to-accent-purple/30 border-accent-blue text-white' : 'from-zinc-900 to-zinc-900/80 border-white/5 text-zinc-400'
                      }`}
                    >
                      <span>val: {el}</span>
                      <span className="text-[10px] text-zinc-500">{isTop ? 'Top' : `[${actualIdx}]`}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* QUEUE TYPE */}
          {type === 'queue' && (
            <div className="flex flex-col items-center gap-1 w-full max-w-lg">
              <div className="flex justify-between w-full text-[10px] text-zinc-500 font-bold px-4">
                <span>Front (Dequeue)</span>
                <span>Rear (Enqueue)</span>
              </div>
              <div className="w-full h-16 border-y-2 border-dashed border-zinc-700/60 flex items-center justify-start p-2 gap-2 relative bg-zinc-900/10 overflow-x-auto">
                {elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-zinc-500 font-semibold font-mono">
                    QUEUE EMPTY
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {elements.map((el, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === elements.length - 1;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className={`w-16 h-10 flex items-center justify-center font-bold font-mono text-xs rounded-lg border shadow-sm flex-shrink-0 ${
                          isFront
                            ? 'bg-accent-blue/20 border-accent-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                            : isRear
                            ? 'bg-accent-purple/20 border-accent-purple text-zinc-200'
                            : 'bg-zinc-900 border-white/5 text-zinc-400'
                        }`}
                      >
                        {el}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* SEARCHING TYPE */}
          {type === 'searching' && (
            <div className="flex flex-col items-center gap-6 w-full max-w-xl">
              <div className="flex flex-wrap gap-2.5 items-center justify-center">
                {elements.map((el, idx) => {
                  const isLeft = searchLeft !== null && idx === searchLeft;
                  const isRight = searchRight !== null && idx === searchRight;
                  const isMid = searchMid !== null && idx === searchMid;
                  const isHighlight = highlightIdxs.includes(idx);

                  let cellColor = 'bg-zinc-900 border-white/10 text-zinc-400';
                  let indexLabel = '';

                  if (isHighlight) {
                    cellColor = 'bg-emerald-500/30 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]';
                  } else if (isMid) {
                    cellColor = 'bg-accent-blue/30 border-accent-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]';
                    indexLabel = 'Mid';
                  } else if (isLeft && isRight) {
                    cellColor = 'bg-accent-purple/20 border-accent-purple text-zinc-100';
                    indexLabel = 'L/R';
                  } else if (isLeft) {
                    cellColor = 'bg-accent-purple/10 border-accent-purple/60 text-zinc-300';
                    indexLabel = 'Low';
                  } else if (isRight) {
                    cellColor = 'bg-accent-pink/10 border-accent-pink/60 text-zinc-300';
                    indexLabel = 'High';
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-sm font-mono transition-all duration-300 ${cellColor}`}>
                        {el}
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono mt-1">idx: {idx}</span>
                      {indexLabel && (
                        <span className="text-[9px] font-bold text-white bg-zinc-800/80 px-1 py-0.5 rounded mt-0.5 scale-90">
                          {indexLabel}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </VisualizerContainer>
  );
};
