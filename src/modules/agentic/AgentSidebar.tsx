import { useState } from 'react';
import { Send, X, Minimize2 } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useAgentPlatform } from '../../context/AgentPlatformProvider';

interface AgentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentSidebar({ isOpen, onClose }: AgentSidebarProps) {
  const { agents, activeAgent, setActiveAgent, conversationHistory } = useAgentStore();
  const { queryAgent } = useAgentPlatform();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !activeAgent) return;
    const query = input;
    setInput('');
    await queryAgent(activeAgent.name, query);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 transition-all duration-300 z-50 ${
      isMinimized ? 'w-16' : 'w-96'
    }`}>
      {isMinimized ? (
        <div className="p-4">
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            🤖
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-cyan-500">
            <h2 className="text-lg font-semibold text-white">Agent Assistant</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <Minimize2 className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgent(agent)}
                  className={`flex flex-col items-center p-2 rounded-lg transition ${
                    activeAgent?.id === agent.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-2xl mb-1">{agent.avatar}</span>
                  <span className="text-xs font-medium text-gray-700">{agent.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 220px)' }}>
            {conversationHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask ${activeAgent?.name || 'Agent'}...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
