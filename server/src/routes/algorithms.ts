import { Router, Request, Response } from 'express';

const router = Router();

interface DSNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

// ----------------------------------------------------
// 1. ARRAY SORTING
// ----------------------------------------------------
interface SortStep {
  elements: DSNode[];
  compared: number[];
  swapped: number[];
  sorted: number[];
  description: string;
}

router.post('/array/sort', (req: Request, res: Response) => {
  const { elements, algorithm } = req.body;
  if (!Array.isArray(elements)) {
    return res.status(400).json({ error: 'Elements must be an array' });
  }

  const steps: SortStep[] = [];
  // Clone initial state
  let currentElements = [...elements];
  const n = currentElements.length;

  if (n === 0) {
    return res.json([]);
  }

  // Helper to parse values safely (numbers if possible, otherwise string comparison)
  const getVal = (node: DSNode) => {
    const num = Number(node.value);
    return isNaN(num) ? node.value : num;
  };

  // Push initial step
  steps.push({
    elements: JSON.parse(JSON.stringify(currentElements)),
    compared: [],
    swapped: [],
    sorted: [],
    description: 'Starting array sort...',
  });

  const sortedIndices: number[] = [];

  if (algorithm === 'selection') {
    // Selection Sort
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      // Mark selection start
      steps.push({
        elements: JSON.parse(JSON.stringify(currentElements)),
        compared: [i],
        swapped: [],
        sorted: [...sortedIndices],
        description: `Assuming index ${i} (value: ${currentElements[i].value}) is the minimum.`,
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          elements: JSON.parse(JSON.stringify(currentElements)),
          compared: [j, minIdx],
          swapped: [],
          sorted: [...sortedIndices],
          description: `Comparing elements at index ${j} (${currentElements[j].value}) and min index ${minIdx} (${currentElements[minIdx].value}).`,
        });

        if (getVal(currentElements[j]) < getVal(currentElements[minIdx])) {
          minIdx = j;
          steps.push({
            elements: JSON.parse(JSON.stringify(currentElements)),
            compared: [minIdx],
            swapped: [],
            sorted: [...sortedIndices],
            description: `New minimum found at index ${minIdx} (value: ${currentElements[minIdx].value}).`,
          });
        }
      }

      if (minIdx !== i) {
        // Swap
        const temp = currentElements[i];
        currentElements[i] = currentElements[minIdx];
        currentElements[minIdx] = temp;

        steps.push({
          elements: JSON.parse(JSON.stringify(currentElements)),
          compared: [i, minIdx],
          swapped: [i, minIdx],
          sorted: [...sortedIndices],
          description: `Swapping element at index ${i} with minimum at index ${minIdx}.`,
        });
      }

      sortedIndices.push(i);
      steps.push({
        elements: JSON.parse(JSON.stringify(currentElements)),
        compared: [],
        swapped: [],
        sorted: [...sortedIndices],
        description: `Element at index ${i} is now in its sorted position.`,
      });
    }
    sortedIndices.push(n - 1);
  } else {
    // Default to Bubble Sort
    let swappedAny;
    for (let i = 0; i < n - 1; i++) {
      swappedAny = false;
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          elements: JSON.parse(JSON.stringify(currentElements)),
          compared: [j, j + 1],
          swapped: [],
          sorted: [...sortedIndices],
          description: `Comparing element at index ${j} (${currentElements[j].value}) and index ${j + 1} (${currentElements[j + 1].value}).`,
        });

        if (getVal(currentElements[j]) > getVal(currentElements[j + 1])) {
          // Swap
          const temp = currentElements[j];
          currentElements[j] = currentElements[j + 1];
          currentElements[j + 1] = temp;
          swappedAny = true;

          steps.push({
            elements: JSON.parse(JSON.stringify(currentElements)),
            compared: [j, j + 1],
            swapped: [j, j + 1],
            sorted: [...sortedIndices],
            description: `Value ${currentElements[j + 1].value} > ${currentElements[j].value}. Swapping!`,
          });
        }
      }

      sortedIndices.push(n - 1 - i);
      steps.push({
        elements: JSON.parse(JSON.stringify(currentElements)),
        compared: [],
        swapped: [],
        sorted: [...sortedIndices],
        description: `Pass complete. Index ${n - 1 - i} is now in its sorted position.`,
      });

      if (!swappedAny) {
        steps.push({
          elements: JSON.parse(JSON.stringify(currentElements)),
          compared: [],
          swapped: [],
          sorted: Array.from({ length: n }, (_, idx) => idx),
          description: 'No swaps occurred in this pass. Array is fully sorted!',
        });
        break;
      }
    }
    // Mark all sorted
    for (let idx = 0; idx < n; idx++) {
      if (!sortedIndices.includes(idx)) sortedIndices.push(idx);
    }
  }

  // Final confirmation
  steps.push({
    elements: JSON.parse(JSON.stringify(currentElements)),
    compared: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    description: 'Array is sorted successfully.',
  });

  res.json(steps);
});

// ----------------------------------------------------
// 2. TREE TRAVERSALS
// ----------------------------------------------------
interface TreeStep {
  activeId: string | null;
  visitedIds: string[];
  description: string;
}

router.post('/tree/traverse', (req: Request, res: Response) => {
  const { elements, type } = req.body;
  if (!Array.isArray(elements)) {
    return res.status(400).json({ error: 'Elements must be an array' });
  }

  const steps: TreeStep[] = [];
  const visitedIds: string[] = [];

  // Find root
  const root = elements.find((node: DSNode) => !node.parentId);
  if (!root) {
    return res.status(400).json({ error: 'No root node found in tree' });
  }

  // Build child mappings. Sort children by X coordinate (Left child is lower X, Right is higher X)
  const getChildrenOf = (parentId: string) => {
    return elements
      .filter((n: DSNode) => n.parentId === parentId)
      .sort((a, b) => a.x - b.x);
  };

  steps.push({
    activeId: null,
    visitedIds: [],
    description: `Initiating ${type} traversal starting at root (value: ${root.value}).`,
  });

  const traverse = (node: DSNode) => {
    const children = getChildrenOf(node.id);
    const left = children[0];
    const right = children[1];

    if (type === 'preorder') {
      // Root -> Left -> Right
      visitedIds.push(node.id);
      steps.push({
        activeId: node.id,
        visitedIds: [...visitedIds],
        description: `Preorder visit node: ${node.value}`,
      });

      if (left) {
        steps.push({
          activeId: node.id,
          visitedIds: [...visitedIds],
          description: `Moving left from ${node.value} to ${left.value}`,
        });
        traverse(left);
      }
      if (right) {
        steps.push({
          activeId: node.id,
          visitedIds: [...visitedIds],
          description: `Moving right from ${node.value} to ${right.value}`,
        });
        traverse(right);
      }
    } else if (type === 'postorder') {
      // Left -> Right -> Root
      steps.push({
        activeId: node.id,
        visitedIds: [...visitedIds],
        description: `Traversing subtree under node: ${node.value}`,
      });

      if (left) {
        traverse(left);
      }
      if (right) {
        traverse(right);
      }

      visitedIds.push(node.id);
      steps.push({
        activeId: node.id,
        visitedIds: [...visitedIds],
        description: `Postorder visit node: ${node.value}`,
      });
    } else {
      // Default: Inorder (Left -> Root -> Right)
      steps.push({
        activeId: node.id,
        visitedIds: [...visitedIds],
        description: `Traversing left subtree under node: ${node.value}`,
      });

      if (left) {
        traverse(left);
      }

      visitedIds.push(node.id);
      steps.push({
        activeId: node.id,
        visitedIds: [...visitedIds],
        description: `Inorder visit node: ${node.value}`,
      });

      if (right) {
        steps.push({
          activeId: node.id,
          visitedIds: [...visitedIds],
          description: `Moving right from ${node.value} to ${right.value}`,
        });
        traverse(right);
      }
    }
  };

  traverse(root);

  steps.push({
    activeId: null,
    visitedIds: [...visitedIds],
    description: `Finished ${type} traversal! Visited order: ${visitedIds.map(id => elements.find(n => n.id === id)?.value).join(' -> ')}`,
  });

  res.json(steps);
});

// ----------------------------------------------------
// 3. TREE SEARCH (BST Search)
// ----------------------------------------------------
router.post('/tree/search', (req: Request, res: Response) => {
  const { elements, target } = req.body;
  if (!Array.isArray(elements) || !target) {
    return res.status(400).json({ error: 'Missing elements array or target' });
  }

  const steps: TreeStep[] = [];
  const visitedIds: string[] = [];
  const root = elements.find((node: DSNode) => !node.parentId);

  if (!root) {
    return res.status(400).json({ error: 'No root node found in tree' });
  }

  const targetVal = Number(target);
  const isNumeric = !isNaN(targetVal);

  const getChildrenOf = (parentId: string) => {
    return elements
      .filter((n: DSNode) => n.parentId === parentId)
      .sort((a, b) => a.x - b.x);
  };

  let current: DSNode | undefined = root;
  let found = false;

  steps.push({
    activeId: null,
    visitedIds: [],
    description: `Starting BST search for value: "${target}" starting at root.`,
  });

  while (current) {
    const curValStr = current.value;
    const curValNum = Number(curValStr);
    const isCurNumeric = !isNaN(curValNum);

    visitedIds.push(current.id);
    steps.push({
      activeId: current.id,
      visitedIds: [...visitedIds],
      description: `Comparing target "${target}" with current node "${curValStr}".`,
    });

    if (curValStr === target || (isNumeric && isCurNumeric && curValNum === targetVal)) {
      found = true;
      steps.push({
        activeId: current.id,
        visitedIds: [...visitedIds],
        description: `Match found! Value "${target}" exists at node.`,
      });
      break;
    }

    const children = getChildrenOf(current.id);
    const left = children[0];
    const right = children[1];

    // Branch decision
    let goLeft = false;
    if (isNumeric && isCurNumeric) {
      goLeft = targetVal < curValNum;
    } else {
      goLeft = target.localeCompare(curValStr) < 0;
    }

    if (goLeft) {
      if (left) {
        steps.push({
          activeId: current.id,
          visitedIds: [...visitedIds],
          description: `Target "${target}" is less than "${curValStr}". Going left.`,
        });
        current = left;
      } else {
        steps.push({
          activeId: current.id,
          visitedIds: [...visitedIds],
          description: `Target "${target}" is less than "${curValStr}" but no left child exists.`,
        });
        current = undefined;
      }
    } else {
      if (right) {
        steps.push({
          activeId: current.id,
          visitedIds: [...visitedIds],
          description: `Target "${target}" is greater than or equal to "${curValStr}". Going right.`,
        });
        current = right;
      } else {
        steps.push({
          activeId: current.id,
          visitedIds: [...visitedIds],
          description: `Target "${target}" is greater than or equal to "${curValStr}" but no right child exists.`,
        });
        current = undefined;
      }
    }
  }

  if (!found) {
    steps.push({
      activeId: null,
      visitedIds: [...visitedIds],
      description: `Search completed. Value "${target}" was not found in the tree.`,
    });
  }

  res.json(steps);
});

// ----------------------------------------------------
// 4. LINKED LIST SEARCH
// ----------------------------------------------------
router.post('/linkedlist/search', (req: Request, res: Response) => {
  const { elements, target } = req.body;
  if (!Array.isArray(elements) || !target) {
    return res.status(400).json({ error: 'Missing elements array or target' });
  }

  const steps: TreeStep[] = [];
  const visitedIds: string[] = [];
  let found = false;

  steps.push({
    activeId: null,
    visitedIds: [],
    description: `Initiating linear search for value: "${target}" in Linked List.`,
  });

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    visitedIds.push(el.id);
    
    steps.push({
      activeId: el.id,
      visitedIds: [...visitedIds],
      description: `Inspecting Node index ${i} (value: "${el.value}").`,
    });

    if (el.value === target) {
      found = true;
      steps.push({
        activeId: el.id,
        visitedIds: [...visitedIds],
        description: `Found target value "${target}" at Node index ${i}!`,
      });
      break;
    } else {
      steps.push({
        activeId: el.id,
        visitedIds: [...visitedIds],
        description: `Value "${el.value}" does not match target. Following next pointer.`,
      });
    }
  }

  if (!found) {
    steps.push({
      activeId: null,
      visitedIds: [...visitedIds],
      description: `Linear search complete. Value "${target}" not found in Linked List.`,
    });
  }

  res.json(steps);
});

// ----------------------------------------------------
// 5. STACK BRACKET BALANCE
// ----------------------------------------------------
interface StackStep {
  stack: string[];
  activeCharIdx: number;
  description: string;
  isValid: boolean;
}

router.post('/stack/balance', (req: Request, res: Response) => {
  const { expression } = req.body;
  if (typeof expression !== 'string') {
    return res.status(400).json({ error: 'Expression must be a string' });
  }

  const steps: StackStep[] = [];
  const stack: string[] = [];
  let isValid = true;

  steps.push({
    stack: [],
    activeCharIdx: -1,
    description: `Starting bracket balancing verification on expression: "${expression}"`,
    isValid: true,
  });

  const matchingBrackets: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '[',
  };

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
      steps.push({
        stack: [...stack],
        activeCharIdx: i,
        description: `Opening bracket "${char}" found. Push to stack.`,
        isValid: true,
      });
    } else if ([')', '}', ']'].includes(char)) {
      const top = stack.pop();
      if (top === matchingBrackets[char]) {
        steps.push({
          stack: [...stack],
          activeCharIdx: i,
          description: `Closing bracket "${char}" matches top of stack "${top}". Pop from stack.`,
          isValid: true,
        });
      } else {
        isValid = false;
        steps.push({
          stack: top ? [...stack, top] : [...stack],
          activeCharIdx: i,
          description: `Mismatch: closing bracket "${char}" does not match top of stack "${top || 'empty'}". Balancing failed.`,
          isValid: false,
        });
        break;
      }
    } else {
      // Non-bracket char
      steps.push({
        stack: [...stack],
        activeCharIdx: i,
        description: `Non-bracket character "${char}" ignored.`,
        isValid: true,
      });
    }
  }

  if (isValid && stack.length > 0) {
    isValid = false;
    steps.push({
      stack: [...stack],
      activeCharIdx: expression.length - 1,
      description: `Parsing complete, but stack is not empty (remaining: ${stack.join(', ')}). Balancing failed.`,
      isValid: false,
    });
  } else if (isValid) {
    steps.push({
      stack: [],
      activeCharIdx: expression.length,
      description: `All brackets matched successfully! Expression is balanced.`,
      isValid: true,
    });
  }

  res.json(steps);
});

export default router;
