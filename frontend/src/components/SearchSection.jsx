import { useEffect, useRef, useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { animateSectionEntrance, animateSearchFocus } from '../animations/gsap'
import { useMovieList, useRecommendations } from '../hooks/useMovies'
import RecommendationGrid from './RecommendationGrid'

export default function SearchSection() {
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const { movies, loading: moviesLoading, error: moviesError } = useMovieList()
  const { recommendations, selectedMovie, loading: recLoading, error: recError, fetchRecommendations } = useRecommendations()

  // Section entrance animation
  useEffect(() => {
    animateSectionEntrance(sectionRef.current)
  }, [])

  // Search focus animation
  useEffect(() => {
    animateSearchFocus(wrapperRef.current, focused)
  }, [focused])

  // Filter movies by query
  const filtered = query.length >= 1
    ? movies.filter((m) => m.toLowerCase().includes(query.toLowerCase())).slice(0, 50)
    : movies.slice(0, 100)

  const showDropdown = focused && (query.length > 0 || movies.length > 0)

  const selectMovie = useCallback((title) => {
    setQuery(title)
    setFocused(false)
    setActiveIdx(-1)
    fetchRecommendations(title)
  }, [fetchRecommendations])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      selectMovie(filtered[activeIdx])
    } else if (e.key === 'Escape') {
      setFocused(false)
      setActiveIdx(-1)
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx]
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const clearQuery = () => {
    setQuery('')
    setActiveIdx(-1)
    inputRef.current?.focus()
  }

  return (
    <section
      id="search"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-start pt-20 pb-24 px-4 bg-[#0a0a0a]"
      style={{ opacity: 0 }}
    >
      {/* Section header */}
      <div className="text-center mb-12">
        <h2 className="font-display text-white tracking-wide mb-3"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Find Your Next Film
        </h2>
        <p className="text-white/50 text-sm md:text-base max-w-md mx-auto font-body">
          Search any movie and get 5 personalised recommendations instantly
        </p>
      </div>

      {/* Search bar */}
      <div ref={wrapperRef} className="relative w-full max-w-xl z-20">
        {/* Input */}
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-4 text-white/40 pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1) }}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a movie..."
            aria-label="Search for a movie"
            aria-autocomplete="list"
            aria-controls="movie-dropdown"
            aria-activedescendant={activeIdx >= 0 ? `movie-item-${activeIdx}` : undefined}
            className="w-full bg-white/8 border border-white/15 text-white placeholder-white/30 rounded-full
              py-4 pl-11 pr-11 text-sm md:text-base outline-none
              focus:border-white/40 focus:bg-white/10 transition-colors duration-200"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            spellCheck={false}
          />
          {query && (
            <button
              onClick={clearQuery}
              className="absolute right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            id="movie-dropdown"
            role="listbox"
            aria-label="Movie suggestions"
            className="absolute top-full mt-2 w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
            style={{ background: '#141414', zIndex: 50 }}
          >
            {moviesLoading && (
              <div className="px-4 py-6 text-center text-white/40 text-sm">Loading movies…</div>
            )}
            {moviesError && (
              <div className="px-4 py-4 text-center text-red-400 text-sm">{moviesError}</div>
            )}
            {!moviesLoading && filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-white/40 text-sm">No movies found</div>
            )}
            {!moviesLoading && filtered.length > 0 && (
              <ul
                ref={listRef}
                className="dropdown-scroll overflow-y-auto"
                style={{ maxHeight: '320px' }}
              >
                {filtered.map((title, i) => (
                  <li
                    key={title}
                    id={`movie-item-${i}`}
                    role="option"
                    aria-selected={i === activeIdx}
                    onClick={() => selectMovie(title)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`px-5 py-3 cursor-pointer text-sm transition-colors duration-100 flex items-center gap-3 ${
                      i === activeIdx
                        ? 'bg-accent text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Search size={13} className="shrink-0 opacity-50" />
                    {title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      {moviesLoading && !focused && (
        <p className="mt-4 text-white/30 text-xs">Loading movie database…</p>
      )}

      {/* Recommendations */}
      <div className="w-full max-w-6xl mt-4">
        <RecommendationGrid
          recommendations={recommendations}
          selectedMovie={selectedMovie}
          loading={recLoading}
          error={recError}
        />
      </div>
    </section>
  )
}
