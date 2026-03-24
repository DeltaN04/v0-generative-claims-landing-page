"use client"

import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  PauseCircle, 
  Download, 
  Eye, 
  Trash2,
  Clock,
  Database,
  Target
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GenerationJob } from "@/lib/history-types"

interface JobCardProps {
  job: GenerationJob
  index: number
  onView: (job: GenerationJob) => void
  onDownload: (job: GenerationJob) => void
  onDelete: (job: GenerationJob) => void
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    iconClassName: "text-emerald-400",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
    iconClassName: "text-red-400",
  },
  in_progress: {
    icon: Loader2,
    label: "In Progress",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    iconClassName: "text-blue-400 animate-spin",
  },
  paused: {
    icon: PauseCircle,
    label: "Paused",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconClassName: "text-amber-400",
  },
}

export function JobCard({ job, index, onView, onDownload, onDelete }: JobCardProps) {
  const config = statusConfig[job.status]
  const StatusIcon = config.icon

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative"
    >
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute -top-4 left-6 w-0.5 h-4 bg-gradient-to-b from-border/50 to-transparent" />
      )}
      
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden group">
        <CardContent className="p-0">
          <div className="flex items-stretch">
            {/* Timeline dot */}
            <div className="flex flex-col items-center py-6 px-4">
              <div className={cn(
                "w-3 h-3 rounded-full ring-4",
                job.status === "completed" && "bg-emerald-400 ring-emerald-400/20",
                job.status === "failed" && "bg-red-400 ring-red-400/20",
                job.status === "in_progress" && "bg-blue-400 ring-blue-400/20 animate-pulse",
                job.status === "paused" && "bg-amber-400 ring-amber-400/20",
              )} />
              <div className="flex-1 w-0.5 mt-2 bg-gradient-to-b from-border/30 to-transparent" />
            </div>

            {/* Main content */}
            <div className="flex-1 py-4 pr-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onView(job)}
                      className="font-mono text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {job.id}
                    </button>
                    <Badge variant="outline" className={cn("text-xs", config.className)}>
                      <StatusIcon className={cn("w-3 h-3 mr-1", config.iconClassName)} />
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(job.timestamp, { addSuffix: true })}
                  </p>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onView(job)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {job.status === "completed" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onDownload(job)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-400"
                    onClick={() => onDelete(job)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <Database className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground font-medium">{job.rowCount.toLocaleString()}</span>
                  <span className="text-muted-foreground">rows</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Target className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground font-medium">{job.claimRate}%</span>
                  <span className="text-muted-foreground">claim rate</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground font-medium">{formatDuration(job.duration)}</span>
                </div>
              </div>

              {/* Error message for failed jobs */}
              {job.status === "failed" && job.error && (
                <p className="mt-2 text-sm text-red-400/80 bg-red-500/10 rounded-md px-2 py-1">
                  {job.error}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
