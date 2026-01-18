import Link from "next/link"
import { Button } from "./Button"
import { Sparkles } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>STAM</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">Features</Button>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">Pricing</Button>
          <Link href="/dashboard">
             <Button variant="pro-primary" size="sm">Launch App</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
