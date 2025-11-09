
import BrowserMockup from '../components/BrowserMockup';
import { ArrowLeft } from 'lucide-react';

export default function BrowserDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span>Back to Home</span>
        </a>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            IterativOne Browser Interface
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the next-generation browser interface with intelligent tab management,
            floating media player, and seamless dark mode.
          </p>
        </div>

        <BrowserMockup />

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
