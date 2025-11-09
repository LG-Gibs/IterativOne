import Hero from './components/Hero';
import Navigation from './components/Navigation';
import FeatureSection from './components/FeatureSection';
import Footer from './components/Footer';
import BrowserDemo from './pages/BrowserDemo';
import PartnerHub from './modules/agentic/PartnerHub';
import Boardroom from './modules/agentic/Boardroom';
import AgentSidebar from './modules/agentic/AgentSidebar';
import Omnibox from './modules/agentic/Omnibox';
import { AgentPlatformProvider, useAgentPlatform } from './context/AgentPlatformProvider';
import { useEffect, useState } from 'react';
import { Bot, Command } from 'lucide-react';

function AppContent() {
  const [scrollY, setScrollY] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('');
  const { 
    isAgentSidebarOpen, 
    isOmniboxOpen, 
    toggleAgentSidebar, 
    closeAgentSidebar, 
    openOmnibox, 
    closeOmnibox 
  } = useAgentPlatform();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShowDemo(params.get('demo') === 'true');
    
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash.slice(1));
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  if (showDemo) {
    return <BrowserDemo />;
  }

  const renderRoute = () => {
    switch (currentRoute) {
      case 'partner-hub':
        return <PartnerHub />;
      case 'boardroom':
        return <Boardroom />;
      default:
        return renderLandingPage();
    }
  };

  const renderLandingPage = () => (
    <>
      <Hero scrollY={scrollY} />
      <FeatureSection
        id="music-video"
        title="Detach your music & videos"
        subtitle="Let entertainment float"
        description="Pop out your favorite content and keep it accessible while you browse. Control your music, videos, and audio without switching tabs. The modular player follows you everywhere."
        imageType="player"
        scrollY={scrollY}
        offset={0}
      />
      <FeatureSection
        id="themes"
        title="Dynamic themes that adapt"
        subtitle="Your mood, your browser"
        description="IterativOne automatically adjusts its appearance based on your browsing. Choose from elegant themes that respond to content, time of day, or your personal preferences. Every session feels fresh and personalized."
        imageType="theme"
        scrollY={scrollY}
        offset={800}
      />
      <FeatureSection
        id="tabs"
        title="Evolved tab management"
        subtitle="Navigate smarter, not harder"
        description="Experience the next generation of tab organization. Visual previews, customizable emojis, and intelligent grouping make managing dozens of tabs effortless. Find what you need instantly with our revolutionary tab island design."
        imageType="tabs"
        scrollY={scrollY}
        offset={1600}
      />
      <FeatureSection
        id="ai"
        title="AI-powered browsing assistant"
        subtitle="Intelligence built in"
        description="Meet your new browsing companion. Get instant summaries, smart suggestions, and contextual help without leaving your page. IterativOne's AI understands what you need and delivers it seamlessly."
        imageType="ai"
        scrollY={scrollY}
        offset={2400}
        isLast
      />
      <Footer />
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {renderRoute()}

      <button
        onClick={toggleAgentSidebar}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 hover:scale-110"
        title="Open Agent Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>

      <button
        onClick={openOmnibox}
        className="fixed bottom-6 right-24 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 hover:scale-110"
        title="Open Omnibox (Ctrl+K)"
      >
        <Command className="w-6 h-6" />
      </button>

      <AgentSidebar isOpen={isAgentSidebarOpen} onClose={closeAgentSidebar} />
      <Omnibox isOpen={isOmniboxOpen} onClose={closeOmnibox} />
    </div>
  );
}

export default function App() {
  return (
    <AgentPlatformProvider>
      <AppContent />
    </AgentPlatformProvider>
  );
}
