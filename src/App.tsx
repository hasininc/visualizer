import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
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

function MainVisualizerApp() {
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

  const handleAdd = () => {
    const val = inputValue.trim() || String(Math.floor(Math.random() * 90) + 10);
    const newId = String(Date.now());

    if (activeDS === 'tree') {
      if (elements.length === 0) {
        // Add root node
        setElements([{ id: newId, value: val, x: 240, y: 50 }]);
      } else {
        const parentId = selectedId || elements[0].id;
        const parentNode = elements.find((n) => n.id === parentId);
        const children = elements.filter((n) => n.parentId === parentId);
        const isLeft = children.length % 2 === 0;
        const offsetX = isLeft ? -50 : 50;

        const newChild: DSNode = {
          id: newId,
          value: val,
          x: (parentNode?.x || 240) + offsetX,
          y: (parentNode?.y || 50) + 70,
          parentId,
        };
        setElements((prev) => [...prev, newChild]);
      }
    } else if (activeDS === 'array' && selectedId) {
      const idx = elements.findIndex((el) => el.id === selectedId);
      if (idx !== -1) {
        const updated = [...elements];
        updated.splice(idx, 0, { id: newId, value: val, x: 0, y: 0 });
        setElements(updated);
      } else {
        setElements((prev) => [...prev, { id: newId, value: val, x: 0, y: 0 }]);
      }
    } else {
      setElements((prev) => [...prev, { id: newId, value: val, x: 0, y: 0 }]);
    }
    setInputValue('');
  };

  const handleDelete = () => {
    if (elements.length === 0) return;

    if (activeDS === 'stack') {
      setElements((prev) => prev.slice(0, -1));
      setSelectedId(null);
    } else if (activeDS === 'queue') {
      setElements((prev) => prev.slice(1));
      setSelectedId(null);
    } else if (selectedId) {
      if (activeDS === 'tree') {
        const toDelete = new Set<string>();
        const collectDescendants = (id: string) => {
          toDelete.add(id);
          elements.filter((n) => n.parentId === id).forEach((child) => collectDescendants(child.id));
        };
        collectDescendants(selectedId);
        setElements((prev) => prev.filter((el) => !toDelete.has(el.id)));
      } else {
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
      }
      setSelectedId(null);
    } else {
      setElements((prev) => prev.slice(0, -1));
    }
  };

  const handleEdit = () => {
    if (!selectedId) {
      alert('Please select a box first to edit!');
      return;
    }
    const val = prompt('Enter new value:');
    if (val !== null && val.trim() !== '') {
      handleEditNodeValue(selectedId, val.trim());
    }
  };

  const handleEditNodeValue = (id: string, newValue: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, value: newValue } : el))
    );
  };

  const handleClear = () => {
    setElements([]);
    setSelectedId(null);
    setIsVisualizing(false);
    setAlgoSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleRandomize = () => {
    setIsVisualizing(false);
    setAlgoSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);

    if (activeDS === 'tree') {
      const sampleVals = ['50', '25', '75', '15', '35', '65', '85'];
      const nodes: DSNode[] = [
        { id: '1', value: sampleVals[0], x: 240, y: 50 },
        { id: '2', value: sampleVals[1], x: 140, y: 120, parentId: '1' },
        { id: '3', value: sampleVals[2], x: 340, y: 120, parentId: '1' },
        { id: '4', value: sampleVals[3], x: 80, y: 190, parentId: '2' },
        { id: '5', value: sampleVals[4], x: 190, y: 190, parentId: '2' },
        { id: '6', value: sampleVals[5], x: 290, y: 190, parentId: '3' },
        { id: '7', value: sampleVals[6], x: 400, y: 190, parentId: '3' },
      ];
      setElements(nodes);
    } else {
      const count = Math.floor(Math.random() * 4) + 4;
      const randomized: DSNode[] = Array.from({ length: count }, (_, i) => ({
        id: String(Date.now() + i),
        value: String(Math.floor(Math.random() * 90) + 10),
        x: 0,
        y: 0,
      }));
      setElements(randomized);
    }
  };

  // Algorithm Execution Handlers
  const handleRunAlgorithm = () => {
    if (elements.length === 0 && activeDS !== 'stack') {
      alert('Please add elements to the canvas first!');
      return;
    }

    setIsPlaying(false);
    setCurrentStepIdx(0);

    if (activeDS === 'array') {
      const nums = elements.map((el) => parseInt(el.value, 10) || 0);
      let steps: any[] = [];

      if (selectedAlgo === 'bubble') {
        const arr = [...nums];
        const n = arr.length;
        const sortedIndices: number[] = [];
        steps.push({
          compared: [],
          swapped: [],
          sorted: [],
          arrayState: [...arr],
          description: 'Starting Bubble Sort iteration.',
        });

        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            steps.push({
              compared: [j, j + 1],
              swapped: [],
              sorted: [...sortedIndices],
              arrayState: [...arr],
              description: `Comparing elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]}).`,
            });
            if (arr[j] > arr[j + 1]) {
              const temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;

              steps.push({
                compared: [j, j + 1],
                swapped: [j, j + 1],
                sorted: [...sortedIndices],
                arrayState: [...arr],
                description: `Swapped ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`,
              });
            }
          }
          sortedIndices.push(n - 1 - i);
        }
        sortedIndices.push(0);
        steps.push({
          compared: [],
          swapped: [],
          sorted: Array.from({ length: n }, (_, i) => i),
          arrayState: [...arr],
          description: 'Bubble Sort completed! Array is fully sorted.',
        });
      } else if (selectedAlgo === 'selection') {
        const arr = [...nums];
        const n = arr.length;
        const sortedIndices: number[] = [];
        steps.push({
          compared: [],
          swapped: [],
          sorted: [],
          arrayState: [...arr],
          description: 'Starting Selection Sort.',
        });

        for (let i = 0; i < n - 1; i++) {
          let minIdx = i;
          for (let j = i + 1; j < n; j++) {
            steps.push({
              compared: [minIdx, j],
              swapped: [],
              sorted: [...sortedIndices],
              arrayState: [...arr],
              description: `Comparing element ${arr[j]} at index ${j} with current minimum ${arr[minIdx]} at index ${minIdx}.`,
            });
            if (arr[j] < arr[minIdx]) {
              minIdx = j;
            }
          }
          if (minIdx !== i) {
            const temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
            steps.push({
              compared: [i, minIdx],
              swapped: [i, minIdx],
              sorted: [...sortedIndices],
              arrayState: [...arr],
              description: `Swapped minimum element ${arr[i]} into index ${i}.`,
            });
          }
          sortedIndices.push(i);
        }
        sortedIndices.push(n - 1);
        steps.push({
          compared: [],
          swapped: [],
          sorted: Array.from({ length: n }, (_, i) => i),
          arrayState: [...arr],
          description: 'Selection Sort completed! Array is fully sorted.',
        });
      } else if (selectedAlgo === 'insertion') {
        const arr = [...nums];
        const n = arr.length;
        steps.push({
          compared: [],
          swapped: [],
          sorted: [0],
          arrayState: [...arr],
          description: 'Starting Insertion Sort. Index 0 is initially sorted.',
        });

        for (let i = 1; i < n; i++) {
          const key = arr[i];
          let j = i - 1;
          steps.push({
            compared: [i],
            swapped: [],
            sorted: Array.from({ length: i }, (_, k) => k),
            arrayState: [...arr],
            description: `Inserting key ${key} at index ${i} into sorted sub-array.`,
          });

          while (j >= 0 && arr[j] > key) {
            steps.push({
              compared: [j, j + 1],
              swapped: [j + 1],
              sorted: Array.from({ length: i }, (_, k) => k),
              arrayState: [...arr],
              description: `${arr[j]} > ${key}, shifting ${arr[j]} to index ${j + 1}.`,
            });
            arr[j + 1] = arr[j];
            j--;
          }
          arr[j + 1] = key;
          steps.push({
            compared: [j + 1],
            swapped: [j + 1],
            sorted: Array.from({ length: i + 1 }, (_, k) => k),
            arrayState: [...arr],
            description: `Placed key ${key} into position ${j + 1}.`,
          });
        }

        steps.push({
          compared: [],
          swapped: [],
          sorted: Array.from({ length: n }, (_, i) => i),
          arrayState: [...arr],
          description: 'Insertion Sort completed! Array is fully sorted.',
        });
      } else if (selectedAlgo === 'quick') {
        const arr = [...nums];
        const n = arr.length;
        steps.push({
          compared: [],
          swapped: [],
          sorted: [],
          arrayState: [...arr],
          description: 'Starting Quick Sort algorithm (Pivot Partitioning).',
        });

        const quickSortRecursive = (low: number, high: number) => {
          if (low >= high) return;
          const pivot = arr[high];
          steps.push({
            compared: [high],
            swapped: [],
            sorted: [],
            arrayState: [...arr],
            description: `Choosing pivot ${pivot} at index ${high} for range [${low}..${high}].`,
          });

          let i = low - 1;
          for (let j = low; j < high; j++) {
            steps.push({
              compared: [j, high],
              swapped: [],
              sorted: [],
              arrayState: [...arr],
              description: `Comparing element ${arr[j]} at index ${j} with pivot ${pivot}.`,
            });
            if (arr[j] < pivot) {
              i++;
              if (i !== j) {
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                steps.push({
                  compared: [i, j],
                  swapped: [i, j],
                  sorted: [],
                  arrayState: [...arr],
                  description: `Swapped ${arr[i]} at index ${i} and ${arr[j]} at index ${j}.`,
                });
              }
            }
          }
          const temp = arr[i + 1];
          arr[i + 1] = arr[high];
          arr[high] = temp;
          const pivotIdx = i + 1;
          steps.push({
            compared: [pivotIdx],
            swapped: [pivotIdx],
            sorted: [pivotIdx],
            arrayState: [...arr],
            description: `Placed pivot ${pivot} into its correct sorted position at index ${pivotIdx}.`,
          });

          quickSortRecursive(low, pivotIdx - 1);
          quickSortRecursive(pivotIdx + 1, high);
        };

        quickSortRecursive(0, n - 1);

        steps.push({
          compared: [],
          swapped: [],
          sorted: Array.from({ length: n }, (_, i) => i),
          arrayState: [...arr],
          description: 'Quick Sort completed! Array is fully sorted.',
        });
      } else if (selectedAlgo === 'merge') {
        const arr = [...nums];
        const n = arr.length;
        steps.push({
          compared: [],
          swapped: [],
          sorted: [],
          arrayState: [...arr],
          description: 'Starting Merge Sort algorithm (Divide & Conquer).',
        });

        const mergeSortRecursive = (left: number, right: number) => {
          if (left >= right) return;
          const mid = Math.floor((left + right) / 2);

          steps.push({
            compared: Array.from({ length: right - left + 1 }, (_, i) => left + i),
            swapped: [],
            sorted: [],
            arrayState: [...arr],
            description: `Dividing segment [indices ${left}..${right}] into left half [${left}..${mid}] and right half [${mid + 1}..${right}].`,
          });

          mergeSortRecursive(left, mid);
          mergeSortRecursive(mid + 1, right);

          steps.push({
            compared: Array.from({ length: right - left + 1 }, (_, i) => left + i),
            swapped: [],
            sorted: [],
            arrayState: [...arr],
            description: `Merging sorted sub-arrays [${left}..${mid}] and [${mid + 1}..${right}].`,
          });

          const leftArr = arr.slice(left, mid + 1);
          const rightArr = arr.slice(mid + 1, right + 1);
          let i = 0, j = 0, k = left;

          while (i < leftArr.length && j < rightArr.length) {
            const idxLeft = left + i;
            const idxRight = mid + 1 + j;
            steps.push({
              compared: [idxLeft, idxRight],
              swapped: [],
              sorted: [],
              arrayState: [...arr],
              description: `Comparing left element ${leftArr[i]} (idx ${idxLeft}) and right element ${rightArr[j]} (idx ${idxRight}).`,
            });

            if (leftArr[i] <= rightArr[j]) {
              arr[k] = leftArr[i];
              steps.push({
                compared: [k],
                swapped: [k],
                sorted: [],
                arrayState: [...arr],
                description: `Placing smaller element ${leftArr[i]} into index ${k}.`,
              });
              i++;
            } else {
              arr[k] = rightArr[j];
              steps.push({
                compared: [k],
                swapped: [k],
                sorted: [],
                arrayState: [...arr],
                description: `Placing smaller element ${rightArr[j]} into index ${k}.`,
              });
              j++;
            }
            k++;
          }

          while (i < leftArr.length) {
            arr[k] = leftArr[i];
            steps.push({
              compared: [k],
              swapped: [k],
              sorted: [],
              arrayState: [...arr],
              description: `Placing remaining left element ${leftArr[i]} into index ${k}.`,
            });
            i++;
            k++;
          }

          while (j < rightArr.length) {
            arr[k] = rightArr[j];
            steps.push({
              compared: [k],
              swapped: [k],
              sorted: [],
              arrayState: [...arr],
              description: `Placing remaining right element ${rightArr[j]} into index ${k}.`,
            });
            j++;
            k++;
          }
        };

        mergeSortRecursive(0, n - 1);

        steps.push({
          compared: [],
          swapped: [],
          sorted: Array.from({ length: n }, (_, i) => i),
          arrayState: [...arr],
          description: 'Merge Sort completed! Array is fully sorted.',
        });
      }

      setAlgoSteps(steps);
      setIsVisualizing(true);
      setIsPlaying(true);
    } else if (activeDS === 'linkedlist') {
      const target = searchValue.trim();
      if (!target) {
        alert('Please enter a search value in the input field!');
        return;
      }
      let steps: any[] = [];
      const visited: string[] = [];
      let found = false;

      for (let i = 0; i < elements.length; i++) {
        const curr = elements[i];
        visited.push(curr.id);
        if (curr.value === target) {
          found = true;
          steps.push({
            activeId: curr.id,
            visitedIds: [...visited],
            description: `Target element "${target}" found at node position n${i}!`,
          });
          break;
        } else {
          steps.push({
            activeId: curr.id,
            visitedIds: [...visited],
            description: `Checking node n${i} (value "${curr.value}") !== target "${target}". Moving to next pointer.`,
          });
        }
      }

      if (!found) {
        steps.push({
          activeId: null,
          visitedIds: [...visited],
          description: `Target element "${target}" was not found in the Linked List.`,
        });
      }

      setAlgoSteps(steps);
      setIsVisualizing(true);
      setIsPlaying(true);
    } else if (activeDS === 'tree') {
      let steps: any[] = [];
      const visited: string[] = [];
      const root = elements.find((n) => !n.parentId);

      if (!root) {
        alert('Tree has no root node!');
        return;
      }

      if (selectedAlgo === 'search') {
        const target = searchValue.trim();
        if (!target) {
          alert('Please enter a search key value!');
          return;
        }

        const searchBST = (nodeId: string) => {
          const node = elements.find((n) => n.id === nodeId);
          if (!node) return;

          visited.push(node.id);
          const nodeNum = parseInt(node.value, 10);
          const targetNum = parseInt(target, 10);

          if (node.value === target || nodeNum === targetNum) {
            steps.push({
              activeId: node.id,
              visitedIds: [...visited],
              description: `Found target key "${target}" at node ID ${node.id}!`,
            });
            return true;
          }

          steps.push({
            activeId: node.id,
            visitedIds: [...visited],
            description: `Inspecting node "${node.value}". ${
              !isNaN(targetNum) && !isNaN(nodeNum)
                ? targetNum < nodeNum
                  ? `Target ${targetNum} < ${nodeNum}, traversing Left branch.`
                  : `Target ${targetNum} > ${nodeNum}, traversing Right branch.`
                : 'Traversing child nodes.'
            }`,
          });

          const children = elements.filter((n) => n.parentId === nodeId);
          for (const child of children) {
            if (searchBST(child.id)) return true;
          }
          return false;
        };

        const found = searchBST(root.id);
        if (!found) {
          steps.push({
            activeId: null,
            visitedIds: [...visited],
            description: `Target key "${target}" not found in Binary Search Tree.`,
          });
        }
      } else {
        // Inorder / Preorder / Postorder Traversals
        const traverse = (nodeId: string) => {
          const node = elements.find((n) => n.id === nodeId);
          if (!node) return;

          const children = elements.filter((n) => n.parentId === nodeId);
          const left = children[0];
          const right = children[1];

          if (selectedAlgo === 'preorder') {
            visited.push(node.id);
            steps.push({
              activeId: node.id,
              visitedIds: [...visited],
              description: `Preorder Visit Node: "${node.value}".`,
            });
          }

          if (left) traverse(left.id);

          if (selectedAlgo === 'inorder') {
            visited.push(node.id);
            steps.push({
              activeId: node.id,
              visitedIds: [...visited],
              description: `Inorder Visit Node: "${node.value}".`,
            });
          }

          if (right) traverse(right.id);

          if (selectedAlgo === 'postorder') {
            visited.push(node.id);
            steps.push({
              activeId: node.id,
              visitedIds: [...visited],
              description: `Postorder Visit Node: "${node.value}".`,
            });
          }
        };

        traverse(root.id);
      }

      setAlgoSteps(steps);
      setIsVisualizing(true);
      setIsPlaying(true);
    } else if (activeDS === 'stack') {
      const expr = stackExprValue.trim();
      if (!expr) {
        alert('Please enter a bracket expression!');
        return;
      }

      let steps: any[] = [];
      let stack: string[] = [];
      const matchMap: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
      let isValid = true;

      for (let i = 0; i < expr.length; i++) {
        const char = expr[i];
        if (['(', '{', '['].includes(char)) {
          stack.push(char);
          steps.push({
            stack: [...stack],
            activeCharIdx: i,
            description: `Encountered opening bracket '${char}'. PUSH to stack.`,
            isValid: true,
          });
        } else if ([')', '}', ']'].includes(char)) {
          if (stack.length === 0 || stack[stack.length - 1] !== matchMap[char]) {
            isValid = false;
            steps.push({
              stack: [...stack],
              activeCharIdx: i,
              description: `Mismatched closing bracket '${char}'! Expected matching pair for '${stack[stack.length - 1] || 'None'}'. Invalid expression!`,
              isValid: false,
            });
            break;
          } else {
            const popped = stack.pop();
            steps.push({
              stack: [...stack],
              activeCharIdx: i,
              description: `Encountered closing bracket '${char}'. Matched with '${popped}'. POP from stack.`,
              isValid: true,
            });
          }
        }
      }

      if (isValid) {
        if (stack.length === 0) {
          steps.push({
            stack: [],
            activeCharIdx: expr.length,
            description: 'Expression completed! All brackets balanced successfully! 🎉',
            isValid: true,
          });
        } else {
          steps.push({
            stack: [...stack],
            activeCharIdx: expr.length,
            description: `Expression ended with unclosed brackets remaining in stack: [${stack.join(', ')}]. Unbalanced!`,
            isValid: false,
          });
        }
      }

      setAlgoSteps(steps);
      setIsVisualizing(true);
      setIsPlaying(true);
    }
  };

  const renderActiveWorkspace = () => {
    const currentStep = isVisualizing ? algoSteps[currentStepIdx] : null;

    switch (activeDS) {
      case 'array':
        return (
          <ArrayWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onEditValue={handleEditNodeValue}
            // @ts-ignore
            visualizationData={currentStep}
          />
        );
      case 'stack':
        return (
          <StackWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onEditValue={handleEditNodeValue}
            // @ts-ignore
            visualizationData={currentStep}
          />
        );
      case 'queue':
        return (
          <QueueWorkspace
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onEditValue={handleEditNodeValue}
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
    <div className="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans relative transition-colors duration-300">
      <Navbar onOpenAboutModal={() => setIsHowItWorksOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side Control Panel */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <Card className="flex flex-col gap-5 border-[var(--panel-border)]">
            <div className="flex items-center gap-1.5 border-b border-[var(--panel-border)] pb-3 transition-colors duration-300">
              <Sparkles className="w-4.5 h-4.5 text-[var(--btn-primary-bg)]" />
              <h3 className="font-bold text-sm text-[var(--text-main)] font-display transition-colors duration-300">
                Visualizer Panel
              </h3>
            </div>

            {/* Dropdown Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] transition-colors duration-300">
                Structure Type
              </label>
              <div className="relative flex items-center">
                <select
                  value={activeDS}
                  onChange={(e) => setActiveDS(e.target.value)}
                  disabled={isVisualizing}
                  className="w-full pl-3 pr-10 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] hover:border-[var(--btn-primary-bg)] text-[var(--input-text)] rounded-2xl text-sm font-bold focus:outline-none appearance-none cursor-pointer shadow-sm transition-all disabled:opacity-50"
                >
                  {dsOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[var(--panel-bg)] text-[var(--text-main)]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[var(--input-text)] absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Value Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] transition-colors duration-300">
                Input Element Value
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="Enter numbers or text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isVisualizing}
                className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] hover:border-[var(--btn-primary-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] rounded-2xl text-sm font-bold focus:outline-none shadow-sm transition-all disabled:opacity-50"
              />
            </div>

            {/* Operations Actions */}
            <div className="flex flex-col gap-2 border-t border-[var(--panel-border)] pt-4 transition-colors duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] transition-colors duration-300">
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
            <Card className="flex flex-col gap-4 border-[var(--panel-border)]">
              <div className="flex items-center gap-1.5 border-b border-[var(--panel-border)] pb-2 transition-colors duration-300">
                <Eye className="w-4 h-4 text-[var(--btn-primary-bg)]" />
                <h3 className="font-bold text-xs text-[var(--text-main)] font-display uppercase tracking-wider transition-colors duration-300">
                  DSA Algorithms
                </h3>
              </div>

              {activeDS === 'array' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-[var(--text-muted)] transition-colors duration-300">Sorting Algorithm</label>
                    <select
                      value={selectedAlgo}
                      onChange={(e) => setSelectedAlgo(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full pl-2 pr-8 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="bubble" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Bubble Sort</option>
                      <option value="selection" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Selection Sort</option>
                      <option value="insertion" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Insertion Sort</option>
                      <option value="quick" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Quick Sort</option>
                      <option value="merge" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Merge Sort</option>
                    </select>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleRunAlgorithm}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    disabled={isVisualizing}
                    className="w-full text-xs py-2"
                  >
                    Run Sort Algorithm
                  </Button>
                </div>
              )}

              {activeDS === 'tree' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-[var(--text-muted)] transition-colors duration-300">Tree Operation</label>
                    <select
                      value={selectedAlgo}
                      onChange={(e) => setSelectedAlgo(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full pl-2 pr-8 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="inorder" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Inorder Traversal</option>
                      <option value="preorder" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Preorder Traversal</option>
                      <option value="postorder" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Postorder Traversal</option>
                      <option value="search" className="bg-[var(--panel-bg)] text-[var(--text-main)]">BST Search Target</option>
                    </select>
                  </div>
                  {selectedAlgo === 'search' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-[var(--text-muted)] transition-colors duration-300">Search Value</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="Search key..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        disabled={isVisualizing}
                        className="w-full px-2.5 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] text-xs font-bold rounded-xl outline-none"
                      />
                    </div>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleRunAlgorithm}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    disabled={isVisualizing}
                    className="w-full text-xs py-2"
                  >
                    {selectedAlgo === 'search' ? 'Search Tree' : 'Run Traversal'}
                  </Button>
                </div>
              )}

              {activeDS === 'linkedlist' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-[var(--text-muted)] transition-colors duration-300">Search Value</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Search key..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full px-2.5 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] text-xs font-bold rounded-xl outline-none"
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleRunAlgorithm}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    disabled={isVisualizing}
                    className="w-full text-xs py-2"
                  >
                    Linear Search Node
                  </Button>
                </div>
              )}

              {activeDS === 'stack' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-[var(--text-muted)] transition-colors duration-300">Bracket Expression</label>
                    <input
                      type="text"
                      placeholder="e.g. {[()]}"
                      value={stackExprValue}
                      onChange={(e) => setStackExprValue(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full px-2.5 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] text-xs font-bold rounded-xl outline-none"
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleRunAlgorithm}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    disabled={isVisualizing}
                    className="w-full text-xs py-2"
                  >
                    Verify Bracket Balance
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Workspaces Persistence Panel */}
          <Card className="flex flex-col gap-4 border-[var(--panel-border)]">
            <div className="flex items-center gap-1.5 border-b border-[var(--panel-border)] pb-2 transition-colors duration-300">
              <FolderOpen className="w-4 h-4 text-[var(--btn-primary-bg)]" />
              <h3 className="font-bold text-xs text-[var(--text-main)] font-display uppercase tracking-wider transition-colors duration-300">
                Saved Workspaces
              </h3>
            </div>

            {/* Save Workspace Form */}
            <div className="flex flex-col gap-2 border-b border-[var(--panel-border)] pb-3 transition-colors duration-300">
              <label className="text-[9px] font-black uppercase text-[var(--text-muted)] transition-colors duration-300">Save Current Canvas</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Workspace name..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  disabled={isVisualizing}
                  className="flex-1 px-2.5 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] text-xs font-bold rounded-xl outline-none min-w-0"
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
              <label className="text-[9px] font-black uppercase text-[var(--text-muted)] transition-colors duration-300">Load Workspace</label>
              {workspaces.length === 0 ? (
                <div className="text-[10px] text-[var(--text-muted)] italic transition-colors duration-300">No workspaces saved.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="relative flex items-center">
                    <select
                      value={selectedWorkspaceId}
                      onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                      disabled={isVisualizing}
                      className="w-full pl-2 pr-8 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="" className="bg-[var(--panel-bg)] text-[var(--text-main)]">Select a workspace...</option>
                      {workspaces.map((ws) => (
                        <option key={ws.id} value={ws.id} className="bg-[var(--panel-bg)] text-[var(--text-main)]">
                          {ws.name} ({ws.dsType})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--input-text)] absolute right-2 pointer-events-none" />
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
          <div className="text-[11px] text-[var(--text-main)] bg-[var(--btn-secondary-bg)]/30 border border-[var(--btn-secondary-border)] rounded-3xl p-4 flex flex-col gap-1.5 shadow-sm transition-colors duration-300">
            <div className="font-bold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--btn-primary-bg)]" />
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
          <Card className="flex-1 border-[var(--panel-border)] relative overflow-hidden flex flex-col justify-between min-h-[460px] p-8 shadow-sm">
            {/* Visual Grid background details */}
            <div className="absolute inset-0 bg-canvas-grid-pattern opacity-100 pointer-events-none" />
            
            {/* Header info bar */}
            <div className="flex justify-between items-center border-b border-[var(--panel-border)] pb-3 relative z-10 transition-colors duration-300">
              <h4 className="text-base font-bold font-display text-[var(--text-main)] flex items-center gap-2 transition-colors duration-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--btn-primary-bg)] animate-pulse" />
                {dsOptions.find(opt => opt.value === activeDS)?.label} Canvas
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleRandomize()}
                  icon={<RefreshCw className="w-3.5 h-3.5 text-current" />}
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
                <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest transition-colors duration-300">Expression Scanning</span>
                <div className="flex gap-1.5 text-base font-bold font-mono">
                  {stackExprValue.split('').map((char, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                        i === currentStep.activeCharIdx
                          ? 'bg-[var(--node-selected-bg)] border-[var(--node-selected-border)] text-[var(--node-selected-text)] scale-110 shadow-md ring-2 ring-[var(--panel-border)]'
                          : i < currentStep.activeCharIdx
                          ? 'bg-[var(--input-bg)]/30 border-[var(--panel-border)]/30 text-[var(--text-muted)] line-through'
                          : 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--input-text)]'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded Active Canvas Workspace */}
            <div className="flex-1 flex items-start justify-center relative z-10 w-full pt-6">
              {renderActiveWorkspace()}
            </div>

            {/* Bottom status bar */}
            <div className="border-t border-[var(--panel-border)] pt-3 relative z-10 flex justify-between items-center text-xs text-[var(--text-main)] font-mono transition-colors duration-300">
              <div>
                Elements count: <span className="font-bold">{isVisualizing && activeDS === 'stack' && currentStep ? currentStep.stack.length : elements.length}</span>
              </div>
              <div>
                Selected Node: {selectedId && !isVisualizing ? (
                  <span className="text-[var(--node-selected-text)] font-bold bg-[var(--node-selected-bg)] px-2 py-0.5 rounded-md">
                    {elements.find(el => el.id === selectedId)?.value || 'None'}
                  </span>
                ) : (
                  <span className="text-[var(--text-muted)] font-bold">None</span>
                )}
              </div>
            </div>
          </Card>

          {/* Floating Algorithm Playback Controller Toolbar */}
          {isVisualizing && currentStep && (
            <Card className="border-[var(--panel-border-glow)] bg-[var(--panel-glow-bg)] shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center p-4 relative overflow-hidden z-20 transition-colors duration-300">
              {/* Active step number indicator */}
              <div className="absolute top-0 left-0 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-br-lg">
                Step {currentStepIdx + 1} of {algoSteps.length}
              </div>

              {/* Progress Bar background tracking */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--btn-primary-bg)]/20">
                <div
                  className="h-full bg-[var(--btn-primary-bg)] transition-all duration-300"
                  style={{ width: `${((currentStepIdx + 1) / algoSteps.length) * 100}%` }}
                />
              </div>

              {/* Narration and Logging */}
              <div className="flex-1 flex gap-2 items-center min-w-0 md:max-w-[45%]">
                <AlertCircle className="w-5 h-5 text-[var(--btn-primary-bg)] flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest leading-none transition-colors duration-300">Algorithm Log</span>
                  <p className="text-xs font-bold text-[var(--text-main)] truncate transition-colors duration-300" title={currentStep.description}>
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
                  className="p-3 rounded-full"
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
                  <span className="text-[7px] font-black uppercase text-[var(--text-muted)] tracking-wider mb-0.5 text-right transition-colors duration-300">Speed</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="pl-2 pr-6 py-1 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] rounded-lg text-[10px] font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="1500" className="bg-[var(--panel-bg)] text-[var(--text-main)]">0.5x Slow</option>
                    <option value="1000" className="bg-[var(--panel-bg)] text-[var(--text-main)]">1.0x Normal</option>
                    <option value="500" className="bg-[var(--panel-bg)] text-[var(--text-main)]">2.0x Fast</option>
                    <option value="250" className="bg-[var(--panel-bg)] text-[var(--text-main)]">4.0x Turbo</option>
                  </select>
                </div>

                <div className="h-8 w-[1px] bg-[var(--panel-border)] hidden md:block" />

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

      <footer className="border-t border-[var(--panel-border)] bg-[var(--panel-bg-95)] py-6 text-center text-xs text-[var(--text-muted)] font-mono transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[var(--btn-primary-bg)]" />
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
        <div className="flex flex-col gap-5 text-[var(--modal-body-text)]">
          <div className="flex items-center gap-3 bg-[var(--btn-secondary-bg)]/30 p-3.5 rounded-2xl border border-[var(--btn-secondary-border)]">
            <div className="w-9 h-9 bg-[var(--input-bg)] rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-[var(--btn-primary-bg)] fill-[var(--btn-primary-bg)]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--text-main)]">Whiteboard Sandbox Mechanics</h4>
              <p className="text-[11px] text-[var(--text-muted)] font-black">Manipulate nodes in real time just like Canva or Figma.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs leading-relaxed text-[var(--modal-body-text)]">
            <p>
              This app is designed to help you construct and manipulate standard data structures visually. Here's how you can play:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>
                <span className="font-bold text-[var(--text-main)]">Drag to Position:</span> In the Linked List and Tree view, you can drag circles freely inside the canvas. Connection lines adapt automatically!
              </li>
              <li>
                <span className="font-bold text-[var(--text-main)]">Drag to Reorder Array:</span> Drag any index box horizontally to reposition it in the array slots.
              </li>
              <li>
                <span className="font-bold text-[var(--text-main)]">Insert Anywhere (Array):</span> Select a box in the Array, enter a value, and click Add to insert a new element at that index.
              </li>
              <li>
                <span className="font-bold text-[var(--text-main)]">Build custom Trees:</span> Select a parent node, type a value, and click Add. The child connects automatically! To delete a subtree, select the parent node and click Delete.
              </li>
              <li>
                <span className="font-bold text-[var(--text-main)]">LIFO & FIFO Rules:</span> Push/Pop and Enqueue/Dequeue automatically animate values entering and exiting Stack and Queue layouts.
              </li>
            </ul>
          </div>

          <div className="border-t border-[var(--panel-border)] pt-4 flex justify-end">
            <button
              onClick={() => setIsHowItWorksOpen(false)}
              className="px-4 py-2 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Start Building
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainVisualizerApp />
    </ThemeProvider>
  );
}

export default App;
