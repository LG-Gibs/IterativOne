import Hero from './components/Hero';
import Navigation from './components/Navigation';
import FeatureSection from './components/FeatureSection';
import Footer from './components/Footer';
import BrowserDemo from './pages/BrowserDemo';
import { useEffect, useState } from 'react';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShowDemo(params.get('demo') === 'true');
  }, []);

  if (showDemo) {
    return <BrowserDemo />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
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
    </div>
  );
}

export default App;
