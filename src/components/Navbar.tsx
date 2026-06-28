import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Sun, Moon, Cpu } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onOpenAboutModal: () => void;
  activeTheme: 'cyber-purple' | 'cyber-emerald';
  onThemeToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onPageChange,
  onOpenAboutModal,
  activeTheme,
  onThemeToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { id: 'landing', label: 'Home' },
    { id: 'catalog', label: 'Visualizers' },
    { id: 'dashboard', label: 'Algorithms' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 bg-[#030303]/75 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onPageChange('landing')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300">
            <Cpu className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-extrabold text-lg text-white font-display tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400 group-hover:to-accent-blue transition-all duration-300">
            DSA <span className="text-accent-blue font-light">Visualizer</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = currentPage === link.id || (link.id === 'dashboard' && ['sorting', 'tree', 'graph'].includes(currentPage));
            return (
              <button
                key={link.id}
                onClick={() => onPageChange(link.id)}
                className="relative px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer select-none"
              >
                <span className={isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}>
                  {link.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          
          <button
            onClick={onOpenAboutModal}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl border border-white/5 bg-zinc-950 text-zinc-400 hover:text-white hover:border-white/10 transition-all cursor-pointer flex items-center justify-center relative overflow-hidden"
            title="Toggle theme accent"
          >
            <motion.div
              initial={false}
              animate={{ rotate: activeTheme === 'cyber-purple' ? 0 : 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {activeTheme === 'cyber-purple' ? (
                <Moon className="w-4 h-4 text-accent-purple" />
              ) : (
                <Sun className="w-4 h-4 text-accent-blue" />
              )}
            </motion.div>
          </button>

          {/* GitHub button or Dashboard CTA */}
          <Button
            variant="secondary"
            onClick={() => onPageChange('catalog')}
            className="hidden sm:inline-flex"
            icon={<Activity className="w-4 h-4 text-accent-blue" />}
          >
            Explore
          </Button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/5 bg-[#030303] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
              {links.map((link) => {
                const isActive = currentPage === link.id || (link.id === 'dashboard' && ['sorting', 'tree', 'graph'].includes(currentPage));
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onPageChange(link.id);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                      isActive ? 'bg-white/5 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              
              <button
                onClick={() => {
                  onOpenAboutModal();
                  setIsOpen(false);
                }}
                className="px-3 py-2.5 rounded-xl text-left text-sm font-medium text-zinc-400 hover:text-white transition-all"
              >
                About
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
