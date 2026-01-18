"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function OnboardingPage() {
    const { data: session, status, update } = useSession()
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth")
        }
    }, [status, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/user/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name.trim() }),
            })

            if (!res.ok) throw new Error("Failed to save name")

            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: name.trim(),
                },
            })

            router.push("/dashboard")
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "loading") return null

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />

            <div className="relative z-10 w-full max-w-md px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                >
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                        One last thing...
                    </h1>
                    <p className="mb-8 text-muted-foreground">
                        What should we call you?
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.1,
                    }}
                    className="space-y-4"
                >
                    <div className="rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg shadow-black/[0.03] backdrop-blur-xl">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 bg-white/50 text-center text-lg focus:border-gray-300 focus:outline-none"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-center text-sm text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !name.trim()}
                        className="h-12 w-full rounded-2xl bg-black text-lg font-semibold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Continue to Dashboard"}
                    </button>
                </motion.form>
            </div>
        </div>
    )
}
