"use client"

import { cn } from "@/lib/utils"
import { CheckSquare, Pencil, Trash2 } from "lucide-react"
import { ProductionStatusBadge } from "./production-status-badge"
import type { ContentRecordListItem } from "@/lib/content-records"
import type { ProductionStatus } from "@/lib/production-status-types"

interface ContentItem extends ContentRecordListItem {
  productionStatus?: ProductionStatus
  productionCompletedAt?: string | null
}

interface ContentPipelineStageViewProps {
  items: ContentItem[]
  onMarkProductionDone?: (itemId: string) => void
  onEdit?: (item: ContentItem) => void
  onDelete?: (item: ContentItem) => void
  activeStage?: 'target' | 'production_done' | 'scheduled' | 'published' | null
}

const stageConfig = {
  target: {
    label: "Target",
    color: "bg-gray-50",
    borderColor: "border-gray-200",
    badgeColor: "bg-gray-100 text-gray-700",
  },
  production_done: {
    label: "Production Done",
    color: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  published: {
    label: "Published",
    color: "bg-green-50",
    borderColor: "border-green-200",
    badgeColor: "bg-green-100 text-green-700",
  },
}

// Helper to determine pipeline stage based on status
const getPipelineStage = (item: ContentItem): 'target' | 'production_done' | 'scheduled' | 'published' => {
  if (item.status === "Completed") return "published"
  if (item.status === "Scheduled") return "scheduled"
  if (item.productionStatus) return "production_done"
  return "target"
}

export function ContentPipelineStageView({
  items,
  onMarkProductionDone,
  onEdit,
  onDelete,
  activeStage,
}: ContentPipelineStageViewProps) {
  // Group items by pipeline stage
  const stages = {
    target: items.filter(item => getPipelineStage(item) === "target"),
    production_done: items.filter(item => getPipelineStage(item) === "production_done"),
    scheduled: items.filter(item => getPipelineStage(item) === "scheduled"),
    published: items.filter(item => getPipelineStage(item) === "published"),
  }

  // Filter by active stage if selected
  const stageKeys = activeStage ? [activeStage] : Object.keys(stages) as Array<'target' | 'production_done' | 'scheduled' | 'published'>

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-600 font-medium">No content items to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stageKeys.map((stageKey) => {
          const config = stageConfig[stageKey]
          const stageItems = stages[stageKey]

          return (
            <div
              key={stageKey}
              className={cn(
                "rounded-lg border-2 p-4 min-h-96",
                config.borderColor,
                config.color,
                activeStage === stageKey && "ring-2 ring-blue-500 shadow-lg"
              )}
            >
              {/* Stage Header */}
              <div className="mb-4 pb-4 border-b border-gray-300">
                <h3 className="font-bold text-gray-900">{config.label}</h3>
                <p className="text-sm font-semibold text-gray-600 mt-1">{stageItems.length} items</p>
              </div>

              {/* Stage Items */}
              <div className="space-y-3">
                {stageItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-500 font-medium">No items in this stage</p>
                  </div>
                ) : (
                  stageItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
                    >
                      {/* Item Title */}
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{item.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 truncate">{item.client}</p>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", config.badgeColor)}>
                          {stageKey === "production_done" ? item.productionStatus || "Pending" : item.status}
                        </span>
                        {item.productionStatus && (
                          <ProductionStatusBadge status={item.productionStatus} size="sm" />
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-200">
                        {stageKey === "target" && onMarkProductionDone && (
                          <button
                            onClick={() => onMarkProductionDone(item.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                            title="Mark as production done"
                          >
                            <CheckSquare className="w-3 h-3" />
                            Production
                          </button>
                        )}
                        {stageKey !== "published" && onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state for active filter */}
      {activeStage && stages[activeStage].length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 font-medium">No items in {stageConfig[activeStage].label} stage</p>
          <p className="text-sm text-gray-500 mt-2">Try selecting a different stage or clearing the filter</p>
        </div>
      )}
    </div>
  )
}
