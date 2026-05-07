import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { animateHeroEntrance, scrollToSection } from '../animations/gsap'

export default function HeroContent() {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    animateHeroEntrance(titleRef.current, subtitleRef.current, buttonRef.current)
  }, [])

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pointer-events-none">
      {/* Badge */}
      <div
        ref={subtitleRef}
        className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Powered by Machine Learning
      </div>

      {/* Title */}
      <h1
        ref={titleRef}
        className="font-display text-white leading-none tracking-wide mb-4 pointer-events-none"
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 7rem)',
          opacity: 0,
          textShadow: '0 4px 30px rgba(0,0,0,0.8)',
        }}
      >
        Movie
        <br />
        <span className="text-accent">Recommendator</span>
        <br />
        System
      </h1>

      {/* Tagline */}
      <p className="text-white/60 text-base md:text-lg max-w-md mb-10 font-body pointer-events-none">
        Discover your next favourite film based on what you already love
      </p>

      {/* CTA button */}
      <button
        ref={buttonRef}
        onClick={() => scrollToSection('#search')}
        className="pointer-events-auto group flex items-center gap-2 border border-white/70 text-white px-8 py-3.5 rounded-full text-base font-medium tracking-wider
          hover:bg-white hover:text-black transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ opacity: 0 }}
        aria-label="Scroll to movie search"
      >
        Discover Movies
        <ChevronDown
          size={18}
          className="group-hover:translate-y-1 transition-transform duration-300"
        />
      </button>
    </div>
  )
}
