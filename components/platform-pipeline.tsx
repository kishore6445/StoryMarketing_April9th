'use client'

import { useMemo } from 'react'
import { Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Platform } from '@/lib/platform-targets-service'
import type { ContentRecordListItem } from '@/lib/content-records'

interface PlatformPipelineProps {
  platform: Platform
  targetCount: number
  contentRecords?: ContentRecordListItem[]
  onEditTarget?: () => void
}

export function PlatformPipeline({
  platform,
  targetCount,
  contentRecords = [],
  onEditTarget,
}: PlatformPipelineProps) {
  // Filter records for this platform and calculate stats
  const stats = useMemo(() => {
    const platformRecords = contentRecords.filter(
      (record) => (record.platform || '').toLowerCase() === platform.toLowerCase()
    )

    const productionDone = platformRecords.filter(
      (r) => r.status === 'production_done' || (r.productionStatus && !r.publishedDate)
    ).length

    const scheduled = platformRecords.filter(
      (r) => r.scheduledDate && !r.publishedDate
    ).length

    const published = platformRecords.filter(
      (r) => r.publishedDate
    ).length

    return {
      total: platformRecords.length,
      productionDone,
      scheduled,
      published,
      gap: Math.max(0, targetCount - published),
    }
  }, [platform, targetCount, contentRecords])

  return (
    <div className="space-y-6">
      {/* Platform Pipeline Visualization */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="grid grid-cols-4 gap-4">
          {/* Target */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 font-medium uppercase mb-2">Target</div>
            <div className="text-3xl font-bold text-gray-900">{targetCount}</div>
            <div className="text-xs text-gray-500 mt-2">{platform}</div>
          </div>

          {/* Production Done */}
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="text-sm text-amber-700 font-medium uppercase mb-2">In Production</div>
            <div className="text-3xl font-bold text-amber-600">{stats.productionDone}</div>
            <div className="text-xs text-amber-600 mt-2">being created</div>
          </div>

          {/* Scheduled */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-700 font-medium uppercase mb-2">Scheduled</div>
            <div className="text-3xl font-bold text-blue-600">{stats.scheduled}</div>
            <div className="text-xs text-blue-600 mt-2">ready to post</div>
          </div>

          {/* Published */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-700 font-medium uppercase mb-2">Published</div>
            <div className="text-3xl font-bold text-green-600">{stats.published}</div>
            <div className="text-xs text-green-600 mt-2">live</div>
          </div>
        </div>

        {/* Gap Analysis */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Target → Published:</span>
              <div className="text-lg font-bold text-red-600 mt-1">
                {stats.gap} gap
              </div>
            </div>
            <div>
              <span className="text-gray-600">Progress:</span>
              <div className="text-lg font-bold text-blue-600 mt-1">
                {targetCount > 0 ? Math.round((stats.published / targetCount) * 100) : 0}%
              </div>
            </div>
            <div>
              <span className="text-gray-600">On Track:</span>
              <div className={cn('text-lg font-bold mt-1', 
                stats.published >= targetCount ? 'text-green-600' : 'text-amber-600'
              )}>
                {stats.published >= targetCount ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onEditTarget}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
        >
          <Edit2 className="w-4 h-4" />
          Edit {platform} Target
        </button>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="text-sm font-semibold text-gray-700 mb-3">Platform Summary</div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total content pieces for {platform}:</span>
            <span className="font-medium text-gray-900">{stats.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Completion rate:</span>
            <span className="font-medium text-gray-900">
              {targetCount > 0 ? Math.round((stats.published / targetCount) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Posts remaining this month:</span>
            <span className={cn('font-medium', stats.gap > 0 ? 'text-amber-600' : 'text-green-600')}>
              {stats.gap}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
