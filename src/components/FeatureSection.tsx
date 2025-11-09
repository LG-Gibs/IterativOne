import { Play, Music, Palette, Layout, Sparkles, ExternalLink } from 'lucide-react';

interface FeatureSectionProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageType: 'player' | 'theme' | 'tabs' | 'ai';
  scrollY: number;
  offset: number;
  isLast?: boolean;
}

export default function FeatureSection({
  id,
  title,
  subtitle,
  description,
  imageType,
  scrollY,
  offset,
  isLast = false,
}: FeatureSectionProps) {
  const parallaxOffset = Math.max(0, (scrollY - offset) * 0.3);
  const isEven = id === 'themes' || id === 'ai';

  const renderFeatureVisual = () => {
    switch (imageType) {
      case 'player':
        return (
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 aspect-video flex items-center justify-center">
                <Play className="w-20 h-20 text-white" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="mt-4 flex items-center space-x-3">
                <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                  <Play className="w-4 h-4 text-white" />
                </button>
                <div className="flex-1 h-1 bg-gray-700 rounded"></div>
                <Music className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        );
      case 'theme':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition duration-300">
              <Palette className="w-12 h-12 text-white mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-white/30 rounded w-3/4"></div>
                <div className="h-3 bg-white/30 rounded w-1/2"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition duration-300">
              <Palette className="w-12 h-12 text-white mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-white/30 rounded w-3/4"></div>
                <div className="h-3 bg-white/30 rounded w-1/2"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition duration-300">
              <Palette className="w-12 h-12 text-white mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-white/30 rounded w-3/4"></div>
                <div className="h-3 bg-white/30 rounded w-1/2"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition duration-300">
              <Palette className="w-12 h-12 text-white mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-white/30 rounded w-3/4"></div>
                <div className="h-3 bg-white/30 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      case 'tabs':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <span className="text-xl">🎵</span>
                  <span className="text-sm text-gray-700">Music</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="text-xl">📧</span>
                  <span className="text-sm text-gray-700">Email</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="text-xl">🛒</span>
                  <span className="text-sm text-gray-700">Shopping</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Layout className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Tab Islands</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg"></div>
                <div className="h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-lg"></div>
                <div className="h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg"></div>
              </div>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="bg-blue-800/50 rounded-lg p-4">
                    <div className="h-3 bg-blue-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-blue-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Ask me anything...</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id={id}
      className={`relative min-h-screen flex items-center py-20 ${
        isLast ? 'mb-0' : 'mb-20'
      } overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div
          className={`grid md:grid-cols-2 gap-12 items-center ${
            isEven ? 'md:grid-flow-dense' : ''
          }`}
        >
          <div
            className={isEven ? 'md:col-start-2' : ''}
            style={{
              transform: `translateY(${parallaxOffset}px)`,
            }}
          >
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              {subtitle}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{description}</p>
            <a
              href="#"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition group"
            >
              <span>Learn more</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
            </a>
          </div>

          <div
            className={isEven ? 'md:col-start-1 md:row-start-1' : ''}
            style={{
              transform: `translateY(${parallaxOffset * 0.5}px)`,
            }}
          >
            {renderFeatureVisual()}
          </div>
        </div>
      </div>
    </section>
  );
}
