import {
  HeadContent,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Header from "../components/Header";
import appCss from "../styles.css?url";

import { ConvexProvider } from "convex/react";
import { convex } from "../lib/convex";
import * as Sentry from "@sentry/react";

if (typeof window !== "undefined" && import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN ?? (import.meta as any).env?.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start Starter" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Cloudflare Turnstile script */}
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      </head>
      <body>
        <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
          <Header />
          <ConvexProvider client={convex}>{children}</ConvexProvider>
        </Sentry.ErrorBoundary>

        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}