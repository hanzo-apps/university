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
    default: 'Hanzo University — Frontier AI Systems & Engineering Accreditation',
    template: '%s | Hanzo University',
  },
  description:
    'The premier academic accreditation institute for autonomous AI engineering. Certifications in Agentic Coding (HACE), Reinforcement Learning (HARLE), and AI Systems Engineering with 25% compute credit rebates and W3C Verifiable Credentials.',
  keywords: [
    'Hanzo University',
    'AI engineering certification',
    'Agentic Coding',
    'SWE-bench',
    'Reinforcement Learning',
    'HACE credential',
    'HARLE credential',
    'AI architect masterclass',
    'W3C Verifiable Credentials',
    'Decision Models',
  ],
  authors: [{ name: 'Hanzo AI', url: 'https://hanzo.ai' }],
  creator: 'Hanzo AI',
  publisher: 'Hanzo AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hanzo.university',
    title: 'Hanzo University — Frontier AI Systems & Engineering Accreditation',
    description:
      'Rigorous degree programs and credentials in frontier AI engineering. Includes 25% compute credit rebates, gVisor container sandboxes, and cryptographic W3C credentials.',
    siteName: 'Hanzo University',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hanzo University Academic Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanzo University — Frontier AI Systems Accreditation',
    description: 'Accredited degrees and credentials in agentic software engineering and native RL.',
    images: ['/twitter-image.png'],
    creator: '@hanzoai',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
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
