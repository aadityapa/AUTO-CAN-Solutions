import { Outlet } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import SmoothScroll from './components/SmoothScroll'
import CursorGlow from './components/CursorGlow'
import AmbientBackground from './components/AmbientBackground'
import GlobalSEO from './seo/GlobalSEO'
export default function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <GlobalSEO />
      <SmoothScroll />
      <ScrollToTop />
      <AmbientBackground />
      <CursorGlow />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content"><Outlet /></main>
      <Footer />
    </MotionConfig>
  )
}
