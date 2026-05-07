import { Film } from 'lucide-react'

export default function MovieCard({ title, posterUrl }) {
  return (
    <div className="movie-card group relative rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
      {/* Glow border */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-accent pointer-events-none z-10" />

      {/* Poster */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-[#222]">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-3">
            <Film size={40} />
            <span className="text-xs text-center px-2">{title}</span>
          </div>
        )}
      </div>

      {/* Title overlay */}
      <div className="p-3">
        <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {title}
        </p>
      </div>
    </div>
  )
}
