import { Card } from "./Card"
import { CalendarClock, CreditCard, ShoppingBag, Zap } from "lucide-react"

interface SubscriptionCardProps {
  name: string
  amount: number
  currency: string
  cycle: "monthly" | "yearly" | "one-time"
  category: "subscription" | "utility" | "shopping"
  nextBillingDate?: string
}

export function SubscriptionCard({
  name,
  amount,
  currency,
  cycle,
  category,
  nextBillingDate,
}: SubscriptionCardProps) {
  
  const getIcon = () => {
    switch (category) {
      case "utility": return <Zap className="h-5 w-5 text-amber-500" />
      case "shopping": return <ShoppingBag className="h-5 w-5 text-emerald-500" />
      default: return <CreditCard className="h-5 w-5 text-indigo-500" />
    }
  }

  const getBgColor = () => {
    switch (category) {
      case "utility": return "bg-amber-50 border-amber-100"
      case "shopping": return "bg-emerald-50 border-emerald-100"
      default: return "bg-indigo-50 border-indigo-100"
    }
  }

  return (
    <Card className="p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${getBgColor()} transition-colors`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{name}</h3>
            <p className="text-xs text-slate-500 capitalize">{category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900 text-lg">
             {currency}{amount}
          </p>
          <p className="text-xs text-slate-500 font-medium">/{cycle === "one-time" ? "" : cycle.replace("ly", "")}</p>
        </div>
      </div>
      
      {nextBillingDate && (
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-500">
           <CalendarClock className="h-3.5 w-3.5" />
           <span>Next bill: {nextBillingDate}</span>
        </div>
      )}
    </Card>
  )
}
