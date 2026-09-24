import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold }
    )

    const observeRevealElements = (root) => {
      if (root.nodeType !== Node.ELEMENT_NODE) return
      if (root.matches('.reveal')) observer.observe(root)
      root.querySelectorAll('.reveal').forEach((target) => observer.observe(target))
    }

    observeRevealElements(el)

    // Supabase content arrives after the first render. Observe newly rendered
    // cards too, otherwise they retain `.reveal { opacity: 0 }` forever.
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(observeRevealElements)
      })
    })
    mutationObserver.observe(el, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [threshold])

  return ref
}
