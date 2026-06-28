import React from 'react';
import { motion } from 'framer-motion';
import {
  Grid,
  GitCommit,
  Layers,
  Repeat,
  GitBranch,
  Share2,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/Card';

interface CatalogPageProps {
  onSelectVisualizer: (id: string) => void;
}

interface CardItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: string;
  accent: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectVisualizer }) => {
  const cards: CardItem[] = [
    {
      id: 'arrays',
      title: 'Arrays',
      icon: Grid,
      description: 'Visualize array operations like insertion, deletion, and linear indexing, formatted as animated blocks.',
      badge: 'Basic',
      accent: 'from-blue-500/20 to-indigo-500/20 hover:border-blue-500/40',
    },
    {
      id: 'linkedlist',
      title: 'Linked List',
      icon: GitCommit,
      description: 'Visualize singly linked nodes with animated connections, node traversals, and structural mutations.',
      badge: 'Linear',
      accent: 'from-sky-500/20 to-cyan-500/20 hover:border-sky-500/40',
    },
    {
      id: 'stack',
      title: 'Stack',
      icon: Layers,
      description: 'Understand the Last-In-First-Out (LIFO) order with animated block pushes and pops on a vertical stack structure.',
      badge: 'Linear',
      accent: 'from-purple-500/20 to-pink-500/20 hover:border-purple-500/40',
    },
    {
      id: 'queue',
      title: 'Queue',
      icon: Repeat,
      description: 'Animate elements queueing in and out in a First-In-First-Out (FIFO) pipeline layout.',
      badge: 'Linear',
      accent: 'from-pink-500/20 to-rose-500/20 hover:border-pink-500/40',
    },
    {
      id: 'trees',
      title: 'Trees',
      icon: GitBranch,
      description: 'Explore hierarchically structured data inside a Binary Search Tree canvas, with live traversals and node inserting.',
      badge: 'Non-Linear',
      accent: 'from-emerald-500/20 to-teal-500/20 hover:border-emerald-500/40',
    },
    {
      id: 'graphs',
      title: 'Graphs',
      icon: Share2,
      description: 'Create custom graph maps. Trace pathways, vertices, and node relationships dynamically.',
      badge: 'Non-Linear',
      accent: 'from-amber-500/20 to-orange-500/20 hover:border-amber-500/40',
    },
    {
      id: 'sorting',
      title: 'Sorting',
      icon: BarChart3,
      description: 'Master bubble sort, selection sort, and quicksort steps by watching vertical height bars swap, compare, and lock.',
      badge: 'Algorithmic',
      accent: 'from-violet-500/20 to-fuchsia-500/20 hover:border-violet-500/40',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 120, damping: 18 },
    },
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Background Lights */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Title */}
      <div className="text-center md:text-left flex flex-col gap-2">
        <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-accent-blue font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Catalog</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white select-none">
          Data Structure & Algorithm Visualizers
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl leading-normal font-sans">
          Select a catalog item below to open the visualization environment and trace operations step-by-step.
        </p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cards.map((card) => {
          const IconComp = card.icon;
          return (
            <motion.div key={card.id} variants={cardVariants}>
              <Card
                hoverEffect
                onClick={() => onSelectVisualizer(card.id)}
                className={`flex flex-col justify-between h-full bg-gradient-to-br ${card.accent} border-white/5 hover:border-white/10`}
              >
                <div className="flex flex-col gap-4">
                  {/* Icon & Badge */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-center">
                      <IconComp className="w-6 h-6 text-accent-blue" />
                    </div>
                    {card.badge && (
                      <span className="text-[10px] font-extrabold font-sans uppercase tracking-wider text-zinc-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-bold text-white font-display select-none">
                      {card.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Learn More footer button */}
                <div className="mt-6 border-t border-white/5 pt-4 flex justify-between items-center text-xs text-zinc-400 font-semibold group-hover:text-white transition-all">
                  <span>Learn More</span>
                  <div className="flex items-center gap-1 text-accent-blue font-bold">
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
