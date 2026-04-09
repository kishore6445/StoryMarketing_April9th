'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLATFORMS, type Platform } from '@/lib/platform-targets-service'
import { PlatformPipeline } from './platform-pipeline'

interface PlatformBreakdownSectionProps {
  clientId: string
  selectedMonth: string
  selectedYear?: number
  platformTargets?: Record<Platform, number>
  contentRecords?: any[]
  onEditTarget?: (platform: Platform) => void
}

export function PlatformBreakdownSection({
  clientId,
  selectedMonth,
  selectedYear = new Date().getFullYear(),
  platformTargets = {},
  contentRecords = [],
  onEditTarget,
}: PlatformBreakdownSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0])

  const platformsWithTargets = PLATFORMS.filter(
    (platform) => (platformTargets[platform] || 0) > 0
  )

  if (platformsWithTargets.length === 0) {
    return null // Don't show if no platform targets
  }

  return (
    <div className="mt-8 border border-gray-200 rounded-lg bg-white">
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Platform Breakdown</h3>
          <span className="text-sm text-gray-600">
            {platformsWithTargets.length} platforms tracked
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-6 space-y-6">
          {/* Platform Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {platformsWithTargets.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all',
                  selectedPlatform === platform
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                )}
              >
                {platform}
              </button>
            ))}
          </div>

          {/* Platform Pipeline View */}
          <PlatformPipeline
            platform={selectedPlatform}
            targetCount={platformTargets[selectedPlatform] || 0}
            contentRecords={contentRecords}
            onEditTarget={() => onEditTarget?.(selectedPlatform)}
          />
        </div>
      )}
    </div>
  )
}
