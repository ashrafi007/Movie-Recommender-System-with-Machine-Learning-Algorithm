import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

// In dev, Vite proxies /movies, /recommend, /hero-posters → localhost:5000
// In production builds, set VITE_API_URL to your backend URL
const API_BASE = import.meta.env.VITE_API_URL || ''

export function useMovieList() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`${API_BASE}/movies`)
      .then((res) => setMovies(res.data.movies))
      .catch(() => setError('Could not load movie list. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  return { movies, loading, error }
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRecommendations = useCallback((movieTitle) => {
    setLoading(true)
    setError(null)
    setSelectedMovie(movieTitle)
    setRecommendations([])

    axios
      .post(`${API_BASE}/recommend`, { movie: movieTitle })
      .then((res) => setRecommendations(res.data.recommendations))
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return { recommendations, selectedMovie, loading, error, fetchRecommendations }
}

export function useHeroPosters() {
  const [posters, setPosters] = useState([])

  useEffect(() => {
    axios
      .get(`${API_BASE}/hero-posters`)
      .then((res) => setPosters(res.data.backdrops))
      .catch(() => setPosters([]))
  }, [])

  return posters
}
