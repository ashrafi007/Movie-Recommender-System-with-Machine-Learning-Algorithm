import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export function animateHeroEntrance(titleEl, subtitleEl, buttonEl) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const tl = gsap.timeline()
  tl.fromTo(titleEl, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    .fromTo(subtitleEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .fromTo(buttonEl, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.3')
  return tl
}

export function crossfadePoster(outEl, inEl, onComplete) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    gsap.set(outEl, { opacity: 0 })
    gsap.set(inEl, { opacity: 1 })
    onComplete?.()
    return
  }
  const tl = gsap.timeline({ onComplete })
  tl.to(outEl, { opacity: 0, duration: 0.8, ease: 'power2.inOut' })
    .fromTo(inEl, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.inOut' }, '<')
  return tl
}

export function scrollToSection(targetId) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  gsap.to(window, {
    duration: prefersReduced ? 0 : 1.2,
    scrollTo: { y: targetId, offsetY: 0 },
    ease: 'power3.inOut',
  })
}

export function animateSectionEntrance(el) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  gsap.fromTo(
    el,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  )
}

export function animateCards(cardEls) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  gsap.fromTo(
    cardEls,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.08,
    }
  )
}

export function animateSearchFocus(el, focused) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  gsap.to(el, {
    scale: focused ? 1.03 : 1,
    duration: 0.3,
    ease: 'power2.out',
  })
}

export { gsap, ScrollTrigger }
