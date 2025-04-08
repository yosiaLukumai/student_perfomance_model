import type React from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

export {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
}

// Simplified chart components to avoid invariant errors
export const Chart = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full h-full">{children}</div>
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  )
}

export const ChartGrid = ({ horizontal, vertical }: { horizontal?: boolean; vertical?: boolean }) => {
  return <CartesianGrid strokeDasharray="3 3" horizontal={horizontal} vertical={vertical} />
}

export const ChartXAxis = () => <XAxis />
export const ChartYAxis = () => <YAxis />

export const ChartBar = ({ data, color }: { data: any[]; color: string }) => {
  return <Bar dataKey="y" data={data} fill={color} />
}

export const ChartLine = ({ data, color }: { data: any[]; color: string }) => {
  return <Line type="monotone" dataKey="y" data={data} stroke={color} />
}

export const ChartPie = ({ data }: { data: any[] }) => {
  return (
    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
      ))}
    </Pie>
  )
}

// Simplified tooltip and legend components
export const ChartTooltip = () => <Tooltip />
export const ChartTooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ChartLegend = () => <Legend />
export const ChartLegendItem = ({ name, color }: { name: string; color: string }) => <></>

