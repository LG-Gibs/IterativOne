import { useState, useEffect } from 'react';
import { Search, Zap, Brain } from 'lucide-react';
import { useAgentPlatform } from '../../context/AgentPlatformProvider';

interface OmniboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Omnibox({ isOpen, onClose }: OmniboxProps) {
  const { executeCommand } = useAgentPlatform();
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (input.startsWith('?')) {
      const query = input.slice(1).toLowerCase();
      setSuggestions([
        '?mba - Financial analysis',
        '?cfa - Investment research',
        '?cra - Risk assessment',
        '?pba - Requirements analysis',
        '?cofounder - Strategic planning',
      ].filter(s => s.includes(query)));
    } else if (input.startsWith('/')) {
      setSuggestions([
        '/partner-hub - Open Partner Hub',
        '/boardroom - Open Research Repository',
        '/browser - Open Browser Demo',
      ].filter(s => s.toLowerCase().includes(input.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleCommand = async (cmd: string) => {
    await executeCommand(cmd);
    setInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input) {
                  handleCommand(input);
                  setInput('');
                }
              }}
              placeholder="Search web, run commands, or ask agents... (? for agents, / for navigation)"
              className="flex-1 outline-none text-lg"
              autoFocus
            />
            <div className="flex gap-2">
              <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Ctrl</kbd>
              <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">K</kbd>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(suggestion.split(' -')[0]);
                    handleCommand(suggestion.split(' -')[0]);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition flex items-center gap-3"
                >
                  {suggestion.startsWith('?') ? (
                    <Brain className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Zap className="w-5 h-5 text-purple-500" />
                  )}
                  <span className="text-sm text-gray-900">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">?</kbd>
                <span>Ask Agent</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">/</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↵</kbd>
                <span>Web Search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
