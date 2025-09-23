'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Trophy, Users, Shield, UserPlus } from 'lucide-react'
import Link from 'next/link'
import BracketView from '@/components/BracketView'
import AdminPanel from '@/components/AdminPanel'
import AdminLoginDialog from '@/components/AdminLoginDialog'
import PlayerInfoDialog from '@/components/PlayerInfoDialog'
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
  players: any[]
  matches: any[]
}

export default function TournamentPage() {
  const params = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [activeTab, setActiveTab] = useState<'bracket' | 'players'>('bracket')
  const [adminLoading, setAdminLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTournament = async () => {
    try {
      const response = await fetch(`/api/tournaments/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch tournament')
      const data = await response.json()
      setTournament(data)
    } catch (error) {
      console.error('Error fetching tournament:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournament()
    const interval = setInterval(fetchTournament, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [params.id])

  const handleAdminLogin = async (passcode: string): Promise<boolean> => {
    setAdminLoading(true)
    try {
      const response = await fetch(`/api/tournaments/${params.id}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })

      if (response.ok) {
        setIsAdmin(true)
        setShowAdminLogin(false)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error logging in as admin:', error)
      return false
    } finally {
      setAdminLoading(false)
    }
  }

  const handleTournamentDelete = () => {
    // Redirect to tournaments list after deletion
    router.push('/tournaments')
  }

  const handlePlayerClick = (player: any) => {
    if (isAdmin) {
      setSelectedPlayer(player)
      setShowPlayerInfo(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tournament...</div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Tournament not found</div>
      </div>
    )
  }

  const canRegister = tournament.status === 'registration_open' && tournament.players.length < tournament.maxPlayers

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <Header 
        showBackToTournaments={true} 
        showBackToHome={true}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Tournament Hero Section */}
        <div className="mb-8">
          {tournament.coverPhoto ? (
            <div className="relative rounded-2xl overflow-hidden">
              <div className="aspect-[3/1] relative">
                <img
                  src={tournament.coverPhoto}
                  alt={tournament.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
                <div className="absolute inset-0 p-8 flex items-end">
                  <div className="flex-1">
                    <h1 className="text-5xl font-bold text-white mb-3">{tournament.name}</h1>
                    {tournament.description && (
                      <p className="text-slate-200 text-lg mb-4 max-w-2xl">{tournament.description}</p>
                    )}
                    <div className="flex items-center gap-6 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="text-lg font-medium">{tournament.players.length} / {tournament.maxPlayers} Players</span>
                      </div>
                      <div className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full text-sm font-medium border border-slate-600/50">
                        {tournament.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {canRegister && (
                      <Link
                        href={`/tournaments/${params.id}/register`}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-[1.02] shadow-lg"
                      >
                        <UserPlus className="w-5 h-5" />
                        Register Now
                      </Link>
                    )}
                    
                    {!isAdmin && (
                      <button
                        onClick={() => setShowAdminLogin(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800/80 backdrop-blur-sm text-white rounded-xl hover:bg-slate-700/80 transition-all border border-slate-600/50"
                      >
                        <Shield className="w-5 h-5" />
                        Admin Login
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{tournament.name}</h1>
                    {tournament.description && (
                      <p className="text-slate-400 text-lg">{tournament.description}</p>
                    )}
                    <div className="flex items-center gap-6 text-slate-300 mt-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="text-lg font-medium">{tournament.players.length} / {tournament.maxPlayers} Players</span>
                      </div>
                      <div className="px-4 py-2 bg-slate-700/50 rounded-full text-sm font-medium">
                        {tournament.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {canRegister && (
                    <Link
                      href={`/tournaments/${params.id}/register`}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-[1.02]"
                    >
                      <UserPlus className="w-5 h-5" />
                      Register Now
                    </Link>
                  )}
                  
                  {!isAdmin && (
                    <button
                      onClick={() => setShowAdminLogin(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        {tournament.status === 'registration_open' && tournament.players.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-24 h-24 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">No players registered yet</h2>
            <p className="text-slate-400 mb-6">Be the first to join this tournament!</p>
            {canRegister && (
              <Link
                href={`/tournaments/${params.id}/register`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all"
              >
                <UserPlus className="w-5 h-5" />
                Register Now
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('bracket')}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'bracket'
                      ? 'bg-slate-700 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Trophy className="w-4 h-4 inline mr-2" />
                  Bracket
                </button>
                <button
                  onClick={() => setActiveTab('players')}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'players'
                      ? 'bg-slate-700 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Players ({tournament.players.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'bracket' ? (
              <>
                {tournament.matches.length > 0 ? (
                  <BracketView 
                    tournament={tournament} 
                    isAdmin={isAdmin}
                    onUpdate={fetchTournament}
                  />
                ) : (
                  <div className="text-center py-16 bg-slate-800/30 rounded-xl">
                    <Trophy className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                    <h2 className="text-2xl text-white mb-2">Tournament Not Started</h2>
                    <p className="text-slate-400 mb-6">The bracket will appear once the tournament begins</p>
                    {isAdmin && tournament.players.length >= 2 && (
                      <p className="text-blue-400">Use the admin panel below to start the tournament</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Players Tab */
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.players
                    .sort((a, b) => (a.seed || 999) - (b.seed || 999))
                    .map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerClick(player)}
                      className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between transition-all ${
                        isAdmin 
                          ? 'hover:bg-slate-700/50 hover:scale-[1.02] cursor-pointer group' 
                          : ''
                      }`}
                    >
                      <div>
                        <span className={`text-white font-medium ${isAdmin ? 'group-hover:text-blue-400' : ''} transition-colors`}>
                          {player.gamertag}
                        </span>
                        <div className="text-sm text-slate-400">{player.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.seed && (
                          <span className="text-slate-400">Seed #{player.seed}</span>
                        )}
                        {isAdmin && (
                          <div className="w-6 h-6 bg-slate-700/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Users className="w-3 h-3 text-slate-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {isAdmin && tournament.players.length > 0 && (
                  <p className="text-sm text-slate-400 mt-4 text-center">
                    💡 Click on any player to view their details
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <AdminPanel
            tournament={tournament}
            onUpdate={fetchTournament}
            onDelete={handleTournamentDelete}
          />
        )}

        {/* Admin Login Dialog */}
        <AdminLoginDialog
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
          onLogin={handleAdminLogin}
          loading={adminLoading}
        />

        {/* Player Info Dialog */}
        <PlayerInfoDialog
          isOpen={showPlayerInfo}
          onClose={() => setShowPlayerInfo(false)}
          player={selectedPlayer}
        />
      </div>
    </div>
  )
}