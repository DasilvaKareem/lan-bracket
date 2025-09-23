'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
}

export default function ImageUpload({ value, onChange, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('image', file)

      // Upload to your preferred service (placeholder implementation)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const imageUrl = data.url

      setPreview(imageUrl)
      onChange(imageUrl)
    } catch (error) {
      console.error('Upload error:', error)
      
      // Fallback: Convert to data URL for immediate use
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setPreview(dataUrl)
          onChange(dataUrl)
          console.log('Using data URL as fallback')
        }
        reader.readAsDataURL(file)
      } catch (previewError) {
        console.error('Failed to create data URL:', previewError)
        alert('Failed to upload image. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        {preview ? (
          <div className="relative group">
            <div className="aspect-square w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-600">
              <img
                src={preview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                type="button"
                onClick={handleClick}
                className="px-3 py-1 bg-white/20 text-white rounded text-sm hover:bg-white/30 transition-colors"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="aspect-square w-32 h-32 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center hover:border-slate-500 hover:bg-slate-800/50 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-sm text-slate-400 text-center">
                  Click to upload
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-slate-400">
        Recommended: Square image, max 5MB
      </p>
    </div>
  )
}