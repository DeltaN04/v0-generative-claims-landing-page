"use client"

import { format } from "date-fns"
import { motion } from "framer-motion"
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  PauseCircle, 
  Download, 
  RefreshCw,
  Trash2,
  Copy,
  Check,
  FileJson,
  FileSpreadsheet,
  Clock,
  Database,
  Target,
  Zap,
  Brain,
  BookOpen,
  Link2
} from "lucide-react"
import { useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GenerationJob } from "@/lib/history-types"
import { toast } from "sonner"

interface JobDetailsDrawerProps {
  job: GenerationJob | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegenerate: (job: GenerationJob) => void
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

// Sample preview data
const previewData = [
  { policy_id: "POL-001", claim_status: "No Claim", vehicle_age: 3, region: "North", premium: 1250 },
  { policy_id: "POL-002", claim_status: "Claim", vehicle_age: 7, region: "South", premium: 1890 },
  { policy_id: "POL-003", claim_status: "No Claim", vehicle_age: 1, region: "East", premium: 980 },
  { policy_id: "POL-004", claim_status: "No Claim", vehicle_age: 5, region: "West", premium: 1450 },
  { policy_id: "POL-005", claim_status: "Claim", vehicle_age: 9, region: "North", premium: 2100 },
]

export function JobDetailsDrawer({ 
  job, 
  open, 
  onOpenChange, 
  onRegenerate, 
  onDelete 
}: JobDetailsDrawerProps) {
  const [copied, setCopied] = useState(false)

  if (!job) return null

  const config = statusConfig[job.status]
  const StatusIcon = config.icon

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(job.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Job ID copied to clipboard")
  }

  const handleDownload = (format: "csv" | "json") => {
    toast.success(`Downloading ${format.toUpperCase()} file...`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl bg-background/95 backdrop-blur-xl border-border/50 overflow-hidden flex flex-col">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            <SheetTitle className="font-mono text-lg">{job.id}</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopyId}
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <SheetDescription className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", config.className)}>
              <StatusIcon className={cn("w-3 h-3 mr-1", config.iconClassName)} />
              {config.label}
            </Badge>
            <span className="text-muted-foreground">
              {format(job.timestamp, "PPpp")}
            </span>
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card/50 rounded-lg p-3 text-center">
                <Database className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-bold">{job.rowCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Rows</p>
              </div>
              <div className="bg-card/50 rounded-lg p-3 text-center">
                <Target className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-bold">{job.claimRate}%</p>
                <p className="text-xs text-muted-foreground">Claim Rate</p>
              </div>
              <div className="bg-card/50 rounded-lg p-3 text-center">
                <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-bold">{formatDuration(job.duration)}</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Configuration */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Configuration</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className={cn("h-4 w-4", job.config.useReflexion ? "text-primary" : "text-muted-foreground/50")} />
                  <span className={cn("text-sm", job.config.useReflexion ? "text-foreground" : "text-muted-foreground")}>
                    Reflexion Agent
                  </span>
                  {job.config.useReflexion && <Check className="h-3 w-3 text-emerald-400 ml-auto" />}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className={cn("h-4 w-4", job.config.usePageIndex ? "text-primary" : "text-muted-foreground/50")} />
                  <span className={cn("text-sm", job.config.usePageIndex ? "text-foreground" : "text-muted-foreground")}>
                    PageIndex RAG
                  </span>
                  {job.config.usePageIndex && <Check className="h-3 w-3 text-emerald-400 ml-auto" />}
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className={cn("h-4 w-4", job.config.useStatisticalMatching ? "text-primary" : "text-muted-foreground/50")} />
                  <span className={cn("text-sm", job.config.useStatisticalMatching ? "text-foreground" : "text-muted-foreground")}>
                    Statistical Matching
                  </span>
                  {job.config.useStatisticalMatching && <Check className="h-3 w-3 text-emerald-400 ml-auto" />}
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground capitalize">Speed: {job.config.speed}</span>
                </div>
                {job.config.constraints.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.config.constraints.map((constraint) => (
                      <Badge key={constraint} variant="secondary" className="text-xs">
                        {constraint.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Quality Metrics */}
            {job.qualityMetrics && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Quality Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Accuracy", value: job.qualityMetrics.accuracy },
                      { label: "FD Compliance", value: job.qualityMetrics.fdCompliance },
                      { label: "Statistical Match", value: job.qualityMetrics.statisticalMatch },
                    ].map((metric) => (
                      <div key={metric.label} className="flex flex-col items-center">
                        <div className="w-16 h-16">
                          <CircularProgressbar
                            value={metric.value}
                            text={`${metric.value}%`}
                            styles={buildStyles({
                              textSize: "24px",
                              pathColor: metric.value >= 98 ? "#10b981" : metric.value >= 95 ? "#f59e0b" : "#ef4444",
                              textColor: "var(--foreground)",
                              trailColor: "var(--muted)",
                            })}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-border/50" />
              </>
            )}

            {/* Data Preview */}
            {job.status === "completed" && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Data Preview</h4>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="text-xs">Policy ID</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Age</TableHead>
                        <TableHead className="text-xs">Region</TableHead>
                        <TableHead className="text-xs">Premium</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row) => (
                        <TableRow key={row.policy_id} className="text-xs">
                          <TableCell className="font-mono">{row.policy_id}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px]",
                                row.claim_status === "Claim" 
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              )}
                            >
                              {row.claim_status}
                            </Badge>
                          </TableCell>
                          <TableCell>{row.vehicle_age}</TableCell>
                          <TableCell>{row.region}</TableCell>
                          <TableCell>${row.premium}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Error for failed jobs */}
            {job.status === "failed" && job.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-400 mb-1">Error</h4>
                <p className="text-sm text-red-400/80">{job.error}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="flex-col sm:flex-col gap-2 pt-4 border-t border-border/50">
          {job.status === "completed" && (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 bg-card/50"
                onClick={() => handleDownload("csv")}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-card/50"
                onClick={() => handleDownload("json")}
              >
                <FileJson className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>
          )}
          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
              onClick={() => onRegenerate(job)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Generation Job</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete job {job.id}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      onDelete(job)
                      onOpenChange(false)
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
