import React from 'react';
import { Cpu, HelpCircle } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  onOpenAboutModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAboutModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#a38deb] bg-[#bdabfc]/95 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Title and Logo */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-2xl bg-[#4c258d] flex items-center justify-center shadow-md">
            <Cpu className="w-5.5 h-5.5 text-[#ece8ff]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black font-display tracking-wide text-[#250d4f] flex items-center gap-1.5 leading-none">
              DSA <span className="text-[#4c258d] font-semibold">Visualizer</span>
            </h1>
            <p className="text-xs text-[#4c258d]/80 font-bold font-display mt-0.5">
              Build and Understand Data Structures
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3.5">
          <Button
            variant="secondary"
            onClick={onOpenAboutModal}
            icon={<HelpCircle className="w-4 h-4 text-[#250d4f]" />}
            className="px-4 py-1.5 rounded-xl border-[#947deb]"
          >
            How it works
          </Button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#250d4f] hover:text-[#4c258d] p-2 rounded-xl hover:bg-[#a28ceb]/30 transition-all border border-transparent hover:border-[#947deb]"
            title="GitHub Repository"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
