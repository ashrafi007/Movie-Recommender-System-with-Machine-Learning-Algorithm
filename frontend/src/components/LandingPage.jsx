import PosterBackground from './PosterBackground'
import HeroContent from './HeroContent'
import { useHeroPosters } from '../hooks/useMovies'

export default function LandingPage() {
  const posters = useHeroPosters()

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <PosterBackground posterUrls={posters} />
      <HeroContent />
    </section>
  )
}
