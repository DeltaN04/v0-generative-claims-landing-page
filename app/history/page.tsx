"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, History } from "lucide-react"
import Link from "next/link"
import { DateRange } from "react-day-picker"
import { isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Particles } from "@/components/particles"
import { ThemeToggle } from "@/components/theme-toggle"
import { FilterBar } from "@/components/history/filter-bar"
import { SummaryCards } from "@/components/history/summary-cards"
import { JobCard } from "@/components/history/job-card"
import { JobDetailsDrawer } from "@/components/history/job-details-drawer"
import { EmptyState } from "@/components/history/empty-state"
import { LoadingSkeleton } from "@/components/history/loading-skeleton"
import { GenerationJob, mockGenerationJobs } from "@/lib/history-types"

export default function HistoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [jobs, setJobs] = useState<GenerationJob[]>([])
  const [selectedJob, setSelectedJob] = useState<GenerationJob | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<{
    dateRange: DateRange | undefined
    status: string
    searchQuery: string
  }>({
    dateRange: undefined,
    status: "all",
    searchQuery: "",
  })

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(mockGenerationJobs)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Date range filter
      if (filters.dateRange?.from) {
        const start = startOfDay(filters.dateRange.from)
        const end = filters.dateRange.to ? endOfDay(filters.dateRange.to) : endOfDay(filters.dateRange.from)
        if (!isWithinInterval(job.timestamp, { start, end })) {
          return false
        }
      }

      // Status filter
      if (filters.status !== "all" && job.status !== filters.status) {
        return false
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (!job.id.toLowerCase().includes(query)) {
          return false
        }
      }

      return true
    })
  }, [jobs, filters])

  const handleView = (job: GenerationJob) => {
    setSelectedJob(job)
    setDrawerOpen(true)
  }

  const handleDownload = (job: GenerationJob) => {
    toast.success(`Downloading data for ${job.id}...`)
  }

  const handleDelete = (job: GenerationJob) => {
    setJobs((prev) => prev.filter((j) => j.id !== job.id))
    toast.success(`Deleted job ${job.id}`)
  }

  const handleRegenerate = (job: GenerationJob) => {
    toast.loading("Starting regeneration...", { id: "regen" })
    setTimeout(() => {
      toast.dismiss("regen")
      router.push("/generate")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl" />
      </div>
      <Particles />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                  <History className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-foreground">Generation History</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {isLoading ? (
          <LoadingSkeleton />
        ) : jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <SummaryCards jobs={jobs} />

            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FilterBar onFilterChange={setFilters} />
            </motion.div>

            {/* Job List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No jobs match your filters</p>
                </div>
              ) : (
                filteredJobs
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((job, index) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      index={index}
                      onView={handleView}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                    />
                  ))
              )}
            </motion.div>

            {/* Pagination hint */}
            {filteredJobs.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-muted-foreground py-4"
              >
                Showing {filteredJobs.length} of {jobs.length} generations
              </motion.p>
            )}
          </div>
        )}
      </main>

      {/* Job Details Drawer */}
      <JobDetailsDrawer
        job={selectedJob}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onRegenerate={handleRegenerate}
        onDelete={handleDelete}
      />
    </div>
  )
}
