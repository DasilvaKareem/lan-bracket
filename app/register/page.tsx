'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'

export default function RegisterTournament() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxPlayers: 8,
    adminPasscode: '',
    coverPhoto: '',
    startDateTime: '',
    endDateTime: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create tournament')
      }

      const tournament = await response.json()
      router.push(`/tournaments/${tournament.id}`)
    } catch (error) {
      console.error('Error creating tournament:', error)
      alert('Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <Header 
        showBackToHome={true}
      />
      <div className="flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <Trophy className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-3xl font-bold text-white">Create Tournament</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Tournament Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Epic LAN Tournament 2024"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                placeholder="Prize pool, rules, etc..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="maxPlayers" className="block text-sm font-medium text-slate-300 mb-2">
                Maximum Players
              </label>
              <select
                id="maxPlayers"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.maxPlayers}
                onChange={(e) => setFormData({...formData, maxPlayers: parseInt(e.target.value)})}
              >
                <option value={4}>4 Players</option>
                <option value={8}>8 Players</option>
                <option value={16}>16 Players</option>
                <option value={32}>32 Players</option>
                <option value={64}>64 Players</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cover Photo (Optional)
              </label>
              <div className="flex gap-4 items-start">
                <ImageUpload
                  value={formData.coverPhoto}
                  onChange={(url) => setFormData({...formData, coverPhoto: url})}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Or paste image URL"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.coverPhoto}
                    onChange={(e) => setFormData({...formData, coverPhoto: e.target.value})}
                  />
                  <p className="mt-2 text-sm text-slate-400">
                    Upload an image or paste a URL for tournament gallery display
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
                  onChange={(e) => setFormData({...formData, startDateTime: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, endDateTime: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label htmlFor="adminPasscode" className="block text-sm font-medium text-slate-300 mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                id="adminPasscode"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter a secure passcode"
                value={formData.adminPasscode}
                onChange={(e) => setFormData({...formData, adminPasscode: e.target.value})}
              />
              <p className="mt-2 text-sm text-slate-400">
                You'll need this to manage the tournament
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Creating Tournament...
                </span>
              ) : (
                'Create Tournament'
              )}
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  )
}