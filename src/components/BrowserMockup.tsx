
import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Home,
  Star,
  Lock,
  Search,
  Plus,
  X,
  Music,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Settings,
  User,
  Sparkles,
} from 'lucide-react';
import { useBrowserController } from '../hooks/useBrowserController';

interface BrowserMockupProps {
  mode?: 'demo' | 'live';
  apiUrl?: string;
  wsUrl?: string;
}

export default function BrowserMockup({ mode = 'demo', apiUrl, wsUrl }: BrowserMockupProps) {
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [localAddressBar, setLocalAddressBar] = useState('');

  const {
    tabs,
    activeTab,
    addressBar,
    isLoading,
    connectionStatus,
    createTab,
    closeTab,
    switchTab,
    navigate,
    toggleMute,
    reconnect,
  } = useBrowserController({ mode, apiUrl, wsUrl });

  useEffect(() => {
    setLocalAddressBar(addressBar);
  }, [addressBar]);

  const handleNavigate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(localAddressBar);
    }
  };

  const handleCloseTab = async (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await closeTab(tabId);
  };

  const handleToggleMute = async (tabId: string, currentMuted: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleMute(tabId, !currentMuted);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Connection Status Bar (only in live mode) */}
      {mode === 'live' && (
        <div className="mb-4 flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-500'
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {connectionStatus === 'connected'
                ? 'Connected to Chromium'
                : connectionStatus === 'connecting'
                ? 'Connecting...'
                : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={reconnect}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Reconnect
          </button>
        </div>
      )}

      <div
        className={`rounded-2xl shadow-2xl overflow-hidden border-2 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        {/* Browser Window Controls */}
        <div
          className={`flex items-center justify-between px-4 py-2 border-b ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div
          className={`flex items-center px-2 py-1 border-b ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex-1 flex items-center space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg cursor-pointer transition group min-w-[180px] ${
                  tab.isActive
                    ? isDarkMode
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => switchTab(tab.id)}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-xs flex-1 truncate">{tab.title}</span>
                {tab.hasAudio && (
                  <button
                    onClick={(e) => handleToggleMute(tab.id, tab.isMuted || false, e)}
                    className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-0.5"
                  >
                    {tab.isMuted ? (
                      <VolumeX className="w-3 h-3 text-gray-500" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-blue-500 animate-pulse" />
                    )}
                  </button>
                )}
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => createTab()}
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div
          className={`flex items-center space-x-3 px-4 py-3 border-b ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => activeTab && navigate(activeTab.url)}
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`flex-1 flex items-center space-x-2 px-4 py-2 rounded-full border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <Lock className="w-4 h-4 text-green-500" />
            <input
              type="text"
              value={localAddressBar}
              onChange={(e) => setLocalAddressBar(e.target.value)}
              onKeyDown={handleNavigate}
              onFocus={() => setLocalAddressBar(addressBar)}
              className={`flex-1 bg-transparent outline-none text-sm ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
              placeholder="Search or enter address"
            />
            <Star className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMusicPlayer(!showMusicPlayer)}
              className={`p-2 rounded-lg transition ${
                showMusicPlayer
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Music className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Content Area */}
        <div
          className={`p-8 min-h-[400px] ${
            isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">I1</span>
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {activeTab?.title || 'Welcome to IterativOne'}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your modern browsing experience
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div
                className={`h-32 rounded-lg transition ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                }`}
              ></div>
              <div
                className={`h-32 rounded-lg transition ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-purple-100 to-pink-100'
                }`}
              ></div>
              <div
                className={`h-32 rounded-lg transition ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-green-100 to-teal-100'
                }`}
              ></div>
            </div>

            <div className="space-y-3">
              <div
                className={`h-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} w-3/4`}
              ></div>
              <div
                className={`h-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} w-full`}
              ></div>
              <div
                className={`h-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} w-5/6`}
              ></div>
            </div>
          </div>
        </div>

        {/* Floating Music Player */}
        {showMusicPlayer && (
          <div className="absolute bottom-4 right-4 w-80 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-4 text-white animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Now Playing</h3>
                  <p className="text-xs opacity-80">Favorite Playlist</p>
                </div>
              </div>
              <button
                onClick={() => setShowMusicPlayer(false)}
                className="hover:bg-white/20 p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-1 bg-white/30 rounded-full mb-3">
              <div className="h-full bg-white rounded-full w-1/3"></div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <button className="hover:bg-white/20 p-2 rounded-full transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="bg-white text-purple-600 p-3 rounded-full hover:scale-110 transition">
                <span className="text-xl">▶</span>
              </button>
              <button className="hover:bg-white/20 p-2 rounded-full transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Interactive browser mockup - Try clicking tabs, toggling dark mode, or showing the music
          player!
        </p>
      </div>
    </div>
  );
}
