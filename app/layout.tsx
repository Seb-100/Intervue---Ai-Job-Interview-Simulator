import type { Metadata } from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  weight: '400',
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  weight: '400',
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: 'Intervue',
  description: 'Practice job interviews with a human-like AI interviewer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body className={`${geistSans.className} ${geistMono.className}`} >
        {/* <Navbar /> */}
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  )
}
