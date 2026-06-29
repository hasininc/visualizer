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
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Save,
  FolderOpen,
  Eye,
  AlertCircle
} from 'lucide-react';

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

interface Workspace {
  id: string;
  name: string;
  dsType: string;
  elements: DSNode[];
  updatedAt: string;
}

function App() {
  const [activeDS, setActiveDS] = useState<string>('array');
  const [elements, setElements] = useState<DSNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  // Workspaces persistence state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [saveName, setSaveName] = useState<string>('');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');

  // Algorithm execution state
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [algoSteps, setAlgoSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step
  const [selectedAlgo, setSelectedAlgo] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [stackExprValue, setStackExprValue] = useState<string>('{[()]}');

  // Fetch saved workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Sync state and algorithm choices when switching structures
  useEffect(() => {
    setElements([]);
    setSelectedId(null);
    setInputValue('');
    setIsVisualizing(false);
    setAlgoSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);

    // Set default algorithm selectors
    if (activeDS === 'array') {
      setSelectedAlgo('bubble');
    } else if (activeDS === 'tree') {
      setSelectedAlgo('inorder');
    } else if (activeDS === 'linkedlist') {
      setSelectedAlgo('search');
    } else if (activeDS === 'stack') {
      setSelectedAlgo('balance');
    } else {
      setSelectedAlgo('');
    }
  }, [activeDS]);

  // Autoplay playback scheduler
  useEffect(() => {
    let timer: any = null;
    if (isVisualizing && isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= algoSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVisualizing, isPlaying, algoSteps.length, playbackSpeed]);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
      }
    } catch (err) {
      console.error('Error fetching workspaces:', err);
    }
  };

  const handleSaveWorkspace = async () => {
    const name = saveName.trim();
    if (!name) {
      alert('Please enter a name first!');
      return;
    }
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          dsType: activeDS,
          elements,
        }),
      });
      if (res.ok) {
        setSaveName('');
        fetchWorkspaces();
        alert('Workspace saved successfully!');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error('Error saving workspace:', err);
      alert('Failed to save workspace. Is the server running?');
    }
  };

  const handleLoadWorkspace = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/workspaces/${id}`);
      if (res.ok) {
        const ws = await res.json();
        setIsVisualizing(false);
        setAlgoSteps([]);
        setCurrentStepIdx(0);
        setIsPlaying(false);
        
        setActiveDS(ws.dsType);
        setTimeout(() => {
          setElements(ws.elements);
        }, 50);
        setSelectedWorkspaceId('');
      }
    } catch (err) {
      console.error('Error loading workspace:', err);
    }
  };

  const handleDeleteWorkspace = async (id: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this workspace?')) return;
    try {
      const res = await fetch(`/api/workspaces/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchWorkspaces();
        setSelectedWorkspaceId('');
      }
    } catch (err) {
      console.error('Error deleting workspace:', err);
    }
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.min(algoSteps.length - 1, prev + 1));
  };

  const handleRunAlgorithm = async () => {
    let endpoint = '';
    let body: any = {};

    if (activeDS === 'array') {
      if (elements.length === 0) {
        alert('Please add elements to the array first!');
        return;
      }
      endpoint = '/api/algorithms/array/sort';
      body = { elements, algorithm: selectedAlgo };
    } else if (activeDS === 'tree') {
      if (elements.length === 0) {
        alert('Please add tree nodes first!');
        return;
      }
      if (selectedAlgo === 'search') {
        const sVal = searchValue.trim();
        if (!sVal) {
          alert('Please enter a search value!');
          return;
        }
        endpoint = '/api/algorithms/tree/search';
        body = { elements, target: sVal };
      } else {
        endpoint = '/api/algorithms/tree/traverse';
        body = { elements, type: selectedAlgo };
      }
    } else if (activeDS === 'linkedlist') {
      if (elements.length === 0) {
        alert('Please add list elements first!');
        return;
      }
      const sVal = searchValue.trim();
      if (!sVal) {
        alert('Please enter a search value!');
        return;
      }
      endpoint = '/api/algorithms/linkedlist/search';
      body = { elements, target: sVal };
    } else if (activeDS === 'stack') {
      if (selectedAlgo === 'balance') {
        const expr = stackExprValue.trim();
        if (!expr) {
          alert('Please enter a bracket expression!');
          return;
        }
        endpoint = '/api/algorithms/stack/balance';
        body = { expression: expr };
      }
    }

    if (!endpoint) return;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const steps = await res.json();
        if (steps.length === 0) {
          alert('Algorithm returned 0 steps.');
          return;
        }
        setAlgoSteps(steps);
        setCurrentStepIdx(0);
        setIsVisualizing(true);
        setIsPlaying(true);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Error running algorithm:', err);
      alert('Failed to connect to backend. Is the server running?');
    }
  };

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
        const idx = elements.findIndex(el => el.id === selectedId);
        const updated = [...elements];
        updated.splice(idx, 0, newNode);
        setElements(updated);
      } else {
        setElements([...elements, newNode]);
      }
    } else if (activeDS === 'stack' || activeDS === 'queue') {
      setElements([...elements, newNode]);
    } else if (activeDS === 'linkedlist') {
      const count = elements.length;
      newNode.x = 75 + count * 110;
      newNode.y = 160 + (count % 2 === 0 ? -15 : 15);
      setElements([...elements, newNode]);
    } else if (activeDS === 'tree') {
      if (selectedId) {
        const parent = elements.find(el => el.id === selectedId);
        if (parent) {
          const children = elements.filter(el => el.parentId === selectedId);
          const count = children.length;
          
          newNode.parentId = selectedId;
          newNode.x = parent.x + (count % 2 === 0 ? -70 - (count * 10) : 70 + (count * 10));
          newNode.y = parent.y + 80;
          setElements([...elements, newNode]);
        }
      } else if (elements.length === 0) {
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
      if (elements.length === 0) return;
      setElements(elements.slice(0, -1));
      setSelectedId(null);
    } else if (activeDS === 'queue') {
      if (elements.length === 0) return;
      setElements(elements.slice(1));
      setSelectedId(null);
    } else if (selectedId) {
      if (activeDS === 'tree') {
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

  const handleEditNodeValue = (id: string, newValue: string) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          return { ...el, value: newValue };
        }
        return el;
      })
    );
  };

  const renderActiveWorkspace = () => {
    const currentStep = isVisualizing ? algoSteps[currentStepIdx] : null;

    switch (activeDS) {
      case 'array':
        return (
          <ArrayWorkspace
            elements={isVisualizing && currentStep ? currentStep.elements : elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onEditValue={handleEditNodeValue}
            // @ts-ignore
            visualizationData={currentStep}
          />
        );
      case 'stack': {
        const stackNodes = isVisualizing && currentStep
          ? currentStep.stack.map((char: string, idx: number) => ({
              id: `step-stack-${idx}`,
              value: char,
              x: 0,
              y: 0,
            }))
          : elements;
        return (
          <StackWorkspace
            elements={stackNodes}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onEditValue={handleEditNodeValue}
            // @ts-ignore
            visualizationData={currentStep}
          />
        );
      }
      case 'queue':
        return (
          <QueueWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onEditValue={handleEditNodeValue}
            // @ts-ignore
            visualizationData={currentStep}
          />
        );
      case 'linkedlist':
        return (
          <LinkedListWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onEditValue={handleEditNodeValue}
            // @ts-ignore
            visualizationData={currentStep}
          />
        );
      case 'tree':
        return (
          <TreeWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onEditValue={handleEditNodeValue}
            // @ts-ignore
            visualizationData={currentStep}
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

  const currentStep = isVisualizing ? algoSteps[currentStepIdx] : null;

  return (
    <div className="flex flex-col min-h-screen bg-pastel-bg text-pastel-dark font-sans relative">
      <Navbar onOpenAboutModal={() => setIsHowItWorksOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side Control Panel */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <Card className="flex flex-col gap-5 border-[#a38deb]">
            <div className="flex items-center gap-1.5 border-b border-[#a38deb]/50 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-[#4c258d]" />
              <h3 className="font-bold text-sm text-[#250d4f] font-display">
                Visualizer Panel
              </h3>
            </div>

            {/* Dropdown Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4c258d]">
                Structure Type
              </label>
              <div className="relative flex items-center">
                <select
                  value={activeDS}
                  onChange={(e) => setActiveDS(e.target.value)}
                  disabled={isVisualizing}
                  className="w-full pl-3 pr-10 py-2.5 bg-[#dfd7fc] border border-[#a38deb] hover:border-[#4c258d] text-[#250d4f] rounded-2xl text-sm font-bold focus:outline-none appearance-none cursor-pointer shadow-sm transition-all disabled:opacity-50"
                >
                  {dsOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#250d4f] absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Value Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4c258d]">
                Input Element Value
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="Enter numbers or text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isVisualizing}
                className="w-full px-3 py-2.5 bg-[#dfd7fc] border border-[#a38deb] hover:border-[#4c258d] text-[#250d4f] placeholder-[#250d4f]/45 rounded-2xl text-sm font-bold focus:outline-none shadow-sm transition-all disabled:opacity-50"
              />
            </div>

            {/* Operations Actions */}
            <div className="flex flex-col gap-2 border-t border-purple-100/50 pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4c258d]">
                Operations
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="primary"
                  onClick={handleAdd}
                  icon={<Plus className="w-4 h-4" />}
                  className="w-full"
                  disabled={isVisualizing}
                >
                  {activeDS === 'stack' ? 'Push' : activeDS === 'queue' ? 'Enqueue' : 'Add'}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  icon={<Trash2 className="w-4 h-4" />}
                  className="w-full"
                  disabled={isVisualizing}
                >
                  {activeDS === 'stack' ? 'Pop' : activeDS === 'queue' ? 'Dequeue' : 'Delete'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleEdit}
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                  className="w-full"
                  disabled={!selectedId || isVisualizing}
                >
                  Edit Box
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleRandomize()}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="w-full"
                  disabled={isVisualizing}
                >
                  Randomize
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleClear}
              icon={<XCircle className="w-4 h-4" />}
              className="w-full mt-1.5"
              disabled={isVisualizing}
            >
              Clear Workspace
            </Button>
          </Card>

          {/* Algorithms Visualizer Panel */}
          {activeDS !== 'queue' && (
            <Card className="flex flex-col gap-4 border-[#a38deb] bg-[#eae5fc]/50">
              <div className="flex items-center gap-1.5 border-b border-[#a38deb]/50 pb-2">
                <Eye className="w-4 h-4 text-[#4c258d]" />
                <h3 className="font-bold text-xs text-[#250d4f] font-display uppercase tracking-wider">
                  DSA Algorithms
                </h3>
              </div>

              {activeDS === 'array' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-[#4c258d]">Sorting Algorithm</label>
                    <select
                      value={selectedAlgo}
                      onChange={(e) => setSelectedAlgo(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full pl-2 pr-8 py-1.5 bg-[#dfd7fc] border border-[#a38deb] text-[#250d4f] rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="bubble">Bubble Sort</option>
                      <option value="selection">Selection Sort</option>
                    </select>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleRunAlgorithm}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    disabled={isVisualizing}
                    className="w-full text-xs py-2 bg-purple-700 border-purple-800"
                  >
                    Run Sort Algorithm
                  </Button>
                </div>
              )}

              {activeDS === 'tree' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-[#4c258d]">Tree Operation</label>
                    <select
                      value={selectedAlgo}
                      onChange={(e) => setSelectedAlgo(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full pl-2 pr-8 py-1.5 bg-[#dfd7fc] border border-[#a38deb] text-[#250d4f] rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="inorder">Inorder Traversal</option>
                      <option value="preorder">Preorder Traversal</option>
                      <option value="postorder">Postorder Traversal</option>
                      <option value="search">BST Search Target</option>
                    </select>
                  </div>
                  {selectedAlgo === 'search' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-[#4c258d]">Search Value</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="Search key..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        disabled={isVisualizing}
                        className="w-full px-2.5 py-1.5 bg-[#dfd7fc] border border-[#a38deb] text-[#250d4f] text-xs font-bold rounded-xl outline-none"
                      />
                    </div>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleRunAlgorithm}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    disabled={isVisualizing}
                    className="w-full text-xs py-2 bg-purple-700 border-purple-800"
                  >
                    {selectedAlgo === 'search' ? 'Search Tree' : 'Run Traversal'}
                  </Button>
                </div>
              )}

              {activeDS === 'linkedlist' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-[#4c258d]">Search Value</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Search key..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full px-2.5 py-1.5 bg-[#dfd7fc] border border-[#a38deb] text-[#250d4f] text-xs font-bold rounded-xl outline-none"
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleRunAlgorithm}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    disabled={isVisualizing}
                    className="w-full text-xs py-2 bg-purple-700 border-purple-800"
                  >
                    Linear Search Node
                  </Button>
                </div>
              )}

              {activeDS === 'stack' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-[#4c258d]">Bracket Expression</label>
                    <input
                      type="text"
                      placeholder="e.g. {[()]}"
                      value={stackExprValue}
                      onChange={(e) => setStackExprValue(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full px-2.5 py-1.5 bg-[#dfd7fc] border border-[#a38deb] text-[#250d4f] text-xs font-bold rounded-xl outline-none"
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleRunAlgorithm}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    disabled={isVisualizing}
                    className="w-full text-xs py-2 bg-purple-700 border-purple-800"
                  >
                    Verify Bracket Balance
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Workspaces Persistence Panel */}
          <Card className="flex flex-col gap-4 border-[#a38deb] bg-[#eae5fc]/50">
            <div className="flex items-center gap-1.5 border-b border-[#a38deb]/50 pb-2">
              <FolderOpen className="w-4 h-4 text-[#4c258d]" />
              <h3 className="font-bold text-xs text-[#250d4f] font-display uppercase tracking-wider">
                Saved Workspaces
              </h3>
            </div>

            {/* Save Workspace Form */}
            <div className="flex flex-col gap-2 border-b border-[#a38deb]/30 pb-3">
              <label className="text-[9px] font-black uppercase text-[#4c258d]">Save Current Canvas</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Workspace name..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  disabled={isVisualizing}
                  className="flex-1 px-2.5 py-1.5 bg-[#dfd7fc] border border-[#a38deb] text-[#250d4f] text-xs font-bold rounded-xl outline-none min-w-0"
                />
                <Button
                  variant="primary"
                  onClick={handleSaveWorkspace}
                  icon={<Save className="w-3.5 h-3.5" />}
                  disabled={isVisualizing}
                  className="px-2 py-1.5 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* Load Workspace Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black uppercase text-[#4c258d]">Load Workspace</label>
              {workspaces.length === 0 ? (
                <div className="text-[10px] text-[#250d4f]/60 italic">No workspaces saved.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="relative flex items-center">
                    <select
                      value={selectedWorkspaceId}
                      onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full pl-2 pr-8 py-1.5 bg-[#dfd7fc] border border-[#a38deb] text-[#250d4f] rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="">Select a workspace...</option>
                      {workspaces.map((ws) => (
                        <option key={ws.id} value={ws.id}>
                          {ws.name} ({ws.dsType})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#250d4f] absolute right-2 pointer-events-none" />
                  </div>
                  {selectedWorkspaceId && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleLoadWorkspace(selectedWorkspaceId)}
                        className="py-1 text-[10px] font-bold rounded-lg"
                      >
                        Load
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteWorkspace(selectedWorkspaceId)}
                        className="py-1 text-[10px] font-bold rounded-lg"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
          
          {/* Help Hints Card */}
          <div className="text-[11px] text-[#250d4f]/80 bg-[#a28ceb]/30 border border-[#947deb]/40 rounded-3xl p-4 flex flex-col gap-1.5 shadow-sm">
            <div className="font-bold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#250d4f]" />
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
        <div className="flex-1 flex flex-col gap-4">
          <Card className="flex-1 bg-gradient-to-br from-[#e8e2fa] to-[#f7f5fd] border-[#a38deb] relative overflow-hidden flex flex-col justify-between min-h-[460px] p-8 shadow-sm">
            {/* Visual Grid background details */}
            <div className="absolute inset-0 bg-canvas-grid-pattern opacity-100 pointer-events-none" />
            
            {/* Header info bar */}
            <div className="flex justify-between items-center border-b border-[#a38deb]/60 pb-3 relative z-10">
              <h4 className="text-base font-bold font-display text-[#250d4f] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4c258d] animate-pulse" />
                {dsOptions.find(opt => opt.value === activeDS)?.label} Canvas
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleRandomize()}
                  icon={<RefreshCw className="w-3.5 h-3.5 text-[#250d4f]" />}
                  className="px-3.5 py-1 text-xs rounded-xl"
                  disabled={isVisualizing}
                >
                  Reset Layout
                </Button>
              </div>
            </div>

            {/* Bracket stack expression helper in stack visualization mode */}
            {isVisualizing && activeDS === 'stack' && currentStep && (
              <div className="w-full flex flex-col items-center justify-center pt-4 z-10 gap-1.5">
                <span className="text-[9px] font-black uppercase text-[#4c258d] tracking-widest">Expression Scanning</span>
                <div className="flex gap-1.5 text-base font-bold font-mono">
                  {stackExprValue.split('').map((char, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                        i === currentStep.activeCharIdx
                          ? 'bg-[#4a238a] border-[#4a238a] text-[#f3f0fd] scale-110 shadow-md ring-2 ring-[#bdabfc]/60'
                          : i < currentStep.activeCharIdx
                          ? 'bg-[#dfd7fc]/30 border-[#a38deb]/30 text-[#250d4f]/40 line-through'
                          : 'bg-[#dfd7fc] border-[#a38deb] text-[#250d4f]'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded Active Canvas Workspace */}
            <div className="flex-1 flex items-center justify-center relative z-10 w-full">
              {renderActiveWorkspace()}
            </div>

            {/* Bottom status bar */}
            <div className="border-t border-[#a38deb]/50 pt-3 relative z-10 flex justify-between items-center text-xs text-[#250d4f] font-mono">
              <div>
                Elements count: <span className="font-bold">{isVisualizing && activeDS === 'stack' && currentStep ? currentStep.stack.length : elements.length}</span>
              </div>
              <div>
                Selected Node: {selectedId && !isVisualizing ? (
                  <span className="text-[#f3f0fd] font-bold bg-[#4a238a] px-2 py-0.5 rounded-md">
                    {elements.find(el => el.id === selectedId)?.value || 'None'}
                  </span>
                ) : (
                  <span className="text-[#250d4f]/60 font-bold">None</span>
                )}
              </div>
            </div>
          </Card>

          {/* Premium Floating Algorithm Playback Controller Toolbar */}
          {isVisualizing && currentStep && (
            <Card className="border-[#4a238a] bg-gradient-to-r from-[#dfd7fc] to-[#e8e2fa] shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center p-4 relative overflow-hidden z-20">
              {/* Active step number indicator */}
              <div className="absolute top-0 left-0 bg-[#4a238a] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-br-lg">
                Step {currentStepIdx + 1} of {algoSteps.length}
              </div>

              {/* Progress Bar background tracking */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4c258d]/20">
                <div
                  className="h-full bg-purple-700 transition-all duration-300"
                  style={{ width: `${((currentStepIdx + 1) / algoSteps.length) * 100}%` }}
                />
              </div>

              {/* Narration and Logging */}
              <div className="flex-1 flex gap-2 items-center min-w-0 md:max-w-[45%]">
                <AlertCircle className="w-5 h-5 text-purple-700 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black uppercase text-[#4c258d] tracking-widest leading-none">Algorithm Log</span>
                  <p className="text-xs font-bold text-[#250d4f] truncate" title={currentStep.description}>
                    {currentStep.description}
                  </p>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={handlePrevStep}
                  icon={<SkipBack className="w-4 h-4" />}
                  className="p-2 rounded-xl"
                  disabled={currentStepIdx === 0}
                />
                <Button
                  variant="primary"
                  onClick={() => setIsPlaying(!isPlaying)}
                  icon={isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  className="p-3 bg-purple-700 border-purple-800 rounded-full"
                />
                <Button
                  variant="secondary"
                  onClick={handleNextStep}
                  icon={<SkipForward className="w-4 h-4" />}
                  className="p-2 rounded-xl"
                  disabled={currentStepIdx === algoSteps.length - 1}
                />
              </div>

              {/* Speed & Scrubber & Exit */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {/* Speed selector */}
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase text-[#4c258d] tracking-wider mb-0.5 text-right">Speed</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="pl-2 pr-6 py-1 bg-[#dfd7fc] border border-[#a38deb]/70 text-[#250d4f] rounded-lg text-[10px] font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="1500">0.5x Slow</option>
                    <option value="1000">1.0x Normal</option>
                    <option value="500">2.0x Fast</option>
                    <option value="250">4.0x Turbo</option>
                  </select>
                </div>

                <div className="h-8 w-[1px] bg-[#a38deb]/30 hidden md:block" />

                <button
                  onClick={() => {
                    setIsVisualizing(false);
                    setIsPlaying(false);
                    setAlgoSteps([]);
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Exit Playback
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <footer className="border-t border-[#a38deb]/40 bg-[#bdabfc]/60 py-6 text-center text-xs text-[#250d4f] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#4c258d]" />
            <span>DSA Visualizer Playground v2.0.0</span>
          </div>
          <div>
            <span>Made with 💜 for Software Portfolios</span>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        title="Interactive Playground Guide"
        size="md"
      >
        <div className="flex flex-col gap-5 text-[#250d4f]">
          <div className="flex items-center gap-3 bg-[#a28ceb]/20 p-3.5 rounded-2xl border border-[#947deb]/40">
            <div className="w-9 h-9 bg-[#dfd7fc] rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-[#4a238a] fill-[#4a238a]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#250d4f]">Whiteboard Sandbox Mechanics</h4>
              <p className="text-[11px] text-[#4a238a] font-black">Manipulate nodes in real time just like Canva or Figma.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs leading-relaxed text-[#250d4f]/80">
            <p>
              This app is designed to help you construct and manipulate standard data structures visually. Here's how you can play:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>
                <span className="font-bold text-[#250d4f]">Drag to Position:</span> In the Linked List and Tree view, you can drag circles freely inside the canvas. Connection lines adapt automatically!
              </li>
              <li>
                <span className="font-bold text-[#250d4f]">Drag to Reorder Array:</span> Drag any index box horizontally to reposition it in the array slots.
              </li>
              <li>
                <span className="font-bold text-[#250d4f]">Insert Anywhere (Array):</span> Select a box in the Array, enter a value, and click Add to insert a new element at that index.
              </li>
              <li>
                <span className="font-bold text-[#250d4f]">Build custom Trees:</span> Select a parent node, type a value, and click Add. The child connects automatically! To delete a subtree, select the parent node and click Delete.
              </li>
              <li>
                <span className="font-bold text-[#250d4f]">LIFO & FIFO Rules:</span> Push/Pop and Enqueue/Dequeue automatically animate values entering and exiting Stack and Queue layouts.
              </li>
            </ul>
          </div>

          <div className="border-t border-[#a38deb]/45 pt-4 flex justify-end">
            <button
              onClick={() => setIsHowItWorksOpen(false)}
              className="px-4 py-2 bg-[#4c258d] text-[#ece8ff] hover:bg-[#3f1c7a] rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all"
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
