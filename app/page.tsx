"use client";

import Link from "next/link";
import { Button } from "./components/Button";
import { Navbar } from "./components/Navbar";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50 -z-10" />
          
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI-Powered Finance Tracking
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Track all your subscriptions <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">automatically</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Connect your Gmail and let our AI discover your recurring payments. 
              Never pay for an unused subscription again.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Button 
                size="lg" 
                className="group min-w-[200px] text-lg h-14 rounded-full"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Connect Gmail
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Feature preview / minimalist illustration representation */}
            <div className="mt-20 relative mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-xl p-4 shadow-2xl shadow-indigo-100/50 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-3xl -z-10" />
              <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                 <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-slate-300" />
                      <div className="h-3 w-3 rounded-full bg-slate-300" />
                      <div className="h-3 w-3 rounded-full bg-slate-300" />
                    </div>
                 </div>
                 <div className="p-8 grid md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-red-500">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Netflix</p>
                            <p className="text-lg font-bold text-slate-900">₹499</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-500">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Spotify</p>
                            <p className="text-lg font-bold text-slate-900">₹119</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-orange-500">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Amazon Prime</p>
                            <p className="text-lg font-bold text-slate-900">₹1499</p>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
