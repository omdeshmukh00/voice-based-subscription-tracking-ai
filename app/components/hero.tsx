"use client"

import { motion } from "framer-motion"
import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import type * as THREE from "three"
import Link from "next/link"

function AIOrb() {
  const groupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5
      ring1Ref.current.rotation.z = t * 0.2
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.3
      ring2Ref.current.rotation.y = t * 0.4
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.6
      ring3Ref.current.rotation.x = t * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} scale={1.8}>
        {/* Central glowing core */}
        <mesh>
          <sphereGeometry args={[0.5, 64, 64]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#1e40af"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Inner glow */}
        <mesh>
          <sphereGeometry args={[0.52, 64, 64]} />
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} emissive="#3b82f6" emissiveIntensity={1} />
        </mesh>

        {/* Orbital ring 1 */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.9, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Orbital ring 2 */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <torusGeometry args={[1.1, 0.015, 16, 100]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Orbital ring 3 */}
        <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
          <torusGeometry args={[1.3, 0.01, 16, 100]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Orbiting particles */}
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 1.0,
              Math.sin((i / 8) * Math.PI * 2) * 0.3,
              Math.sin((i / 8) * Math.PI * 2) * 1.0,
            ]}
          >
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={3} />
          </mesh>
        ))}

        {/* Data stream particles */}
        {[...Array(12)].map((_, i) => (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos((i / 12) * Math.PI * 2 + 0.5) * 1.25,
              Math.sin((i / 6) * Math.PI) * 0.5,
              Math.sin((i / 12) * Math.PI * 2 + 0.5) * 1.25,
            ]}
          >
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#a5b4fc" emissive="#a5b4fc" emissiveIntensity={2} />
          </mesh>
        ))}

        {/* Core light */}
        <pointLight position={[0, 0, 0]} color="#3b82f6" intensity={2} distance={5} />
      </group>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#6366f1" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.3} color="#3b82f6" />
      <AIOrb />
      <Environment preset="city" />
    </>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50/50" />

      {/* Animated orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-100 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-indigo-100 blur-3xl"
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="mb-6"
        >
          <span className="inline-block rounded-full border border-white/30 bg-white/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
            AI-Powered Subscription Management
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="mb-6 text-balance text-6xl font-bold tracking-tight text-foreground md:text-8xl"
        >
          Welcome to STAM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl"
        >
          Track, manage, and understand your subscriptions using AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
        >
          <Link href="/auth">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="group relative overflow-hidden rounded-2xl bg-foreground px-8 py-4 text-lg font-semibold text-background shadow-xl shadow-black/[0.1] transition-all hover:bg-foreground/90"
            >
              <span className="relative z-10">Get Started</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
          className="flex h-12 w-7 items-start justify-center rounded-full border border-gray-300 p-2"
        >
          <motion.div className="h-2 w-1 rounded-full bg-gray-400" />
        </motion.div>
        <span className="text-sm text-muted-foreground">Scroll to explore</span>
      </motion.div>
    </section>
  )
}
