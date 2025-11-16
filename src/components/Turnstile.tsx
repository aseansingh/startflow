import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void }
      ) => void
    }
  }
}

type Props = { onVerify: (token: string) => void }

export function Turnstile({ onVerify }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.onload = () => {
      if (!window.turnstile || !ref.current) return
      window.turnstile.render(ref.current, {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY!,
        callback: token => onVerify(token),
      })
    }
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [onVerify])

  return <div ref={ref} />
}