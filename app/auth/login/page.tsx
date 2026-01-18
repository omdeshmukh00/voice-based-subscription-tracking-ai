"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true)
            setError(null)

            await signIn("google", {
                callbackUrl: "/dashboard",
            })
        } catch {
            setError("Authentication failed")
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />

            <Link
                href="/auth"
                className="absolute left-6 top-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Link>

            <div className="relative z-10 w-full max-w-md px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                >
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                        Welcome back
                    </h1>
                    <p className="mb-8 text-muted-foreground">
                        Log in with Google to continue
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.1,
                    }}
                >
                    <motion.button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/40 bg-white/70 px-6 py-4 font-medium text-foreground shadow-lg shadow-black/[0.03] backdrop-blur-xl transition-all hover:border-white/60 hover:bg-white/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        {isLoading ? "Connecting..." : "Continue with Google"}
                    </motion.button>

                    {error && (
                        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
                    )}

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/signup"
                            className="text-foreground underline underline-offset-4"
                        >
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
