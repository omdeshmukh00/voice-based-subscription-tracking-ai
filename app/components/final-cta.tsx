"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTA() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section className="relative py-32">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />

            {/* Animated orbs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute left-1/3 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-100 blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute right-1/3 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-indigo-100 blur-3xl"
            />

            <div className="relative mx-auto max-w-4xl px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-12 shadow-2xl shadow-black/[0.05] backdrop-blur-2xl md:p-16"
                >
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30" />

                    <div className="relative z-10 text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl"
                        >
                            Ready to take control?
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mx-auto mb-10 max-w-xl text-pretty text-lg text-muted-foreground"
                        >
                            Join thousands of users who have already saved money and gained clarity over their subscriptions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Link href="/auth">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="group inline-flex items-center gap-3 rounded-2xl bg-foreground px-8 py-4 text-lg font-semibold text-background shadow-xl transition-all"
                                >
                                    Get Started
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <p className="text-sm text-muted-foreground">© 2026 STAM. Built with ❤️ for better financial clarity.</p>
                </motion.div>
            </div>
        </section>
    )
}
