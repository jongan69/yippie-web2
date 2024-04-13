import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from 'react'
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/themeprovider/theme-provider"
import { NavigationEvents } from '../lib/navigation-events'
import Loading from "./app/loading"
import { SessionProvider } from "@/components/localstorageprovider"
import { Metadata, Viewport } from "next"
import { siteConfig } from "@/config/site"

interface RootLayoutProps {
  children: React.ReactNode
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon-16x16.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <head >
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div>{children}</div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          <Suspense fallback={<Loading />}>
            <NavigationEvents />
          </Suspense>
          {/* <SpeedInsights /> */}
          <Analytics />
        </body>
      </html>
    </SessionProvider>
  )
}
