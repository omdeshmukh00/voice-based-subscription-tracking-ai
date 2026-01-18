import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "pro-primary" | "pro-secondary" | "pro-outline" | "ghost"
  size?: "sm" | "md" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "pro-primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 shadow-sm active:scale-[0.98]",
          {
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200": variant === "pro-primary",
            "bg-indigo-50 text-indigo-700 hover:bg-indigo-100": variant === "pro-secondary",
            "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700": variant === "pro-outline",
            "bg-transparent hover:bg-slate-100 text-slate-700 shadow-none": variant === "ghost",
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
            "h-10 w-10 p-0 rounded-full": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
