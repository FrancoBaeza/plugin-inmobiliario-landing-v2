import { useEffect } from 'react'
import '../src/i18n/i18n'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhatWeDo from './components/WhatWeDo'
import Benefits from './components/Benefits'
import VideoDemo from './components/VideoDemo'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'

    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-background)'
    }}>
      <Navbar />
      <Hero />
      <WhatWeDo />
      <Benefits />
      <VideoDemo />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
