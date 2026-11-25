import type { Metadata } from 'next'
import { Hanzo, YStack } from '@hanzo/ui'
import '@hanzo/ui/styles.css'
import '@hanzo/font/css'
import './globals.css'
import { Header } from './components/header'
import { Footer } from './components/footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://hanzo.university'),
  title: {
    default: 'Hanzo University — The School of Intelligence Engineering',
    template: '%s | Hanzo University',
  },
  description:
    "Don't just learn AI. Build intelligence. Learn to train models, engineer autonomous agents, conduct scientific research, secure infrastructure and build your own AI company.",
  keywords: [
    'Hanzo University',
    'School of Intelligence Engineering',
    'Kai Decision Intelligence',
    'Enso Adaptive Intelligence',
    'Zen Open-Weight Models',
    'Autonomous Science',
    'Agentic Cybersecurity',
    'OpenCyber',
    'Build Your Own AI Company',
    'Continuous Improvement',
    'W3C Verifiable Credentials',
  ],
  authors: [{ name: 'Hanzo AI', url: 'https://hanzo.ai' }],
  creator: 'Hanzo AI',
  publisher: 'Hanzo AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hanzo.university',
    title: 'Hanzo University — The School of Intelligence Engineering',
    description:
      'Real models. Real compute. Real experiments. Real skills. 25 self-paced courses across 4 schools plus free AUTO 101 and interactive labs on hanzo.app/learn.',
    siteName: 'Hanzo University',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hanzo University — The School of Intelligence Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanzo University — The School of Intelligence Engineering',
    description:
      "Don't just learn AI. Build intelligence. 25 hands-on courses across Intelligence Engineering, Autonomous Science, Cybersecurity, and AI Entrepreneurship.",
    images: ['/twitter-image.png'],
    creator: '@hanzoai',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/hanzo-logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Hanzo>
          <Header />
          <YStack render="main" id="main" display="block" minH="calc(100vh - 120px)">
            {children}
          </YStack>
          <Footer />
        </Hanzo>
      </body>
    </html>
  )
}
