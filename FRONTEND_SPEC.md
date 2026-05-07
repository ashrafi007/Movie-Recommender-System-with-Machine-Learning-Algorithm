# Frontend Specification — Movie Recommender System

## Overview

A modern, fully responsive React.js single-page application for the Movie Recommender System. Built with GSAP for animations, fully optimized for desktop, tablet, and mobile.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React.js (Vite) |
| Animations | GSAP + ScrollTrigger |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Icons | Lucide React |
| Fonts | Google Fonts (e.g., Inter / Bebas Neue) |

---

## Project Structure

```
frontend/
├── public/
│   └── posters/              # Movie poster images (jpg/webp)
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx   # Hero section with animated poster background
│   │   ├── PosterBackground.jsx  # Poster carousel with click-to-change animation
│   │   ├── HeroContent.jsx   # Title + CTA button
│   │   ├── SearchSection.jsx # Search bar + dropdown movie list
│   │   ├── RecommendationGrid.jsx # Results grid
│   │   └── MovieCard.jsx     # Individual recommendation card
│   ├── hooks/
│   │   └── useMovies.js      # Fetch movie list and recommendations from API
│   ├── animations/
│   │   └── gsap.js           # Centralized GSAP timeline definitions
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

---

## Page Sections

### 1. Landing / Hero Section

**Purpose:** First impression — full-screen cinematic experience.

**Layout:**
- Full viewport height (`100vh`)
- Layered structure:
  1. **Background layer** — movie poster fills the entire screen (cover fit)
  2. **Overlay layer** — dark semi-transparent gradient (bottom-heavy) so text is readable
  3. **Content layer** — centered title + CTA button

**Poster Background Behavior:**
- On page load, show a random poster from the pool
- On each click anywhere on the background (or a dedicated click indicator), transition to the next poster
- Transition animation: crossfade using GSAP (`gsap.to` opacity) with duration `0.8s` ease-in-out
- Poster pool: use real TMDB poster images or local assets from `public/posters/`
- Auto-rotate posters every 6 seconds as a fallback if no click

**Title:**
- Text: `Movie Recommendator System`
- Font: bold, large (clamp-based responsive size: `clamp(2rem, 6vw, 5rem)`)
- Color: white with a subtle text shadow
- Entrance animation: GSAP fade-in + slide-up on page load (`y: 60 → 0`, `opacity: 0 → 1`, delay `0.3s`)

**CTA Button:**
- Text: `Discover Movies ↓` (or similar)
- Style: outlined pill button with white border, white text, hover fills with white (text inverts)
- On click: GSAP smooth scroll to Search Section (`gsap.to(window, { scrollTo: '#search', duration: 1.2, ease: 'power3.inOut' }`)
- Entrance animation: GSAP fade-in after title (`delay: 0.6s`)

**Responsive:**
- Mobile: title font scales down, button becomes full-width
- Poster covers full screen on all breakpoints

---

### 2. Search Section

**Purpose:** Let the user pick a movie to get recommendations for.

**Layout:**
- Full-width centered section, min-height `100vh`
- Background: dark solid (`#0d0d0d`) or a blurred/dimmed version of the last poster
- Section entrance animation: GSAP ScrollTrigger fade-in when scrolled into view

**Search Bar:**
- Centered input field, wide (max `600px`), rounded pill shape
- Placeholder: `Search for a movie...`
- Icon: magnifying glass (Lucide `Search`) inside the left side of the input
- On focus: GSAP scale-up animation (`scale: 1 → 1.03`, `duration: 0.3s`)
- Typing filters the movie list in real time (client-side filter on the full movie list fetched from the API)

**Movie Dropdown List:**
- Appears below the search bar on focus or when input has value
- Scrollable container, max-height `320px`, custom styled scrollbar
- Each item: movie title, on hover highlight with accent color
- On click: selects the movie, closes the dropdown, and triggers the recommendation fetch
- Keyboard accessible (arrow keys to navigate, Enter to select, Escape to close)
- If no results match: show `No movies found` message

**Responsive:**
- Mobile: search bar is `90vw` wide
- Dropdown stays within screen width

---

### 3. Recommendation Results Section

**Purpose:** Display the recommended movies after a selection is made.

**Layout:**
- Appears below the search section (or replaces a placeholder area)
- Title: `Because you liked [Movie Name]`
- Grid of movie cards: 5 columns on desktop, 3 on tablet, 2 on mobile

**Movie Card:**
- Poster image (from TMDB API or placeholder)
- Movie title below the poster
- Hover effect: scale up slightly (`scale: 1.05`) with a glowing border
- Card entrance: staggered GSAP fade-in + slide-up as they appear (`stagger: 0.08s`)

**Loading State:**
- While fetching recommendations: show a skeleton loader (animated grey pulse) in place of cards

**Error State:**
- If API fails: show a friendly message `Something went wrong. Please try again.`

**Responsive:**
- Cards stack responsively via CSS Grid `auto-fill`

---

## API Integration

The React app communicates with a Python backend (Flask or FastAPI) that serves the ML model.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/movies` | Returns the full list of movie titles |
| `POST` | `/recommend` | Accepts `{ "movie": "title" }`, returns list of 5 recommended movie objects |

### Recommendation Response Shape

```json
{
  "recommendations": [
    { "title": "Movie Name", "poster_url": "https://..." },
    ...
  ]
}
```

---

## GSAP Animation Plan

| Trigger | Element | Animation |
|---|---|---|
| Page load | Title text | `y: 60→0`, `opacity: 0→1`, `duration: 1s` |
| Page load | CTA button | `opacity: 0→1`, `delay: 0.6s` |
| Poster click / auto | Background poster | crossfade `opacity`, `duration: 0.8s` |
| CTA button click | Window scroll | `scrollTo: #search`, `duration: 1.2s`, `ease: power3.inOut` |
| ScrollTrigger | Search section | `opacity: 0→1`, `y: 40→0` on enter viewport |
| Search input focus | Search bar | `scale: 1→1.03`, `duration: 0.3s` |
| Movie card appear | Each card | staggered `opacity: 0→1`, `y: 30→0`, `stagger: 0.08s` |
| Card hover | Movie card | CSS + GSAP `scale: 1→1.05` |

---

## Responsiveness Breakpoints

| Breakpoint | Width | Changes |
|---|---|---|
| Mobile | `< 640px` | 2-col grid, full-width search, smaller title |
| Tablet | `640px – 1024px` | 3-col grid, medium title |
| Desktop | `> 1024px` | 5-col grid, full hero layout |

---

## Accessibility

- All interactive elements keyboard navigable
- `aria-label` on search input and buttons
- Focus-visible outlines preserved
- `alt` text on all poster images
- Reduced motion: wrap all GSAP animations in `window.matchMedia('(prefers-reduced-motion: reduce)')` check

---

## Implementation Order

1. Scaffold Vite + React project inside `frontend/`
2. Install dependencies: `gsap`, `tailwindcss`, `axios`, `lucide-react`
3. Build `PosterBackground` + `HeroContent` (landing section)
4. Wire GSAP entrance animations and poster crossfade
5. Build `SearchSection` with live filtering dropdown
6. Build `RecommendationGrid` + `MovieCard`
7. Build Flask/FastAPI backend wrapper around the existing ML model
8. Connect frontend to backend via Axios
9. Polish responsiveness and test on mobile
10. Deploy (Vercel for frontend, Render/Railway for backend)
