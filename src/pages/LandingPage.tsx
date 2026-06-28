import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Terminal, Sparkles, Cpu, BarChart3, Binary } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
    },
  };

  const codeSnippet = `// Depth-First Search Implementation
function dfs(node, visited = new Set()) {
  if (visited.has(node.id)) return;
  visited.add(node.id);
  highlightNode(node.id); // Animation hook
  
  for (const neighbor of node.neighbors) {
    dfs(neighbor, visited);
  }
}`;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between overflow-hidden">
      {/* Absolute Ambient Background Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/15 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-purple/15 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0" />

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1"
      >
        {/* Left Side text */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center self-center lg:self-start gap-1.5 px-3 py-1 rounded-full border border-accent-blue/30 bg-accent-blue/5 text-xs text-accent-blue font-bold tracking-wide"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Platform</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white leading-[1.1] select-none"
          >
            Visualize <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue via-indigo-400 to-accent-purple">Data Structures</span>.
            <br />
            Master <span className="text-zinc-100 font-light">Algorithms</span>.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
          >
            Interactive, step-by-step modular animations designed to simplify complex algorithms and data structures. Perfect for visual learners.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-4"
          >
            <Button
              variant="primary"
              onClick={() => onNavigate('catalog')}
              icon={<Play className="w-4 h-4 text-white fill-white" />}
              className="px-8 py-3 text-base shadow-[0_0_25px_rgba(59,130,246,0.25)]"
            >
              Start Visualizing
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate('dashboard')}
              icon={<BookOpen className="w-4 h-4" />}
              className="px-8 py-3 text-base"
            >
              Explore Algorithms
            </Button>
          </motion.div>
        </div>

        {/* Right Side: Animated Code snippet / visual container mockup */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 relative w-full flex items-center justify-center"
        >
          {/* Floating animated elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full max-w-md z-10"
          >
            <Card className="glass-panel border-white/10 p-0 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0d] border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-accent-blue" />
                  <span className="text-xs font-mono font-bold text-zinc-300">DFS_Traversal.js</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <div className="p-4 bg-[#050507]">
                <pre className="text-left font-mono text-xs overflow-x-auto text-zinc-400">
                  <code className="leading-relaxed">
                    {codeSnippet.split('\n').map((line, i) => {
                      const isHighlighted = line.includes('highlightNode');
                      return (
                        <div
                          key={i}
                          className={`${
                            isHighlighted ? 'bg-accent-blue/10 border-l-2 border-accent-blue pl-2 -ml-2 py-0.5 text-accent-blue' : ''
                          }`}
                        >
                          {line}
                        </div>
                      );
                    })}
                  </code>
                </pre>
              </div>
            </Card>
          </motion.div>

          {/* Background decoration: nodes connected floating behind code card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="relative w-72 h-72 rounded-full border border-white/5 border-dashed"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-accent-blue/50 blur-[2px] flex items-center justify-center text-[10px] text-white font-bold font-mono">
                A
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-accent-purple/50 blur-[2px] flex items-center justify-center text-[10px] text-white font-bold font-mono">
                B
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-accent-pink/50 blur-[2px] flex items-center justify-center text-[10px] text-white font-bold font-mono">
                C
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500/50 blur-[2px] flex items-center justify-center text-[10px] text-white font-bold font-mono">
                D
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <div className="w-full bg-[#050507]/90 border-t border-white/5 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-4 px-6"
            >
              <div className="p-3.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
                <Binary className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <h4 className="text-3xl font-black font-display text-white tracking-tight">50+</h4>
                <p className="text-sm text-zinc-400 font-medium">Supported Algorithms</p>
              </div>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-4 px-6 border-t md:border-t-0 md:border-x border-white/5 py-6 md:py-0"
            >
              <div className="p-3.5 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h4 className="text-3xl font-black font-display text-white tracking-tight">10+</h4>
                <p className="text-sm text-zinc-400 font-medium">Data Structures</p>
              </div>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex items-center gap-4 px-6"
            >
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-3xl font-black font-display text-white tracking-tight">100%</h4>
                <p className="text-sm text-zinc-400 font-medium">Interactive Visualizations</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
