export interface GenerationJob {
  id: string
  timestamp: Date
  status: "completed" | "failed" | "in_progress" | "paused"
  rowCount: number
  claimRate: number
  targetClaimRate: number
  duration: number // in seconds
  config: {
    useReflexion: boolean
    usePageIndex: boolean
    useStatisticalMatching: boolean
    constraints: string[]
    speed: "fast" | "balanced" | "quality"
    seed?: number
  }
  qualityMetrics?: {
    accuracy: number
    completeness: number
    consistency: number
    fdCompliance: number
    statisticalMatch: number
    avgIterations: number
  }
  error?: string
}

export const mockGenerationJobs: GenerationJob[] = [
  {
    id: "gen_8f7a2b3c",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "completed",
    rowCount: 5000,
    claimRate: 6.2,
    targetClaimRate: 6,
    duration: 245,
    config: {
      useReflexion: true,
      usePageIndex: true,
      useStatisticalMatching: true,
      constraints: ["age_vehicle", "region_premium"],
      speed: "balanced",
    },
    qualityMetrics: {
      accuracy: 98.7,
      completeness: 100,
      consistency: 99.2,
      fdCompliance: 100,
      statisticalMatch: 97.8,
      avgIterations: 2.3,
    },
  },
  {
    id: "gen_4e5d6f7a",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "completed",
    rowCount: 10000,
    claimRate: 5.8,
    targetClaimRate: 6,
    duration: 512,
    config: {
      useReflexion: true,
      usePageIndex: true,
      useStatisticalMatching: false,
      constraints: ["age_vehicle"],
      speed: "quality",
    },
    qualityMetrics: {
      accuracy: 99.1,
      completeness: 100,
      consistency: 99.5,
      fdCompliance: 100,
      statisticalMatch: 96.2,
      avgIterations: 3.1,
    },
  },
  {
    id: "gen_1a2b3c4d",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "failed",
    rowCount: 500,
    claimRate: 0,
    targetClaimRate: 6,
    duration: 45,
    config: {
      useReflexion: false,
      usePageIndex: true,
      useStatisticalMatching: true,
      constraints: [],
      speed: "fast",
    },
    error: "Connection timeout during data retrieval",
  },
  {
    id: "gen_9x8y7z6w",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "completed",
    rowCount: 2500,
    claimRate: 6.1,
    targetClaimRate: 6,
    duration: 178,
    config: {
      useReflexion: true,
      usePageIndex: false,
      useStatisticalMatching: true,
      constraints: ["region_premium", "fuel_type"],
      speed: "balanced",
      seed: 42,
    },
    qualityMetrics: {
      accuracy: 97.9,
      completeness: 99.8,
      consistency: 98.7,
      fdCompliance: 100,
      statisticalMatch: 98.1,
      avgIterations: 2.8,
    },
  },
  {
    id: "gen_live_001",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "in_progress",
    rowCount: 3200,
    claimRate: 5.9,
    targetClaimRate: 6,
    duration: 156,
    config: {
      useReflexion: true,
      usePageIndex: true,
      useStatisticalMatching: true,
      constraints: ["age_vehicle", "region_premium"],
      speed: "balanced",
    },
  },
  {
    id: "gen_paused_001",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: "paused",
    rowCount: 1500,
    claimRate: 6.0,
    targetClaimRate: 6,
    duration: 89,
    config: {
      useReflexion: true,
      usePageIndex: true,
      useStatisticalMatching: false,
      constraints: ["age_vehicle"],
      speed: "quality",
    },
  },
  {
    id: "gen_old_001",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "completed",
    rowCount: 8000,
    claimRate: 6.3,
    targetClaimRate: 6,
    duration: 423,
    config: {
      useReflexion: true,
      usePageIndex: true,
      useStatisticalMatching: true,
      constraints: ["age_vehicle", "region_premium", "fuel_type"],
      speed: "quality",
    },
    qualityMetrics: {
      accuracy: 99.3,
      completeness: 100,
      consistency: 99.8,
      fdCompliance: 100,
      statisticalMatch: 99.1,
      avgIterations: 1.9,
    },
  },
]
