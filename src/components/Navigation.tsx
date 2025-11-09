import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <a href="#" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I1</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">IterativOne</span>
            </a>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                Features
              </a>
              <a href="#partner-hub" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                Partner Hub
              </a>
              <a href="#boardroom" className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition">
                Boardroom
              </a>
              <a href="?demo=true" className="text-sm text-gray-700 hover:text-gray-900 transition">
                Browser Demo
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition transform hover:scale-105">
              Download now
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <a href="#music-video" className="block text-sm text-gray-700 hover:text-gray-900">
              Features
            </a>
            <a href="#themes" className="block text-sm text-gray-700 hover:text-gray-900">
              Themes
            </a>
            <a href="#tabs" className="block text-sm text-gray-700 hover:text-gray-900">
              Tab Islands
            </a>
            <a href="#ai" className="block text-sm text-gray-700 hover:text-gray-900">
              AI Assistant
            </a>
            <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
              Download now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
