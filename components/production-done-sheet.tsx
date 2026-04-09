'use client'

import { useState } from 'react'
import { X, CheckCircle2, Upload, File } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductionStatusBadge } from './production-status-badge'
import {
  PRODUCTION_STATUS_OPTIONS,
  ProductionStatus,
  type ProductionStatusData,
} from '@/lib/production-status-types'

interface ProductionDoneSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (productionData: ProductionStatusData) => void
  contentTitle?: string
  contentId?: string
  currentStatus?: ProductionStatus
  currentDate?: string | null
  currentNotes?: string | null
}

export function ProductionDoneSheet({
  isOpen,
  onClose,
  onSave,
  contentTitle = 'Content Item',
  contentId,
  currentStatus,
  currentDate,
  currentNotes,
}: ProductionDoneSheetProps) {
  const today = new Date().toISOString().split('T')[0]
  
  const [status, setStatus] = useState<ProductionStatus>(currentStatus || 'ready_to_schedule')
  const [completedAt, setCompletedAt] = useState(currentDate || today)
  const [notes, setNotes] = useState(currentNotes || '')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setUploadPreview(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setUploadPreview(null)
      }
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadPreview(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({
        status,
        completedAt,
        notes: notes.trim() || null,
        productionFile: uploadedFile || undefined,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    // Reset form state
    setStatus(currentStatus || 'ready_to_schedule')
    setCompletedAt(currentDate || today)
    setNotes(currentNotes || '')
    removeFile()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-5 border-b border-blue-200 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Mark Production Done</h2>
            <p className="text-sm text-slate-600 mt-0.5 truncate">{contentTitle}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="p-1 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Production Status Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Production Status <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {PRODUCTION_STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value as ProductionStatus)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
                    status === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center', status === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300')}>
                      {status === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{option.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {option.value === 'ready_to_schedule' && 'Content meets quality bar and is ready for scheduling'}
                        {option.value === 'needs_review' && 'Content has issues that need attention before scheduling'}
                        {option.value === 'blocked' && 'Waiting on external dependencies'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Production Completion Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Completed On <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={completedAt}
              onChange={(e) => setCompletedAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Production File <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            {!uploadedFile ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag</p>
                  <p className="text-xs text-gray-500 mt-1">Images, videos, documents (Max 50MB)</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                />
              </label>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {uploadPreview ? (
                      <img src={uploadPreview} alt="Preview" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <File className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes - Show only for "Needs Review" or "Blocked" */}
          {(status === 'needs_review' || status === 'blocked') && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notes {status === 'needs_review' ? '(What needs to be fixed?)' : '(What\'s blocking this?)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={status === 'needs_review' ? 'Describe the issues...' : 'Describe the blocker...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Preview of what will be saved */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Preview</p>
            <div className="flex items-center gap-2">
              <ProductionStatusBadge 
                status={status} 
                completedAt={completedAt}
                size="md"
                showLabel
                showDate
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-2xl flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Mark as Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
