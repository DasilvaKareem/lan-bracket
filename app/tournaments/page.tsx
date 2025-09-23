'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trophy, Users, Calendar, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'

interface Tournament {
  id: string
  name: string
  description: string
  maxPlayers: number
  status: string
  coverPhoto?: string
  startDateTime?: string
  endDateTime?: string
  createdAt: string
  _count: {
    players: number
  }
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments')
      const data = await response.json()
      setTournaments(data)
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open':
        return 'bg-green-600/90 text-white backdrop-blur-sm border border-green-500/30'
      case 'registration_closed':
        return 'bg-orange-600/90 text-white backdrop-blur-sm border border-orange-500/30'
      case 'in_progress':
        return 'bg-blue-600/90 text-white backdrop-blur-sm border border-blue-500/30'
      case 'completed':
        return 'bg-slate-600/90 text-white backdrop-blur-sm border border-slate-500/30'
      default:
        return 'bg-slate-600/90 text-white backdrop-blur-sm border border-slate-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tournaments...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <Header 
        showBackToHome={true}
      />
      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Active Tournaments</h1>
          <p className="text-slate-400">Join or spectate ongoing tournaments</p>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-24 h-24 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400">No tournaments yet</p>
            <p className="text-slate-500 mt-2">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/tournaments/${tournament.id}`}
                className="group bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                {/* Cover Photo */}
                <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-800">
                  {tournament.coverPhoto ? (
                    <img
                      src={tournament.coverPhoto}
                      alt={tournament.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Trophy className="w-24 h-24 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <ExternalLink className="w-5 h-5 text-white drop-shadow-lg group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                      {tournament.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Tournament Info */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {tournament.name}
                  </h2>

                  {tournament.description && (
                    <p className="text-slate-400 mb-4 line-clamp-2">{tournament.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="w-4 h-4" />
                      <span>
                        {tournament._count.players} / {tournament.maxPlayers} Players
                      </span>
                    </div>

                    {tournament.startDateTime ? (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(tournament.startDateTime).toLocaleDateString()} at{' '}
                          {new Date(tournament.startDateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Created {new Date(tournament.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}