// Production Status Types and Utilities
// Defines the workflow for content moving through the production stage

export const PRODUCTION_STATUS_OPTIONS = [
  { value: "ready_to_schedule", label: "Ready to Schedule", color: "bg-green-500/10 text-green-700 border-green-500/20" },
  { value: "needs_review", label: "Needs Review", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  { value: "blocked", label: "Blocked", color: "bg-gray-500/10 text-gray-700 border-gray-500/20" },
] as const

export type ProductionStatus = (typeof PRODUCTION_STATUS_OPTIONS)[number]["value"]

export interface ProductionStatusData {
  status: ProductionStatus
  completedAt: string | null
  notes: string | null
}

export function getProductionStatusConfig(status: ProductionStatus) {
  return PRODUCTION_STATUS_OPTIONS.find(opt => opt.value === status)
}

export function getProductionStatusLabel(status: ProductionStatus): string {
  return getProductionStatusConfig(status)?.label || "Unknown"
}

export function getProductionStatusColor(status: ProductionStatus): string {
  return getProductionStatusConfig(status)?.color || "bg-gray-500/10 text-gray-700 border-gray-500/20"
}

export function formatProductionDate(dateString: string | null): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
