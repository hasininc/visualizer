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
  Search,
  Network
} from 'lucide-react';

interface SidebarProps {
  activeVisualizer: string;
  onSelectVisualizer: (id: string) => void;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeVisualizer,
  onSelectVisualizer,
  className = '',
}) => {
  const menuGroups: MenuGroup[] = [
    {
      title: 'Data Structures',
      items: [
        { id: 'arrays', label: 'Arrays', icon: Grid },
        { id: 'linkedlist', label: 'Linked List', icon: GitCommit },
        { id: 'stack', label: 'Stack', icon: Layers },
        { id: 'queue', label: 'Queue', icon: Repeat },
        { id: 'trees', label: 'Trees', icon: GitBranch },
        { id: 'graphs', label: 'Graphs', icon: Share2 },
      ],
    },
    {
      title: 'Algorithms',
      items: [
        { id: 'sorting', label: 'Sorting', icon: BarChart3 },
        { id: 'searching', label: 'Searching', icon: Search },
        { id: 'graph-algorithms', label: 'Graph Algorithms', icon: Network },
      ],
    },
  ];

  return (
    <aside className={`w-full md:w-64 glass-panel border border-white/5 rounded-2xl p-4 flex flex-col gap-6 ${className}`}>
      {menuGroups.map((group, gIdx) => (
        <div key={group.title} className="flex flex-col gap-2">
          {/* Header */}
          <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-black font-sans px-3">
            {group.title}
          </h4>
          
          {/* List items */}
          <div className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = activeVisualizer === item.id;
              const IconComponent = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectVisualizer(item.id)}
                  className={`
                    relative w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    flex items-center gap-3 cursor-pointer select-none group overflow-hidden
                    ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}
                  `}
                >
                  <IconComponent className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-accent-blue' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`} />
                  
                  <span className="relative z-10 flex-1">{item.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarTab"
                      className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border-l-2 border-accent-blue -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Spacer between groups */}
          {gIdx < menuGroups.length - 1 && (
            <div className="border-b border-white/5 my-1" />
          )}
        </div>
      ))}
    </aside>
  );
};
