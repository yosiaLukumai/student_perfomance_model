
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({ percentage, size = 120, strokeWidth = 10, className }: CircularProgressProps) {
  const [progress, setProgress] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Determine color based on percentage
  const getColor = (percent: number) => {
    if (percent >= 70) return "text-green-500"
    if (percent >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  useEffect(() => {
    // Animate the progress
    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={getColor(percentage)}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold">{Math.round(progress)}%</span>
        <span className="text-xs">Success Rate</span>
      </div>
    </div>
  )
}
