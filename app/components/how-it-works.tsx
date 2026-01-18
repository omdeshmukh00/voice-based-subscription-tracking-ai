"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Mail, Brain, LayoutDashboard, PiggyBank } from "lucide-react"

const steps = [
    {
        number: "01",
        title: "Connect Your Email",
        description:
            "Securely link your email account. STAM reads subscription-related emails to automatically detect all your active subscriptions.",
        icon: Mail,
    },
    {
        number: "02",
        title: "AI Analyzes Everything",
        description:
            "Our intelligent AI scans and processes your subscription data, identifying patterns, renewal dates, and spending trends.",
        icon: Brain,
    },
    {
        number: "03",
        title: "Get Actionable Insights",
        description:
            "Access a personalized dashboard with clear visualizations, spending breakdowns, and smart recommendations tailored to you.",
        icon: LayoutDashboard,
    },
    {
        number: "04",
        title: "Keep More of Your Money",
        description:
            "Identify unused subscriptions, find better deals, and optimize your spending to save hundreds every year.",
        icon: PiggyBank,
    },
]

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const Icon = step.icon

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
        >
            <div className="relative flex gap-6">
                {/* Step number with icon */}
                <div className="flex-shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-white/70 shadow-lg shadow-black/[0.03] backdrop-blur-xl"
                    >
                        <Icon className="h-7 w-7 text-foreground" />
                    </motion.div>
                </div>

                {/* Content */}
                <div className="pt-1">
                    <span className="mb-1 block text-sm font-medium text-muted-foreground">{step.number}</span>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                    className="absolute left-8 top-20 h-16 w-px origin-top bg-gradient-to-b from-gray-200 to-transparent"
                />
            )}
        </motion.div>
    )
}

export function HowItWorks() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section id="how-it-works" className="relative py-32">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

            <div className="relative mx-auto max-w-4xl px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-16 text-center"
                >
                    <span className="mb-4 inline-block rounded-full border border-white/30 bg-white/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
                        How It Works
                    </span>
                    <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                        Your subscriptions, simplified
                    </h2>
                    <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
                        Get started in minutes and take control of your subscription spending.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <StepCard key={step.number} step={step} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
