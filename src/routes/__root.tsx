import { HeadContent, Scripts, createRootRoute, Outlet } from '@tanstack/react-router'

import '../styles/main.scss'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'WeatherNow - Live Weather Monitoring',
      },
      {
        name: 'description',
        content: 'Get real-time weather updates based on your location or any country. Beautiful multi-theme UI.',
      },
      {
        tag: 'link',
        attrs: {
          rel: 'icon',
          href: '/favicon.png',
          type: 'image/png',
        },
      },
    ],
  }),

  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="theme-white">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return <Outlet />
}
