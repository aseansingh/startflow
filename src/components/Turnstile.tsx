import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: any) => string;
      reset?: (widgetId?: string) => void;
    };
  }
}

type Props = {
  onVerify: (token: string) => void;
};

export function Turnstile({ onVerify }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // prevent multiple widgets stacking up
    if (ref.current.childElementCount > 0) return;

    const t = window.turnstile;
    if (!t) {
      console.warn("Turnstile script not loaded yet");
      return;
    }

    t.render(ref.current, {
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      callback: onVerify,
      theme: "dark",
    });
  }, [onVerify]);

  return <div ref={ref} />;
}