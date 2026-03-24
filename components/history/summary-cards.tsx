"use client"

import { motion } from "framer-motion"
import { BarChart3, CheckCircle2, Clock, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { GenerationJob } from "@/lib/history-types"

interface SummaryCardsProps {
  jobs: GenerationJob[]
}

export function SummaryCards({ jobs }: SummaryCardsProps) {
  const totalGenerations = jobs.length
  const completedJobs = jobs.filter((j) => j.status === "completed")
  const successRate = totalGenerations > 0 
    ? Math.round((completedJobs.length / totalGenerations) * 100) 
    : 0
  const totalRows = jobs.reduce((sum, job) => sum + job.rowCount, 0)
  const avgDuration = completedJobs.length > 0
    ? Math.round(completedJobs.reduce((sum, job) => sum + job.duration, 0) / completedJobs.length)
    : 0

  const cards = [
    {
      title: "Total Generations",
      value: totalGenerations.toLocaleString(),
      icon: Database,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "Total Rows Generated",
      value: totalRows.toLocaleString(),
      icon: BarChart3,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Avg Generation Time",
      value: `${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`,
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
