"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Navbar } from "../components/Navbar";
import { SubscriptionCard } from "../components/SubscriptionCard";
import { SummaryChart } from "../components/SummaryChart";
import { InsightPanel } from "../components/InsightPanel";
import { Card } from "../components/Card";
import { Loader2 } from "lucide-react";
import { Button } from "../components/Button";

// Interfaces mirroring the API response
interface Subscription {
  is_relevant: boolean;
  service_name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  category: string;
}

interface ProcessedResult {
  email: any;
  subscription: Subscription;
  message: string;
}

interface ApiResponse {
  count: number;
  results: ProcessedResult[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<ProcessedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/process-emails");
      if (!res.ok) {
        throw new Error("Failed to process emails");
      }
      const json: ApiResponse = await res.json();
      setData(json.results);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while processing your emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-6">You need to sign in to verify your subscriptions.</p>
        <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Sign in with Google
        </Button>
      </div>
    );
  }

  // Calculate aggregates from real data
  const totalMonthlySpend = data.reduce((acc, curr) => acc + (curr.subscription.amount || 0), 0);
  const activeSubs = data.length;

  // Aggregate categories
  const categoryMap = new Map<string, number>();
  data.forEach(item => {
    const cat = item.subscription.category || "Other";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + (item.subscription.amount || 0));
  });

  const chartData = Array.from(categoryMap.entries()).map(([name, value], idx) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'][idx % 5]
  }));

  // Generate simple insights from real messages
  const insights = data.slice(0, 3).map(item => ({
    type: "info" as const,
    message: item.message
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 flex-1">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {session?.user?.name}</p>
          </div>
          <Button variant="pro-outline" size="sm" onClick={fetchData} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Refresh
          </Button>
        </div>

        {loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-slate-600 font-medium animate-pulse">Processing your emails with Gemini AI...</p>
            <p className="text-sm text-slate-400">This might take a few seconds.</p>
          </div>
        ) : error ? (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100 text-center">
                {error}
            </div>
        ) : data.length === 0 ? (
            <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-slate-900">No subscriptions found</h3>
                <p className="text-slate-500 mt-2">We couldn't find any subscription emails in your recent inbox.</p>
            </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Top Summary Cards */}
                <Card className="p-6 md:col-span-2 bg-indigo-600 text-white border-none shadow-indigo-200">
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium mb-1">Total Detected Spend</p>
                            <h2 className="text-4xl font-bold">₹{totalMonthlySpend.toFixed(2)}</h2>
                        </div>
                        <div className="mt-6 flex items-center gap-4 text-sm text-indigo-100">
                            <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                                {activeSubs} Active Subscriptions
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="md:col-span-1 space-y-6">
                    <InsightPanel insights={insights} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Active Subscriptions</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.map((item, idx) => (
                            <SubscriptionCard 
                                key={idx}
                                name={item.subscription.service_name}
                                amount={item.subscription.amount}
                                currency={item.subscription.currency}
                                cycle={item.subscription.billing_cycle as any}
                                category={item.subscription.category as any}
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar / Analytics */}
                <div className="space-y-6">
                    <SummaryChart data={chartData} />
                </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
