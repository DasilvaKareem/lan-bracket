'use client'

import { useState, useEffect } from 'react'
import Dialog from './Dialog'
import { Loader2 } from 'lucide-react'
import ImageUpload from './ImageUpload'

interface EditTournamentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  tournament: any
  loading?: boolean
}

export default function EditTournamentDialog({
  isOpen,
  onClose,
  onSave,
  tournament,
  loading = false
}: EditTournamentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxPlayers: 8,
    coverPhoto: '',
    startDateTime: '',
    endDateTime: ''
  })

  useEffect(() => {
    if (tournament && isOpen) {
      setFormData({
        name: tournament.name || '',
        description: tournament.description || '',
        maxPlayers: tournament.maxPlayers || 8,
        coverPhoto: tournament.coverPhoto || '',
        startDateTime: tournament.startDateTime ? new Date(tournament.startDateTime).toISOString().slice(0, 16) : '',
        endDateTime: tournament.endDateTime ? new Date(tournament.endDateTime).toISOString().slice(0, 16) : ''
      })
    }
  }, [tournament?.id, isOpen]) // Only depend on tournament ID to avoid constant resets

  const handleSave = () => {
    // Create a clean copy without empty strings for dates
    const cleanData = {
      ...formData,
      coverPhoto: formData.coverPhoto || null,
      startDateTime: formData.startDateTime || null,
      endDateTime: formData.endDateTime || null,
    }
    onSave(cleanData)
  }

  // Prevent form reset when tournament updates
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Tournament">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Tournament Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Tournament name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Tournament description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Cover Photo (Optional)
          </label>
          <div className="flex gap-4 items-start">
            <ImageUpload
              value={formData.coverPhoto}
              onChange={(url) => handleInputChange('coverPhoto', url)}
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Or paste image URL"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.coverPhoto}
                onChange={(e) => handleInputChange('coverPhoto', e.target.value)}
              />
              <p className="mt-2 text-sm text-slate-400">
                Upload an image or paste a URL
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDateTime" className="block text-sm font-medium text-slate-300 mb-2">
              Start Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              id="startDateTime"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={formData.startDateTime}
              onChange={(e) => handleInputChange('startDateTime', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="endDateTime" className="block text-sm font-medium text-slate-300 mb-2">
              End Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              id="endDateTime"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={formData.endDateTime}
              onChange={(e) => handleInputChange('endDateTime', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxPlayers" className="block text-sm font-medium text-slate-300 mb-2">
            Maximum Players
          </label>
          <select
            id="maxPlayers"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={formData.maxPlayers}
            onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
            disabled={tournament?.status !== 'registration_open'}
          >
            <option value={4}>4 Players</option>
            <option value={8}>8 Players</option>
            <option value={16}>16 Players</option>
            <option value={32}>32 Players</option>
            <option value={64}>64 Players</option>
          </select>
          {tournament?.status !== 'registration_open' && (
            <p className="mt-2 text-sm text-slate-400">
              Cannot change max players after tournament has started
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </Dialog>
  )
}