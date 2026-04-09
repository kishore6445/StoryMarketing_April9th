"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentPipelineFlowProps {
  target: number
  productionDone: number
  scheduled: number
  published: number
  onStageClick?: (stage: 'target' | 'production_done' | 'scheduled' | 'published') => void
  activeStage?: 'target' | 'production_done' | 'scheduled' | 'published' | null
}

export function ContentPipelineFlow({
  target,
  productionDone,
  scheduled,
  published,
  onStageClick,
  activeStage,
}: ContentPipelineFlowProps) {
  const stages = [
    { key: "target" as const, label: "Target", value: target, color: "bg-gray-100 text-gray-700", hoverColor: "hover:bg-gray-200" },
    { key: "production_done" as const, label: "Production Done", value: productionDone, color: "bg-amber-100 text-amber-700", hoverColor: "hover:bg-amber-200" },
    { key: "scheduled" as const, label: "Scheduled", value: scheduled, color: "bg-blue-100 text-blue-700", hoverColor: "hover:bg-blue-200" },
    { key: "published" as const, label: "Published", value: published, color: "bg-green-100 text-green-700", hoverColor: "hover:bg-green-200" },
  ]

  return (
    <div className="mb-8 p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Content Pipeline</h2>
        <p className="text-sm text-gray-600 mt-1">Track content progression through each production stage</p>
      </div>
      
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4">
        {stages.map((stage, idx) => (
          <div key={stage.key} className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => onStageClick?.(stage.key)}
              className={cn(
                "px-6 py-4 rounded-lg text-center min-w-32 transition-all cursor-pointer",
                stage.color,
                stage.hoverColor,
                activeStage === stage.key && "ring-3 ring-blue-500 shadow-lg scale-105",
                "hover:shadow-md"
              )}
              title={`Click to view ${stage.label} items`}
            >
              <div className="text-3xl font-bold">{stage.value}</div>
              <div className="text-sm font-semibold mt-2">{stage.label}</div>
            </button>
            
            {idx < stages.length - 1 && (
              <div className="flex items-center">
                <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Drop-off indicators */}
      {target > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Pipeline Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 font-semibold uppercase">Target → Production</p>
              <p className="text-2xl font-bold text-amber-600 mt-2">
                {Math.round(((target - productionDone) / target) * 100)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">of content in production</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 font-semibold uppercase">Production → Scheduled</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {productionDone > 0 ? Math.round(((productionDone - scheduled) / productionDone) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-600 mt-1">waiting to be scheduled</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 font-semibold uppercase">Scheduled → Published</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {scheduled > 0 ? Math.round(((scheduled - published) / scheduled) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-600 mt-1">scheduled but not published</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
