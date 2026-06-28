import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { VisualizerContainer } from '../components/VisualizerContainer';
import { Button } from '../components/Button';

interface SortingVisualizerProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onPlayToggle: (playing: boolean) => void;
  onSelectCode: (code: string) => void;
  onSelectComplexity: (info: any) => void;
}

interface Step {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  description: string;
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  speed,
  onSpeedChange,
  isPlaying,
  onPlayToggle,
  onSelectCode,
  onSelectComplexity,
}) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const timerRef = useRef<any>(null);

  const bubbleSortCode = `// Bubble Sort Algorithm
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight comparison
      if (arr[j] > arr[j + 1]) {
        // Highlight swap
        swap(arr, j, j + 1);
      }
    }
    // Mark arr[n - i - 1] as sorted
  }
  return arr;
}`;

  const complexityInfo = {
    algorithmName: 'Bubble Sort',
    timeBest: 'O(n)',
    timeAverage: 'O(n²)',
    timeWorst: 'O(n²)',
    spaceWorst: 'O(1)',
  };

  // Generate random array
  const generateRandomArray = () => {
    onPlayToggle(false);
    const size = 15;
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * 85) + 15);
    }
    setCurrentStepIdx(0);
    calculateBubbleSortSteps(newArray);
  };

  // Pre-calculate steps for visual playback
  const calculateBubbleSortSteps = (startArray: number[]) => {
    const tempArray = [...startArray];
    const n = tempArray.length;
    const newSteps: Step[] = [];

    // Step 0: Initial State
    newSteps.push({
      array: [...tempArray],
      comparing: null,
      swapping: null,
      sorted: [],
      description: 'Initial randomized array generated.',
    });

    const sortedIndices: number[] = [];

    for (let i = 0; i < n; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        // Step A: Compare
        newSteps.push({
          array: [...tempArray],
          comparing: [j, j + 1],
          swapping: null,
          sorted: [...sortedIndices],
          description: `Comparing elements at index ${j} (${tempArray[j]}) and index ${j + 1} (${tempArray[j + 1]}).`,
        });

        if (tempArray[j] > tempArray[j + 1]) {
          // Swap
          const temp = tempArray[j];
          tempArray[j] = tempArray[j + 1];
          tempArray[j + 1] = temp;
          swapped = true;

          // Step B: Swap
          newSteps.push({
            array: [...tempArray],
            comparing: null,
            swapping: [j, j + 1],
            sorted: [...sortedIndices],
            description: `Swapped index ${j} and ${j + 1} since ${temp} > ${tempArray[j]}.`,
          });
        }
      }
      sortedIndices.unshift(n - i - 1);
      
      // Step C: Mark sorted
      newSteps.push({
        array: [...tempArray],
        comparing: null,
        swapping: null,
        sorted: [...sortedIndices],
        description: `Element at index ${n - i - 1} (${tempArray[n - i - 1]}) is in its final sorted position.`,
      });

      if (!swapped) {
        // If no swaps occurred, the rest is sorted
        for (let k = 0; k < n - i - 1; k++) {
          if (!sortedIndices.includes(k)) {
            sortedIndices.push(k);
          }
        }
        newSteps.push({
          array: [...tempArray],
          comparing: null,
          swapping: null,
          sorted: [...sortedIndices],
          description: 'No swaps occurred this pass; array is fully sorted!',
        });
        break;
      }
    }

    setSteps(newSteps);
  };

  useEffect(() => {
    generateRandomArray();
    onSelectCode(bubbleSortCode);
    onSelectComplexity(complexityInfo);
  }, []);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(200, 1500 / speed);
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            onPlayToggle(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, speed]);

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    onPlayToggle(false);
    setCurrentStepIdx(0);
  };

  const currentStep = steps[currentStepIdx] || {
    array: [],
    comparing: null,
    swapping: null,
    sorted: [],
    description: '',
  };

  return (
    <VisualizerContainer
      title="Sorting Algorithm Visualizer (Bubble Sort)"
      isPlaying={isPlaying}
      onPlayToggle={() => onPlayToggle(!isPlaying)}
      onStepForward={handleStepForward}
      onStepBackward={handleStepBackward}
      onReset={handleReset}
      speed={speed}
      onSpeedChange={onSpeedChange}
      controlsExtra={
        <Button
          variant="secondary"
          onClick={generateRandomArray}
          icon={<Shuffle className="w-4 h-4 text-accent-blue" />}
          className="px-4"
        >
          Shuffle Array
        </Button>
      }
    >
      <div className="flex flex-col gap-6 items-center w-full h-full p-6 justify-between">
        {/* Step description banner */}
        <div className="w-full text-center px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-zinc-300 font-medium max-w-xl shadow-sm">
          {currentStep.description}
        </div>

        {/* Visualizer Canvas Bars */}
        <div className="flex items-end justify-center gap-2.5 w-full max-w-2xl h-52 mt-4">
          <AnimatePresence mode="popLayout">
            {currentStep.array.map((value, idx) => {
              const isComparing = currentStep.comparing?.includes(idx);
              const isSwapping = currentStep.swapping?.includes(idx);
              const isSorted = currentStep.sorted.includes(idx);

              let barColor = 'bg-zinc-800 border-zinc-700/50';
              if (isComparing) barColor = 'bg-accent-blue border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
              if (isSwapping) barColor = 'bg-accent-pink border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]';
              if (isSorted) barColor = 'bg-emerald-500/80 border-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]';

              return (
                <motion.div
                  key={idx}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex flex-col items-center flex-1 max-w-[32px] group"
                >
                  <div
                    className={`w-full rounded-t-lg border transition-colors duration-150 ${barColor}`}
                    style={{ height: `${value * 1.6}px` }}
                  />
                  <span className="text-[10px] text-zinc-500 mt-2 font-mono font-bold">
                    {value}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </VisualizerContainer>
  );
};
