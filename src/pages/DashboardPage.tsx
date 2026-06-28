import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ComplexityCard } from '../components/ComplexityCard';
import { CodeBlock } from '../components/CodeBlock';
import { SortingVisualizer } from './SortingVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { LinearDSVisualizer } from './LinearDSVisualizer';

interface DashboardPageProps {
  activeVisualizer: string;
  onSelectVisualizer: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activeVisualizer,
  onSelectVisualizer,
}) => {
  const [speed, setSpeed] = useState<number>(1.5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeCode, setActiveCode] = useState<string>('');
  const [activeComplexity, setActiveComplexity] = useState<any>({
    algorithmName: '',
    timeBest: '',
    timeAverage: '',
    timeWorst: '',
    spaceWorst: '',
  });

  const handleSelectVisualizer = (id: string) => {
    setIsPlaying(false);
    onSelectVisualizer(id);
  };

  const handlePlayToggle = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const renderVisualizerCanvas = () => {
    switch (activeVisualizer) {
      case 'sorting':
        return (
          <SortingVisualizer
            speed={speed}
            onSpeedChange={setSpeed}
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
            onSelectCode={setActiveCode}
            onSelectComplexity={setActiveComplexity}
          />
        );
      case 'trees':
        return (
          <TreeVisualizer
            speed={speed}
            onSpeedChange={setSpeed}
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
            onSelectCode={setActiveCode}
            onSelectComplexity={setActiveComplexity}
          />
        );
      case 'graphs':
      case 'graph-algorithms':
        return (
          <GraphVisualizer
            speed={speed}
            onSpeedChange={setSpeed}
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
            onSelectCode={setActiveCode}
            onSelectComplexity={setActiveComplexity}
          />
        );
      case 'arrays':
      case 'linkedlist':
      case 'stack':
      case 'queue':
      case 'searching':
        return (
          <LinearDSVisualizer
            type={activeVisualizer}
            speed={speed}
            onSpeedChange={setSpeed}
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
            onSelectCode={setActiveCode}
            onSelectComplexity={setActiveComplexity}
          />
        );
      default:
        return (
          <div className="h-96 flex items-center justify-center text-zinc-500 font-mono">
            Select a data structure or algorithm to begin.
          </div>
        );
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6 min-h-[calc(100vh-4rem)]">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-10 w-[200px] h-[200px] bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[250px] h-[250px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Left Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar
          activeVisualizer={activeVisualizer}
          onSelectVisualizer={handleSelectVisualizer}
        />
      </div>

      {/* Main Workspace (Visualizer on top, specs and code side-by-side underneath) */}
      <div className="flex-1 flex flex-col gap-6">
        {renderVisualizerCanvas()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Complexity specs */}
          <div className="lg:col-span-5 flex flex-col">
            <ComplexityCard
              algorithmName={activeComplexity.algorithmName}
              timeBest={activeComplexity.timeBest}
              timeAverage={activeComplexity.timeAverage}
              timeWorst={activeComplexity.timeWorst}
              spaceWorst={activeComplexity.spaceWorst}
              className="h-full"
            />
          </div>

          {/* Dynamic code viewer */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black font-sans px-1">
              Implementation Trace
            </span>
            <CodeBlock code={activeCode} language="javascript" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
