import { useEffect, useRef } from 'react'
import MovieCard from './MovieCard'
import { animateCards } from '../animations/gsap'

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#1a1a1a]">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </div>
  )
}

export default function RecommendationGrid({ recommendations, selectedMovie, loading, error }) {
  const gridRef = useRef(null)

  useEffect(() => {
    if (recommendations.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.movie-card')
      animateCards([...cards])
    }
  }, [recommendations])

  if (!selectedMovie && !loading) return null

  return (
    <div className="mt-16">
      {selectedMovie && (
        <h2 className="text-center text-white/80 text-lg md:text-xl font-body mb-8">
          Because you liked{' '}
          <span className="text-white font-semibold">{selectedMovie}</span>
        </h2>
      )}

      {error && (
        <p className="text-center text-red-400 text-sm">{error}</p>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : recommendations.map((movie) => (
              <MovieCard
                key={movie.movie_id}
                title={movie.title}
                posterUrl={movie.poster_url}
              />
            ))}
      </div>
    </div>
  )
}
