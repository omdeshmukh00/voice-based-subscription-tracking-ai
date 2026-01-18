"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Brain, CreditCard, LineChart, Zap, Sparkles } from "lucide-react"

const features = [
    {
        icon: Brain,
        title: "AI-Powered Insights",
        description: "Get intelligent recommendations and spending analysis powered by advanced AI algorithms.",
    },
    {
        icon: CreditCard,
        title: "Auto-Detection",
        description: "Automatically detect and categorize all your subscriptions from connected accounts.",
    },
    {
        icon: LineChart,
        title: "Spending Analytics",
        description: "Visualize your subscription spending patterns with beautiful interactive charts.",
    },
    {
        icon: Zap,
        title: "Instant Alerts",
        description: "Get notified before renewals, price changes, or unusual subscription activity.",
    },
    {
        icon: Sparkles,
        title: "Smart Recommendations",
        description: "Discover better alternatives and save money with personalized suggestions.",
    },
]

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative"
        >
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-8 shadow-lg shadow-black/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/80 hover:shadow-xl">
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50" />
                </div>

                <div className="relative z-10">
                    <div className="mb-6 inline-flex rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                        <feature.icon className="h-6 w-6 text-gray-700" />
                    </div>

                    <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
            </div>
        </motion.div>
    )
}

export function Features() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section id="features" className="relative py-32">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50" />

            <div className="relative mx-auto max-w-7xl px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-16 text-center"
                >
                    <span className="mb-4 inline-block rounded-full border border-white/30 bg-white/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
                        Features
                    </span>
                    <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                        Everything you need to manage subscriptions
                    </h2>
                    <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
                        Powerful features designed to give you complete control and visibility over your recurring expenses.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
