
import { useState } from 'react';
import BrowserMockup from '../components/BrowserMockup';
import { ArrowLeft, Settings, Zap, Plug } from 'lucide-react';

export default function BrowserDemo() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [apiUrl, setApiUrl] = useState('http://localhost:9222');
  const [wsUrl, setWsUrl] = useState('ws://localhost:9223');
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            <span>Back to Home</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-lg shadow-sm p-1 border border-gray-200">
              <button
                onClick={() => setMode('demo')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'demo'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Demo Mode
                </div>
              </button>
              <button
                onClick={() => setMode('live')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'live'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Plug className="w-4 h-4" />
                  Live Mode
                </div>
              </button>
            </div>

            {mode === 'live' && (
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {mode === 'live' && showConfig && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Chromium API Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API URL (REST Endpoint)
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="http://localhost:9222"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The HTTP endpoint for your Chromium instance API
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WebSocket URL
                </label>
                <input
                  type="text"
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ws://localhost:9223"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The WebSocket endpoint for real-time updates
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            IterativOne Browser Interface
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {mode === 'demo'
              ? 'Experience the interactive demo with simulated browser controls and tab management.'
              : 'Connect to a live Chromium instance to control an actual browser remotely.'}
          </p>
        </div>

        <BrowserMockup mode={mode} apiUrl={mode === 'live' ? apiUrl : undefined} wsUrl={mode === 'live' ? wsUrl : undefined} />

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Dynamic Themes</h3>
            <p className="text-gray-600 text-sm">
              Toggle between light and dark modes instantly with smooth transitions
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Floating Media</h3>
            <p className="text-gray-600 text-sm">
              Detachable music player that follows you across all tabs
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📑</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Tabs</h3>
            <p className="text-gray-600 text-sm">
              Visual tab management with emoji icons and audio indicators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
