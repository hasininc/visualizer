import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ArrayWorkspace } from './pages/ArrayWorkspace';
import { StackWorkspace } from './pages/StackWorkspace';
import { QueueWorkspace } from './pages/QueueWorkspace';
import { LinkedListWorkspace } from './pages/LinkedListWorkspace';
import { TreeWorkspace } from './pages/TreeWorkspace';
import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { Button } from './components/Button';
import {
  Sparkles,
  ChevronDown,
  Trash2,
  Edit2,
  Plus,
  RefreshCw,
  XCircle,
  HelpCircle,
  Cpu,
  Play
} from 'lucide-react';

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

function App() {
  const [activeDS, setActiveDS] = useState<string>('array');
  const [elements, setElements] = useState<DSNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  // Pre-load randomized data when switching structures
  useEffect(() => {
    handleRandomize(activeDS);
    setSelectedId(null);
    setInputValue('');
  }, [activeDS]);

  const handleRandomize = (dsType = activeDS) => {
    setSelectedId(null);
    const newElements: DSNode[] = [];
    
    if (dsType === 'array' || dsType === 'stack' || dsType === 'queue') {
      const defaultVals = ['15', '42', '68', '33', '90'];
      for (let i = 0; i < defaultVals.length; i++) {
        newElements.push({
          id: `node-${i}-${Math.random().toString().slice(2, 6)}`,
          value: defaultVals[i],
          x: 0,
          y: 0,
        });
      }
    } else if (dsType === 'linkedlist') {
      const defaultVals = ['10', '20', '30', '40'];
      for (let i = 0; i < defaultVals.length; i++) {
        newElements.push({
          id: `node-${i}-${Math.random().toString().slice(2, 6)}`,
          value: defaultVals[i],
          x: 75 + i * 110,
          y: 160 + (i % 2 === 0 ? -15 : 15),
        });
      }
    } else if (dsType === 'tree') {
      const rootId = 'tree-root';
      const leftId = 'tree-left';
      const rightId = 'tree-right';
      
      newElements.push({ id: rootId, value: '50', x: 240, y: 60 });
      newElements.push({ id: leftId, value: '30', x: 140, y: 150, parentId: rootId });
      newElements.push({ id: rightId, value: '70', x: 340, y: 150, parentId: rootId });
      newElements.push({ id: 'tree-left-left', value: '20', x: 80, y: 240, parentId: leftId });
      newElements.push({ id: 'tree-left-right', value: '40', x: 200, y: 240, parentId: leftId });
    }
    
    setElements(newElements);
  };

  const handleAdd = () => {
    const val = inputValue.trim();
    if (!val) {
      alert('Please enter a value first!');
      return;
    }
    
    // Limits
    if (elements.length >= 8 && (activeDS === 'array' || activeDS === 'queue')) {
      alert('Array/Queue size is limited to 8 elements for layout clarity.');
      return;
    }
    if (elements.length >= 6 && activeDS === 'stack') {
      alert('Stack height is limited to 6 elements.');
      return;
    }

    const newNode: DSNode = {
      id: `node-user-${Math.random().toString().slice(2, 8)}`,
      value: val,
      x: 0,
      y: 0,
    };

    if (activeDS === 'array') {
      if (selectedId) {
        // Insert at selected element's index
        const idx = elements.findIndex(el => el.id === selectedId);
        const updated = [...elements];
        updated.splice(idx, 0, newNode);
        setElements(updated);
      } else {
        // Append at end
        setElements([...elements, newNode]);
      }
    } else if (activeDS === 'stack' || activeDS === 'queue') {
      // Stack push / Queue enqueue
      setElements([...elements, newNode]);
    } else if (activeDS === 'linkedlist') {
      // Spawn LL node at the tail position visually
      const count = elements.length;
      newNode.x = 75 + count * 110;
      newNode.y = 160 + (count % 2 === 0 ? -15 : 15);
      setElements([...elements, newNode]);
    } else if (activeDS === 'tree') {
      if (selectedId) {
        const parent = elements.find(el => el.id === selectedId);
        if (parent) {
          // Count children
          const children = elements.filter(el => el.parentId === selectedId);
          const count = children.length;
          
          newNode.parentId = selectedId;
          // Spawn slightly below parent staggered left/right
          newNode.x = parent.x + (count % 2 === 0 ? -70 - (count * 10) : 70 + (count * 10));
          newNode.y = parent.y + 80;
          setElements([...elements, newNode]);
        }
      } else if (elements.length === 0) {
        // Root node
        newNode.x = 240;
        newNode.y = 60;
        setElements([newNode]);
      } else {
        alert('Please select a parent node in the tree first to attach this child!');
        return;
      }
    }

    setInputValue('');
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (activeDS === 'stack') {
      // POP removes top
      if (elements.length === 0) return;
      setElements(elements.slice(0, -1));
      setSelectedId(null);
    } else if (activeDS === 'queue') {
      // DEQUEUE removes front
      if (elements.length === 0) return;
      setElements(elements.slice(1));
      setSelectedId(null);
    } else if (selectedId) {
      if (activeDS === 'tree') {
        // Remove node and all children recursively
        const removeRecursive = (idToDelete: string, list: DSNode[]): DSNode[] => {
          const children = list.filter(n => n.parentId === idToDelete);
          let currentList = list.filter(n => n.id !== idToDelete);
          for (const child of children) {
            currentList = removeRecursive(child.id, currentList);
          }
          return currentList;
        };
        setElements(removeRecursive(selectedId, elements));
      } else {
        setElements(elements.filter(el => el.id !== selectedId));
      }
      setSelectedId(null);
    } else {
      alert('Select an element in the canvas first (click it) to delete it!');
    }
  };

  const handleEdit = () => {
    const val = inputValue.trim();
    if (!selectedId) {
      alert('Select an element in the canvas first to edit its value!');
      return;
    }
    if (!val) {
      alert('Please enter a new value in the input field!');
      return;
    }

    setElements(elements.map(el => {
      if (el.id === selectedId) {
        return { ...el, value: val };
      }
      return el;
    }));
    setInputValue('');
    setSelectedId(null);
  };

  const handleClear = () => {
    setElements([]);
    setSelectedId(null);
    setInputValue('');
  };

  const renderActiveWorkspace = () => {
    switch (activeDS) {
      case 'array':
        return (
          <ArrayWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
          />
        );
      case 'stack':
        return (
          <StackWorkspace
            elements={elements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
          />
        );
      case 'queue':
        return (
          <QueueWorkspace
            elements={elements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
          />
        );
      case 'linkedlist':
        return (
          <LinkedListWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
          />
        );
      case 'tree':
        return (
          <TreeWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
          />
        );
      default:
        return null;
    }
  };

  const dsOptions = [
    { value: 'array', label: 'Array Structure' },
    { value: 'stack', label: 'Stack Structure (LIFO)' },
    { value: 'queue', label: 'Queue Structure (FIFO)' },
    { value: 'linkedlist', label: 'Linked List Node Links' },
    { value: 'tree', label: 'Hierarchical Tree Links' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-pastel-bg text-pastel-dark font-sans relative">
      {/* Navbar Title Banner */}
      <Navbar onOpenAboutModal={() => setIsHowItWorksOpen(true)} />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side Control Panel */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <Card className="flex flex-col gap-5 border-purple-100/80 bg-white/70">
            
            {/* Header section of Panel */}
            <div className="flex items-center gap-1.5 border-b border-purple-100/50 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-purple-500" />
              <h3 className="font-bold text-sm text-purple-950 font-display">
                Visualizer Panel
              </h3>
            </div>

            {/* Dropdown Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                Structure Type
              </label>
              <div className="relative flex items-center">
                <select
                  value={activeDS}
                  onChange={(e) => setActiveDS(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-purple-100 hover:border-purple-200 text-purple-900 rounded-2xl text-sm font-semibold focus:outline-none appearance-none cursor-pointer shadow-sm transition-all"
                >
                  {dsOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-purple-400 absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Value Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                Input Element Value
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="Enter numbers or text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-purple-100 hover:border-purple-200 text-purple-900 rounded-2xl text-sm font-semibold focus:outline-none shadow-sm transition-all"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 border-t border-purple-100/50 pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                Operations
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="primary"
                  onClick={handleAdd}
                  icon={<Plus className="w-4 h-4" />}
                  className="w-full"
                >
                  {activeDS === 'stack' ? 'Push' : activeDS === 'queue' ? 'Enqueue' : 'Add'}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  icon={<Trash2 className="w-4 h-4" />}
                  className="w-full"
                >
                  {activeDS === 'stack' ? 'Pop' : activeDS === 'queue' ? 'Dequeue' : 'Delete'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleEdit}
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                  className="w-full"
                  disabled={!selectedId}
                >
                  Edit Box
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleRandomize()}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Randomize
                </Button>
              </div>
            </div>

            {/* Clear Box button */}
            <Button
              variant="ghost"
              onClick={handleClear}
              icon={<XCircle className="w-4 h-4" />}
              className="w-full mt-1.5"
            >
              Clear Workspace
            </Button>
          </Card>
          
          {/* Help hints card */}
          <div className="text-[11px] text-purple-500 bg-white/40 border border-purple-100/40 rounded-3xl p-4 flex flex-col gap-1.5 shadow-sm">
            <div className="font-bold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
              <span>Did you know?</span>
            </div>
            {activeDS === 'array' && (
              <span>You can insert elements at a specific index! Click an element to select it, then press Add to insert a new element at that position.</span>
            )}
            {activeDS === 'stack' && (
              <span>The top element is locked inside LIFO order. Only the TOP element can be Popped off. Push values to stack them vertically!</span>
            )}
            {activeDS === 'queue' && (
              <span>FIFO order: Enqueue appends at the Rear pointer, Dequeue extracts from the Front pointer.</span>
            )}
            {activeDS === 'linkedlist' && (
              <span>LinkedList connections link Node 0 to Node 1, Node 1 to Node 2 automatically. Drag nodes freely in 2D space to structure lists!</span>
            )}
            {activeDS === 'tree' && (
              <span>To build a custom tree, select a parent node in the canvas, then input a child value and click Add Child!</span>
            )}
          </div>
        </div>

        {/* Right Sandbox Workspace Canvas */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 bg-white/80 border-purple-100 shadow-[0_12px_40px_-15px_rgba(139,92,246,0.06)] relative overflow-hidden flex flex-col justify-between min-h-[460px] p-8">
            {/* Visual Grid background details */}
            <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
            
            {/* Header info bar */}
            <div className="flex justify-between items-center border-b border-purple-100/60 pb-3 relative z-10">
              <h4 className="text-base font-bold font-display text-purple-950 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                {dsOptions.find(opt => opt.value === activeDS)?.label} Canvas
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleRandomize()}
                  icon={<RefreshCw className="w-3.5 h-3.5 text-purple-600" />}
                  className="px-3.5 py-1 text-xs rounded-xl"
                >
                  Reset Layout
                </Button>
              </div>
            </div>

            {/* Embedded Active Canvas Workspace */}
            <div className="flex-1 flex items-center justify-center relative z-10 w-full">
              {renderActiveWorkspace()}
            </div>

            {/* Bottom status bar */}
            <div className="border-t border-purple-100/50 pt-3 relative z-10 flex justify-between items-center text-xs text-purple-500 font-mono">
              <div>
                Elements count: <span className="font-bold">{elements.length}</span>
              </div>
              <div>
                Selected Node: {selectedId ? (
                  <span className="text-purple-700 font-bold bg-purple-100/50 px-2 py-0.5 rounded-md">
                    {elements.find(el => el.id === selectedId)?.value || 'None'}
                  </span>
                ) : (
                  <span className="text-purple-400">None</span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Details */}
      <footer className="border-t border-purple-100/40 bg-white/40 py-6 text-center text-xs text-purple-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-500" />
            <span>DSA Visualizer Playground v2.0.0</span>
          </div>
          <div>
            <span>Made with 💜 for Software Portfolios</span>
          </div>
        </div>
      </footer>

      {/* Instructional Modal */}
      <Modal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        title="Interactive Playground Guide"
        size="md"
      >
        <div className="flex flex-col gap-5 text-purple-900">
          <div className="flex items-center gap-3 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100/50">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-purple-600 fill-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-purple-950">Whiteboard Sandbox Mechanics</h4>
              <p className="text-[11px] text-purple-600 font-semibold">Manipulate nodes in real time just like Canva or Figma.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs leading-relaxed text-purple-800">
            <p>
              This app is designed to help you construct and manipulate standard data structures visually. Here's how you can play:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>
                <span className="font-bold text-purple-900">Drag to Position:</span> In the Linked List and Tree view, you can drag circles freely inside the canvas. Connection lines adapt automatically!
              </li>
              <li>
                <span className="font-bold text-purple-900">Drag to Reorder Array:</span> Drag any index box horizontally to reposition it in the array slots.
              </li>
              <li>
                <span className="font-bold text-purple-900">Insert Anywhere (Array):</span> Select a box in the Array, enter a value, and click Add to insert a new element at that index.
              </li>
              <li>
                <span className="font-bold text-purple-900">Build custom Trees:</span> Select a parent node, type a value, and click Add. The child connects automatically! To delete a subtree, select the parent node and click Delete.
              </li>
              <li>
                <span className="font-bold text-purple-900">LIFO & FIFO Rules:</span> Push/Pop and Enqueue/Dequeue automatically animate values entering and exiting Stack and Queue layouts.
              </li>
            </ul>
          </div>

          <div className="border-t border-purple-100/50 pt-4 flex justify-end">
            <button
              onClick={() => setIsHowItWorksOpen(false)}
              className="px-4 py-2 bg-gradient-to-r from-purple-400 to-indigo-400 text-white rounded-2xl text-xs font-bold shadow-sm shadow-purple-500/10 cursor-pointer transition-all hover:shadow-md"
            >
              Start Building
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
