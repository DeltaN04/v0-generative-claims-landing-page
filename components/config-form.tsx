"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Info, Zap, Scale, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  rows: z.number().min(1).max(10000),
  claimRate: z.number().min(0).max(100),
  enableReflexion: z.boolean(),
  usePageIndex: z.boolean(),
  statisticalMatching: z.boolean(),
  constraints: z.string(),
  speed: z.enum(["fast", "balanced", "quality"]),
  seed: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ConfigFormProps {
  onGenerate: (data: FormData) => void
  isGenerating: boolean
}

export function ConfigForm({ onGenerate, isGenerating }: ConfigFormProps) {
  const [rows, setRows] = useState(1000)
  const [claimRate, setClaimRate] = useState(6)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: 1000,
      claimRate: 6,
      enableReflexion: true,
      usePageIndex: true,
      statisticalMatching: false,
      constraints: "all",
      speed: "balanced",
      seed: "",
    },
  })

  const estimatedTime = () => {
    const baseTime = rows * 0.05
    const speedMultiplier =
      form.watch("speed") === "fast"
        ? 0.5
        : form.watch("speed") === "quality"
          ? 2
          : 1
    const seconds = Math.ceil(baseTime * speedMultiplier)
    if (seconds < 60) return `~${seconds}s`
    return `~${Math.ceil(seconds / 60)}m`
  }

  const onSubmit = (data: FormData) => {
    onGenerate({ ...data, rows, claimRate })
  }

  return (
    <TooltipProvider>
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Configure Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Number of Rows Slider */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Number of Rows
                </Label>
                <motion.span
                  key={rows}
                  initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                  animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                  className="text-sm font-mono font-semibold bg-muted px-2 py-1 rounded"
                >
                  {rows.toLocaleString()}
                </motion.span>
              </div>
              <Slider
                value={[rows]}
                onValueChange={([v]) => setRows(v)}
                min={1}
                max={10000}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>10,000</span>
              </div>
            </motion.div>

            {/* Claim Rate Slider */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-foreground">
                    Claim Rate Target
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Target percentage of records that will have claims. Real
                        insurance data typically has 5-8% claim rates.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <motion.span
                  key={claimRate}
                  initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                  animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                  className="text-sm font-mono font-semibold bg-muted px-2 py-1 rounded"
                >
                  {claimRate}%
                </motion.span>
              </div>
              <Slider
                value={[claimRate]}
                onValueChange={([v]) => setClaimRate(v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </motion.div>

            {/* Toggle Switches */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="reflexion"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Enable Reflexion Agent
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Self-improving AI that learns from generation mistakes
                        to improve accuracy over time.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  id="reflexion"
                  checked={form.watch("enableReflexion")}
                  onCheckedChange={(v) => form.setValue("enableReflexion", v)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors">
                <Label
                  htmlFor="pageindex"
                  className="text-sm font-medium cursor-pointer"
                >
                  Use PageIndex Retrieval
                </Label>
                <Switch
                  id="pageindex"
                  checked={form.watch("usePageIndex")}
                  onCheckedChange={(v) => form.setValue("usePageIndex", v)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors">
                <Label
                  htmlFor="statistical"
                  className="text-sm font-medium cursor-pointer"
                >
                  Statistical Matching
                </Label>
                <Switch
                  id="statistical"
                  checked={form.watch("statisticalMatching")}
                  onCheckedChange={(v) =>
                    form.setValue("statisticalMatching", v)
                  }
                />
              </div>
            </motion.div>

            {/* Advanced Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced" className="border-border/30">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Advanced Settings
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    {/* Constraint Selector */}
                    <div className="space-y-2">
                      <Label className="text-sm">Constraints</Label>
                      <Select
                        value={form.watch("constraints")}
                        onValueChange={(v) => form.setValue("constraints", v)}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select constraints" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Constraints</SelectItem>
                          <SelectItem value="functional">
                            Functional Dependencies Only
                          </SelectItem>
                          <SelectItem value="statistical">
                            Statistical Only
                          </SelectItem>
                          <SelectItem value="custom">
                            Custom Selection
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Generation Speed */}
                    <div className="space-y-3">
                      <Label className="text-sm">Generation Speed</Label>
                      <RadioGroup
                        value={form.watch("speed")}
                        onValueChange={(v) =>
                          form.setValue(
                            "speed",
                            v as "fast" | "balanced" | "quality"
                          )
                        }
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fast" id="fast" />
                          <Label
                            htmlFor="fast"
                            className="text-sm cursor-pointer flex items-center gap-1"
                          >
                            <Zap className="h-3 w-3" />
                            Fast
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="balanced" id="balanced" />
                          <Label
                            htmlFor="balanced"
                            className="text-sm cursor-pointer flex items-center gap-1"
                          >
                            <Scale className="h-3 w-3" />
                            Balanced
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="quality" id="quality" />
                          <Label
                            htmlFor="quality"
                            className="text-sm cursor-pointer flex items-center gap-1"
                          >
                            <Sparkles className="h-3 w-3" />
                            Quality
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Custom Seed */}
                    <div className="space-y-2">
                      <Label htmlFor="seed" className="text-sm">
                        Custom Seed (optional)
                      </Label>
                      <Input
                        id="seed"
                        placeholder="Enter seed for reproducibility"
                        className="bg-background/50"
                        {...form.register("seed")}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 pt-2"
            >
              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-5 w-5" />
                    Generating...
                  </span>
                ) : (
                  "Generate Data"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Estimated time: <span className="font-mono">{estimatedTime()}</span>
              </p>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
