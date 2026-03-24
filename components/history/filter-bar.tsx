"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Search, X } from "lucide-react"
import { motion } from "framer-motion"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterBarProps {
  onFilterChange: (filters: {
    dateRange: DateRange | undefined
    status: string
    searchQuery: string
  }) => void
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [status, setStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range)
    onFilterChange({ dateRange: range, status, searchQuery })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFilterChange({ dateRange, status: value, searchQuery })
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFilterChange({ dateRange, status, searchQuery: value })
  }

  const clearFilters = () => {
    setDateRange(undefined)
    setStatus("all")
    setSearchQuery("")
    onFilterChange({ dateRange: undefined, status: "all", searchQuery: "" })
  }

  const hasActiveFilters = dateRange || status !== "all" || searchQuery

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3"
    >
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd")} -{" "}
                  {format(dateRange.to, "LLL dd")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-card/95 backdrop-blur-md border-border/50" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Status Filter */}
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[140px] bg-card/50 backdrop-blur-sm border-border/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-card/95 backdrop-blur-md border-border/50">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
        </SelectContent>
      </Select>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search Job ID..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 w-[200px] bg-card/50 backdrop-blur-sm border-border/50"
        />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
