"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottleneckInsight {
  type: "shortfall" | "production_lag" | "scheduling_lag" | "publishing_lag"
  message: string
  count?: number
  severity: "low" | "medium" | "high"
}

interface PlatformMetric {
  name: string
  achieved: number
  target: number
}

interface ContentVisibilityHeroProps {
  target: number
  published: number
  scheduled: number
  insights: BottleneckInsight[]
  platformMetrics?: PlatformMetric[]
  clientName?: string
  isAllClients?: boolean
}

export function ContentVisibilityHero({
  target,
  published,
  scheduled,
  insights,
  platformMetrics = [],
  clientName = "All Clients",
  isAllClients = false,
}: ContentVisibilityHeroProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const progress = target > 0 ? (published / target) * 100 : 0
  const isOnTrack = published >= Math.floor(target * 0.7)
  const needsAttention = published < Math.floor(target * 0.5) && target > 0

  let statusLabel = "On Track"
  let statusColor = "text-green-600"
  let statusBg = "bg-green-50"
  let statusDot = "bg-green-500"
  let statusBorder = "border-green-200"

  if (needsAttention) {
    statusLabel = "Needs Attention"
    statusColor = "text-amber-600"
    statusBg = "bg-amber-50"
    statusDot = "bg-amber-500"
    statusBorder = "border-amber-200"
  } else if (!isOnTrack && target > 0) {
    statusLabel = "At Risk"
    statusColor = "text-red-600"
    statusBg = "bg-red-50"
    statusDot = "bg-red-500"
    statusBorder = "border-red-200"
  }

  const getProgressColor = (achieved: number, target: number) => {
    const percentage = target > 0 ? (achieved / target) * 100 : 0
    if (percentage >= 70) return "bg-green-500"
    if (percentage >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  // Get primary bottleneck (most critical)
  const primaryBottleneck = insights.length > 0 ? insights[0] : null
  const bottleneckIcon = primaryBottleneck?.type === "shortfall" ? AlertCircle : Clock

  // Recommended action logic
  const getRecommendedAction = () => {
    if (published < Math.floor(target * 0.7)) {
      const gap = target - published
      return `Publish ${gap} more post${gap !== 1 ? "s" : ""} to hit target`
    }
    if (scheduled > published) {
      const pending = scheduled - published
      return `Review and publish ${pending} scheduled post${pending !== 1 ? "s" : ""}`
    }
    return "Continue monitoring publication pace"
  }

  return (
    <div className="space-y-4">
      {/* Hero Card - 5 Second View */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-lg",
          statusBg,
          statusBorder
        )}
      >
        {/* Header with Status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
              <h2 className="text-xl font-bold text-gray-900">Content Publishing Status</h2>
            </div>
            <p className="text-sm text-gray-500 ml-8">{clientName}</p>
          </div>

          <div
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap",
              statusBg,
              statusColor
            )}
          >
            <span className={cn("w-2.5 h-2.5 rounded-full", statusDot)} />
            {statusLabel}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-gray-700">Publication Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={cn("h-3 rounded-full transition-all", getProgressColor(published, target))}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-900">
              {published} of {target} published
            </span>
            {target - published > 0 && (
              <span className="text-red-600 font-medium">{target - published} to go</span>
            )}
          </div>
        </div>

        {/* Two Column Info Section */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="space-y-1">
            <p className="text-xs text-gray-600 font-medium">SCHEDULED</p>
            <p className="text-2xl font-bold text-blue-600">{scheduled}</p>
            <p className="text-xs text-gray-500">awaiting publication</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-600 font-medium">DAYS LEFT</p>
            <p className="text-2xl font-bold text-gray-900">~7</p>
            <p className="text-xs text-gray-500">in current month</p>
          </div>
        </div>

        {/* Critical Info Section - Always Visible */}
        {primaryBottleneck && (
          <div
            className={cn(
              "rounded-lg p-4 flex items-start gap-3 mb-4",
              primaryBottleneck.severity === "high"
                ? "bg-red-50 border border-red-200"
                : "bg-amber-50 border border-amber-200"
            )}
          >
            {primaryBottleneck.type === "shortfall" ? (
              <AlertCircle
                className={cn(
                  "w-5 h-5 flex-shrink-0 mt-0.5",
                  primaryBottleneck.severity === "high"
                    ? "text-red-500"
                    : "text-amber-500"
                )}
              />
            ) : (
              <Clock
                className={cn(
                  "w-5 h-5 flex-shrink-0 mt-0.5",
                  primaryBottleneck.severity === "high"
                    ? "text-red-500"
                    : "text-amber-500"
                )}
              />
            )}
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  primaryBottleneck.severity === "high"
                    ? "text-red-700"
                    : "text-amber-700"
                )}
              >
                {primaryBottleneck.message}
              </p>
            </div>
          </div>
        )}

        {/* Recommended Action */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Recommended Action</p>
            <p className="text-sm text-blue-700 mt-1">{getRecommendedAction()}</p>
          </div>
        </div>
      </div>

      {/* Expanded Detailed View */}
      {isExpanded && (
        <div className="space-y-4">
          {/* All Insights */}
          {insights.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                All Bottlenecks
              </h4>
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-lg border p-4 flex items-start gap-3",
                      insight.severity === "high"
                        ? "bg-red-50 border-red-200"
                        : insight.severity === "medium"
                          ? "bg-amber-50 border-amber-200"
                          : "bg-blue-50 border-blue-200"
                    )}
                  >
                    {insight.type === "shortfall" ? (
                      <AlertCircle
                        className={cn(
                          "w-5 h-5 flex-shrink-0 mt-0.5",
                          insight.severity === "high"
                            ? "text-red-500"
                            : insight.severity === "medium"
                              ? "text-amber-500"
                              : "text-blue-500"
                        )}
                      />
                    ) : (
                      <Clock
                        className={cn(
                          "w-5 h-5 flex-shrink-0 mt-0.5",
                          insight.severity === "high"
                            ? "text-red-500"
                            : insight.severity === "medium"
                              ? "text-amber-500"
                              : "text-blue-500"
                        )}
                      />
                    )}
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          insight.severity === "high"
                            ? "text-red-700"
                            : insight.severity === "medium"
                              ? "text-amber-700"
                              : "text-blue-700"
                        )}
                      >
                        {insight.message}
                      </p>
                      {insight.count !== undefined && (
                        <p
                          className={cn(
                            "text-xs mt-1",
                            insight.severity === "high"
                              ? "text-red-600"
                              : insight.severity === "medium"
                                ? "text-amber-600"
                                : "text-blue-600"
                          )}
                        >
                          Count: {insight.count}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Breakdown */}
          {platformMetrics && platformMetrics.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Platform Breakdown
              </h4>
              <div className="space-y-4">
                {platformMetrics.map((platform) => {
                  const platformProgress =
                    platform.target > 0
                      ? (platform.achieved / platform.target) * 100
                      : 0
                  const platformColor = getProgressColor(
                    platform.achieved,
                    platform.target
                  )

                  return (
                    <div key={platform.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {platform.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {platform.achieved}/{platform.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full", platformColor)}
                          style={{
                            width: `${Math.min(platformProgress, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
