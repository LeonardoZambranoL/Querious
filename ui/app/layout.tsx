import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from "@mantine/core"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Querious',
  description: 'A Chat-Interface for analyzing Logs.',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider defaultColorScheme="dark">
            {children}
          </MantineProvider>
      </body>
    </html>
  )
}
