import { ArrowRight } from 'lucide-react';

interface HeroProps {
  scrollY: number;
}

export default function Hero({ scrollY }: HeroProps) {
  const parallaxOffset = scrollY * 0.5;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Introducing IterativOne
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Experience the future
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              of browsing
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            A browser designed for the modern web. Fast, beautiful, and intelligent.
            <br />
            Built for creators, innovators, and forward-thinkers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="group px-8 py-4 bg-blue-600 text-white rounded-full font-medium text-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <span>Download IterativOne</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <a
              href="?demo=true"
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium text-lg border-2 border-gray-200 hover:border-gray-300 transition"
            >
              Try Browser Demo
            </a>
          </div>

          <div className="text-sm text-gray-500 pt-4">
            Available for Windows, macOS, and Linux
          </div>
        </div>

        <div
          className="mt-16 relative"
          style={{
            transform: `translateY(${parallaxOffset * 0.3}px)`,
          }}
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-4 transform perspective-1000">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                <div className="flex items-center space-x-2 px-4 py-3 bg-white border-b">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4 bg-gray-100 rounded-lg px-4 py-1.5 text-sm text-gray-600">
                    iterativone.com
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg"></div>
                      <div className="flex-1 h-6 bg-gray-200 rounded"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-100 rounded-lg"></div>
                      <div className="h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg"></div>
                      <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-100 rounded-lg"></div>
                    </div>

                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
