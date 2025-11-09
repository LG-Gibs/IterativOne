# IterativOne Browser Landing Page

A modern, production-ready browser landing page inspired by Opera One, completely reimagined as "IterativOne". This project features smooth parallax scrolling, responsive design, and elegant animations.

## Features

- **Responsive Design**: Fully optimized for all device sizes from mobile to desktop
- **Smooth Animations**: Parallax scrolling effects and hover interactions
- **Modern UI**: Clean, contemporary design with gradient accents
- **Interactive Navigation**: Sticky header with mobile menu support
- **Feature Showcases**: Four distinct feature sections with custom visuals
- **Production Ready**: Built with TypeScript, React, and Tailwind CSS

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling
- **Lucide React** - Beautiful, consistent icons

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx      # Sticky navigation with mobile menu
│   ├── Hero.tsx            # Hero section with parallax effects
│   ├── FeatureSection.tsx  # Reusable feature showcase component
│   └── Footer.tsx          # Comprehensive footer with links
├── App.tsx                 # Main application component
├── index.css               # Global styles and Tailwind config
└── main.tsx                # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Features Overview

### Hero Section
- Animated gradient background
- Parallax scrolling effects
- Browser mockup with modern design
- Call-to-action buttons

### Feature Sections

1. **Detach Music & Videos**: Floating media player concept
2. **Dynamic Themes**: Adaptive theme system with multiple color schemes
3. **Evolved Tab Management**: Tab islands with emoji customization
4. **AI-Powered Assistant**: Smart browsing companion with contextual help

### Navigation
- Sticky header that appears on scroll
- Responsive mobile menu
- Language selector
- Download CTA button

### Footer
- Comprehensive link organization
- Social media integration
- Company information
- Legal links

## Customization

### Colors
Update the gradient colors in `tailwind.config.js` or directly in component classes:
```tsx
className="bg-gradient-to-br from-blue-500 to-cyan-400"
```

### Content
Edit the feature content in `src/App.tsx`:
```tsx
<FeatureSection
  title="Your Title"
  subtitle="Your Subtitle"
  description="Your description"
  // ...
/>
```

### Animations
Adjust parallax speed by modifying the multipliers in components:
```tsx
const parallaxOffset = scrollY * 0.5; // Adjust 0.5 for different speeds
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized bundle size with code splitting
- Lazy-loaded components where applicable
- Efficient scroll event handling with throttling
- CSS-based animations for smooth 60fps performance

## Accessibility

- Semantic HTML5 markup
- Proper heading hierarchy
- Keyboard navigation support
- ARIA labels where appropriate
- High contrast text for readability

## Legal Notice

This project is a demonstration/portfolio piece. All "IterativOne" branding is original and created specifically for this project. No copyrighted assets from Opera or any other browser have been used.

## License

This project is provided as-is for educational and portfolio purposes.

## Credits

- Built with React, TypeScript, and Tailwind CSS
- Icons from Lucide React
- Inspired by modern browser landing page design patterns

---

Built with ❤️ using modern web technologies
