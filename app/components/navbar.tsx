"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/60 px-6 py-3 shadow-lg shadow-black/[0.03] backdrop-blur-xl">
                    <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
                        STAM
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            Features
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            How it Works
                        </Link>
                    </div>

                    {/* Empty div to maintain flex spacing */}
                    <div className="w-[100px]" />
                </div>
            </div>
        </motion.nav>
    )
}
