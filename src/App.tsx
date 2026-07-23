import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { InkBackground } from './components/ui/InkBackground'
import { TimelineView } from './components/timeline/TimelineView'
import { CharacterGallery } from './components/characters/CharacterGallery'
import { CharacterDetail } from './components/characters/CharacterDetail'

/** 路由切换时回到顶部 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <InkBackground />
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<TimelineView />} />
          <Route path="/characters" element={<CharacterGallery />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
