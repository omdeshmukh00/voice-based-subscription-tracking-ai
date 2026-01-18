import { Card } from "./Card"
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react"

interface InsightPanelProps {
  insights: Array<{
    type: "trend" | "warning" | "info"
    message: string
  }>
}

export function InsightPanel({ insights }: InsightPanelProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold text-slate-900">AI Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 text-sm">
                <div className="mt-0.5 shrink-0">
                    {insight.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    {insight.type === 'trend' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                    {insight.type === 'info' && <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5" />}
                </div>
                <p className="text-slate-600 leading-relaxed">{insight.message}</p>
            </div>
        ))}
      </div>
    </Card>
  )
}
