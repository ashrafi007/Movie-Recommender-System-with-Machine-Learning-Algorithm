import { useEffect, useRef, useState } from 'react'
import { crossfadePoster } from '../animations/gsap'

// Gradient fallbacks when no TMDB posters are available
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
  'linear-gradient(135deg, #2d1b69, #11998e, #38ef7d)',
  'linear-gradient(135deg, #000428, #004e92)',
  'linear-gradient(135deg, #0d0d0d, #7b1fa2, #0d0d0d)',
  'linear-gradient(135deg, #1a0533, #3c1053, #1a0533)',
  'linear-gradient(135deg, #200122, #6f0000)',
  'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
]

export default function PosterBackground({ posterUrls, onPosterChange }) {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const currentRef = useRef(null)
  const nextRef = useRef(null)
  const intervalRef = useRef(null)

  const sources = posterUrls.length > 0 ? posterUrls : FALLBACK_GRADIENTS
  const isImage = posterUrls.length > 0

  const advance = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    const nextIdx = (current + 1) % sources.length
    setNext(nextIdx)

    // Apply the next background before fading in
    if (nextRef.current) {
      if (isImage) {
        nextRef.current.style.backgroundImage = `url(${sources[nextIdx]})`
      } else {
        nextRef.current.style.background = sources[nextIdx]
      }
      nextRef.current.style.opacity = '0'
    }

    crossfadePoster(currentRef.current, nextRef.current, () => {
      setCurrent(nextIdx)
      setIsTransitioning(false)
      onPosterChange?.(nextIdx)
    })
  }

  // Auto-rotate every 6 seconds
  useEffect(() => {
    intervalRef.current = setInterval(advance, 6000)
    return () => clearInterval(intervalRef.current)
  }, [current, sources.length, isTransitioning])

  // Reset interval on manual click
  const handleClick = () => {
    clearInterval(intervalRef.current)
    advance()
    intervalRef.current = setInterval(advance, 6000)
  }

  const getLayerStyle = (idx) => {
    if (isImage) return { backgroundImage: `url(${sources[idx]})` }
    return { background: sources[idx] }
  }

  return (
    <div
      className="absolute inset-0 cursor-pointer overflow-hidden"
      onClick={handleClick}
      role="button"
      aria-label="Click to change background"
    >
      {/* Current poster */}
      <div
        ref={currentRef}
        className="poster-layer"
        style={getLayerStyle(current)}
      />

      {/* Next poster (hidden, fades in) */}
      <div
        ref={nextRef}
        className="poster-layer"
        style={{ ...getLayerStyle(next), opacity: 0 }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

      {/* Click hint */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2 text-white/40 text-sm pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
        click to change
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
        {sources.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-300 ${
              i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
