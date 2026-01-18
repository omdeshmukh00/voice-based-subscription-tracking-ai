"use client";

import { Hero } from "./components/hero"
import { Features } from "./components/features"
import { HowItWorks } from "./components/how-it-works"
import { FinalCTA } from "./components/final-cta"
import { Navbar } from "./components/navbar"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FinalCTA />
    </main>
  )
}
