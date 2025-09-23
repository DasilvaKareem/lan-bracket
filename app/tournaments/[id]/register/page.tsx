'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UserPlus, Loader2, Trophy } from 'lucide-react'
import Link from 'next/link'
import SuccessDialog from '@/components/SuccessDialog'
import Header from '@/components/Header'

interface Tournament {
  id: string
  name: string
  description?: string
  coverPhoto?: string
  status: string
}

export default function RegisterForTournament() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tournamentLoading, setTournamentLoading] = useState(true)
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    gamertag: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchTournament()
  }, [params.id])

  const fetchTournament = async () => {
    try {
      const response = await fetch(`/api/tournaments/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTournament(data)
      }
    } catch (error) {
      console.error('Error fetching tournament:', error)
    } finally {
      setTournamentLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/tournaments/${params.id}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to register')
      }

      // Show success dialog
      setShowSuccess(true)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push(`/tournaments/${params.id}`)
  }

  if (tournamentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tournament...</div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tournament Not Found</h1>
          <Link href="/tournaments" className="text-blue-400 hover:text-blue-300">
            ← Back to tournaments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <Header 
        showBackToTournaments={true}
        showBackToHome={true}
      />
      <div className="flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {/* Tournament Cover Photo */}
          {tournament.coverPhoto && (
            <div className="aspect-[2/1] relative">
              <img
                src={tournament.coverPhoto}
                alt={tournament.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Register for {tournament.name}
                </h1>
                {tournament.description && (
                  <p className="text-slate-200 text-sm">{tournament.description}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="p-8">
            {!tournament.coverPhoto && (
              <div className="flex items-center justify-center mb-8">
                <UserPlus className="w-12 h-12 text-green-500 mr-3" />
                <h1 className="text-3xl font-bold text-white">Register for {tournament.name}</h1>
              </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="gamertag" className="block text-sm font-medium text-slate-300 mb-2">
                Gamertag / Display Name
              </label>
              <input
                type="text"
                id="gamertag"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Your gamertag or preferred display name"
                value={formData.gamertag}
                onChange={(e) => setFormData({ ...formData, gamertag: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                WhatsApp Phone #
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <p className="mt-2 text-sm text-slate-400">
                Include country code (e.g., +1 for US/Canada). We'll use this to contact you if you fail to show up for your matches
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>

            <div className="mt-6 text-center">
              <Link
                href={`/tournaments/${params.id}`}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Back to tournament
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Registration Successful!"
        message="Welcome to the tournament! You've been successfully registered."
        buttonText="View Tournament"
      />
    </div>
  )
}