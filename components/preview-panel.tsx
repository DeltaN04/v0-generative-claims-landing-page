"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  Database,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PreviewPanelProps {
  rows: number
  claimRate: number
  isGenerating: boolean
  recentGenerations: {
    id: string
    rows: number
    status: "completed" | "failed" | "processing"
    time: string
  }[]
}

const dataTypes = [
  { name: "Text", value: 12, color: "#8B5CF6" },
  { name: "Numeric", value: 15, color: "#3B82F6" },
  { name: "Date", value: 6, color: "#06B6D4" },
  { name: "Boolean", value: 5, color: "#10B981" },
  { name: "Categorical", value: 3, color: "#F59E0B" },
]

export function PreviewPanel({
  rows,
  claimRate,
  isGenerating,
  recentGenerations,
}: PreviewPanelProps) {
  const apiCalls = Math.ceil(rows / 100)
  const estimatedCost = (apiCalls * 0.002).toFixed(2)
  const estimatedMinutes = Math.ceil(rows * 0.05 / 60)

  const qualityMetrics = [
    { label: "Accuracy", value: "98.7%", trend: "up" },
    { label: "Completeness", value: "100%", trend: "stable" },
    { label: "Consistency", value: "99.2%", trend: "up" },
  ]

  return (
    <div className="space-y-6">
      {/* What You'll Get Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-border/30 pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              {"What You'll Get"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Data Types Pie Chart */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Data Types Breakdown
                </p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {dataTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {dataTypes.map((type) => (
                    <div
                      key={type.name}
                      className="flex items-center gap-1 text-xs"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-muted-foreground">{type.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Expected Quality
                </p>
                <div className="space-y-2">
                  {qualityMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                    >
                      <span className="text-sm text-foreground">
                        {metric.label}
                      </span>
                      <span className="text-sm font-mono font-semibold text-primary">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Columns
                    </span>
                    <span className="text-lg font-bold text-foreground">41</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">
                      Target Claim Rate
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {claimRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cost Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
          <CardHeader className="border-b border-border/30 pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Cost Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                key={apiCalls}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
              >
                <p className="text-2xl font-bold text-foreground">{apiCalls}</p>
                <p className="text-xs text-muted-foreground mt-1">API Calls</p>
              </motion.div>
              <motion.div
                key={estimatedCost}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20"
              >
                <p className="text-2xl font-bold text-foreground">
                  ${estimatedCost}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Est. Cost</p>
              </motion.div>
              <motion.div
                key={estimatedMinutes}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-border/30"
              >
                <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  {estimatedMinutes}m
                </p>
                <p className="text-xs text-muted-foreground mt-1">Time</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Generations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
          <CardHeader className="border-b border-border/30 pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              Recent Generations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30 mb-3"
              >
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm font-medium">
                    Generating {rows.toLocaleString()} rows...
                  </span>
                </div>
                <Badge variant="outline" className="bg-primary/20">
                  Processing
                </Badge>
              </motion.div>
            )}
            <div className="space-y-2">
              {recentGenerations.map((gen, index) => (
                <motion.div
                  key={gen.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {gen.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : gen.status === "failed" ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {gen.rows.toLocaleString()} rows
                      </p>
                      <p className="text-xs text-muted-foreground">{gen.time}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      gen.status === "completed"
                        ? "default"
                        : gen.status === "failed"
                          ? "destructive"
                          : "outline"
                    }
                    className={
                      gen.status === "completed"
                        ? "bg-green-500/20 text-green-500 border-green-500/30"
                        : ""
                    }
                  >
                    {gen.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
