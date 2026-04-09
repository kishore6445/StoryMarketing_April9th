'use client'

import { CheckCircle2, AlertCircle, Clock, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  getProductionStatusConfig, 
  ProductionStatus, 
  formatProductionDate 
} from '@/lib/production-status-types'

interface ProductionStatusBadgeProps {
  status?: ProductionStatus
  completedAt?: string | null
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showDate?: boolean
  className?: string
}

export function ProductionStatusBadge({ 
  status,
  completedAt,
  size = 'md', 
  showLabel = false,
  showDate = false,
  className 
}: ProductionStatusBadgeProps) {
  // If no status provided, show "not started" state
  const getStatusConfig = () => {
    if (!status) {
      return {
        icon: Minus,
        color: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
        label: 'Not Started',
        iconColor: 'text-gray-600'
      }
    }

    const config = getProductionStatusConfig(status)
    if (!config) {
      return {
        icon: Clock,
        color: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
        label: 'Unknown',
        iconColor: 'text-gray-600'
      }
    }

    const iconMap = {
      ready_to_schedule: { icon: CheckCircle2, iconColor: 'text-green-600' },
      needs_review: { icon: AlertCircle, iconColor: 'text-amber-600' },
      blocked: { icon: Clock, iconColor: 'text-gray-600' },
    }

    return {
      icon: iconMap[status].icon,
      color: config.color,
      label: config.label,
      iconColor: iconMap[status].iconColor
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  if (!showLabel && !showDate) {
    return (
      <div 
        className={cn(
          'inline-flex items-center justify-center rounded-full border',
          config.color,
          sizeClasses[size],
          className
        )}
        title={config.label}
      >
        <Icon className={cn(config.iconColor, iconSizeClasses[size])} />
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(config.iconColor, iconSizeClasses[size])} />
      <span>{config.label}</span>
      {showDate && completedAt && (
        <span className="text-xs opacity-75">({formatProductionDate(completedAt)})</span>
      )}
    </div>
  )
}
