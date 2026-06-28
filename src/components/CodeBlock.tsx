import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Basic regex highlights for dummy viewer
  const renderHighlightedCode = () => {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      // Very basic keyword syntax highlighting for a high-fidelity visual mock
      const highlighted = line
        .replace(/\b(const|let|var|function|return|for|while|if|else|class|new|extends|import|export|from)\b/g, '<span class="text-accent-pink font-semibold">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-amber-500 font-semibold">$1</span>')
        .replace(/(['"`].*?['"`])/g, '<span class="text-emerald-400">$1</span>')
        .replace(/(\/\/.*)/g, '<span class="text-zinc-500 font-normal italic">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-sky-400">$1</span>')
        .replace(/\b(swap|push|pop|insert|delete|traverse|search|sort|bfs|dfs|dijkstra)\b/gi, '<span class="text-accent-blue font-medium">$1</span>');

      return (
        <div key={idx} className="table-row">
          <span className="table-cell select-none text-right pr-4 text-zinc-600 text-xs w-6 font-mono font-medium">
            {idx + 1}
          </span>
          <span
            className="table-cell font-mono text-sm pl-2 break-all text-zinc-300"
            dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className={`relative rounded-xl border border-white/5 bg-[#09090c] overflow-hidden flex flex-col ${className}`}>
      <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-[#0c0c10]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider ml-2 font-semibold">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto select-text max-h-[300px] flex-1">
        <div className="table border-collapse w-full">
          {renderHighlightedCode()}
        </div>
      </div>
    </div>
  );
};
