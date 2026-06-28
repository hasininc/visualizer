import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { DashboardPage } from './pages/DashboardPage';
import { Modal } from './components/Modal';
import { Terminal, Heart, Cpu, ShieldCheck } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [activeVisualizer, setActiveVisualizer] = useState<string>('sorting');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [activeTheme, setActiveTheme] = useState<'cyber-purple' | 'cyber-emerald'>('cyber-purple');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleSelectVisualizer = (id: string) => {
    setActiveVisualizer(id);
    setCurrentPage('dashboard');
  };

  const handleThemeToggle = () => {
    const nextTheme = activeTheme === 'cyber-purple' ? 'cyber-emerald' : 'cyber-purple';
    setActiveTheme(nextTheme);
    
    // Dynamically update CSS variables on root node to change theme values instantly
    if (nextTheme === 'cyber-emerald') {
      document.documentElement.style.setProperty('--color-accent-blue', '#06b6d4'); // Cyan
      document.documentElement.style.setProperty('--color-accent-purple', '#10b981'); // Emerald
    } else {
      document.documentElement.style.setProperty('--color-accent-blue', '#3b82f6'); // Blue
      document.documentElement.style.setProperty('--color-accent-purple', '#8b5cf6'); // Purple
    }
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handlePageChange} />;
      case 'catalog':
        return <CatalogPage onSelectVisualizer={handleSelectVisualizer} />;
      case 'dashboard':
        return (
          <DashboardPage
            activeVisualizer={activeVisualizer}
            onSelectVisualizer={setActiveVisualizer}
          />
        );
      default:
        return <LandingPage onNavigate={handlePageChange} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030303] text-gray-200">
      {/* Sticky Glass Navbar */}
      <Navbar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onOpenAboutModal={() => setIsAboutOpen(true)}
        activeTheme={activeTheme}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {renderActivePage()}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050508]/80 py-6 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-accent-blue" />
            <span>DSA Visualizer Workspace v1.0.0</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            <span>for Software Portfolios</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="GitHub Project">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About DSA Visualizer"
        size="md"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="p-2 bg-accent-blue/10 rounded-lg">
              <Terminal className="w-5 h-5 text-accent-blue" />
            </div>
            <div>
              <h4 className="text-white font-bold font-display text-sm">Interactive Sandbox Engine</h4>
              <p className="text-[11px] text-zinc-400">Step-by-step memory tracers for computer science concepts.</p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            DSA Visualizer is a premium developer-portfolio-quality tool built to demystify complex data structures and algorithmic loops. It presents real-time visualizations for sorting steps, binary trees, network grids, and linear arrays.
          </p>

          <div className="border-t border-white/5 pt-4">
            <h5 className="text-white font-semibold text-xs mb-2">Stack Details:</h5>
            <ul className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-purple" />
                React 19 & TypeScript
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-purple" />
                Tailwind CSS v4 (native)
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-purple" />
                Framer Motion physics
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-purple" />
                Lucide Vector SVG Icons
              </li>
            </ul>
          </div>

          <div className="border-t border-white/5 pt-4 flex justify-end">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold cursor-pointer border border-white/5 transition-all"
            >
              Close Panel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
