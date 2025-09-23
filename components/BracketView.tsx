'use client'

import { useState, useEffect } from 'react'
import { Trophy, Crown, Maximize, Minimize, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Match {
  id: string
  round: number
  matchNumber: number
  player1: any
  player2: any
  winner: any
  status: string
}

interface BracketViewProps {
  tournament: any
  isAdmin: boolean
  onUpdate: () => void
}

export default function BracketView({ tournament, isAdmin, onUpdate }: BracketViewProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [showWinnerAnimation, setShowWinnerAnimation] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Group matches by round
  const matchesByRound = tournament.matches.reduce((acc: any, match: Match) => {
    if (!acc[match.round]) acc[match.round] = []
    acc[match.round].push(match)
    return acc
  }, {})

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b)
  const totalRounds = Math.ceil(Math.log2(tournament.maxPlayers))

  const getRoundName = (round: number) => {
    const roundsFromFinal = totalRounds - round
    if (roundsFromFinal === 0) return 'Final'
    if (roundsFromFinal === 1) return 'Semi-Final'
    if (roundsFromFinal === 2) return 'Quarter-Final'
    return `Round ${round}`
  }

  const handleSetWinner = async (matchId: string, winnerId: string) => {
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, status: 'completed' }),
      })

      if (response.ok) {
        setShowWinnerAnimation(winnerId)
        setTimeout(() => setShowWinnerAnimation(null), 3000)
        onUpdate()
      }
    } catch (error) {
      console.error('Error setting winner:', error)
    }
  }

  const handleUndoWinner = async (matchId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent match selection
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId: null, status: 'pending' }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error undoing winner:', error)
    }
  }

  const champion = tournament.matches.find((m: Match) => 
    m.round === totalRounds && m.status === 'completed'
  )?.winner

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const bracketContent = (
    <>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 sm:gap-8 min-w-max">
          {rounds.map((round) => (
            <div key={round} className="flex-1 min-w-[280px] sm:min-w-[300px]">
              <h3 className="text-sm sm:text-lg font-semibold text-slate-300 mb-3 sm:mb-4 text-center">
                {getRoundName(round)}
              </h3>
              <div className="space-y-4">
                {matchesByRound[round].map((match: Match) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border-2 transition-all ${
                      selectedMatch === match.id ? 'border-blue-500' : 'border-slate-700'
                    }`}
                    onClick={() => isAdmin && setSelectedMatch(match.id)}
                  >
                    <div className="space-y-2">
                      {/* Player 1 */}
                      <div
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-all ${
                          match.winner?.id === match.player1?.id
                            ? 'bg-green-600/20 border border-green-500'
                            : 'bg-slate-700/50 hover:bg-slate-700'
                        } ${isAdmin && match.player1 && match.player2 && !match.winner ? 'hover:bg-blue-600/20' : ''}`}
                        onClick={() => {
                          if (isAdmin && match.player1 && match.player2 && !match.winner) {
                            handleSetWinner(match.id, match.player1.id)
                          }
                        }}
                      >
                        <span className={`font-medium text-sm sm:text-base ${match.player1 ? 'text-white' : 'text-slate-500'}`}>
                          {match.player1?.gamertag || 'TBD'}
                        </span>
                        {match.winner?.id === match.player1?.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-400"
                          >
                            <Trophy className="w-5 h-5" />
                          </motion.div>
                        )}
                      </div>

                      <div className="text-center text-slate-500 text-xs sm:text-sm py-1">VS</div>

                      {/* Player 2 */}
                      <div
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-all ${
                          match.winner?.id === match.player2?.id
                            ? 'bg-green-600/20 border border-green-500'
                            : 'bg-slate-700/50 hover:bg-slate-700'
                        } ${isAdmin && match.player1 && match.player2 && !match.winner ? 'hover:bg-blue-600/20' : ''}`}
                        onClick={() => {
                          if (isAdmin && match.player1 && match.player2 && !match.winner) {
                            handleSetWinner(match.id, match.player2.id)
                          }
                        }}
                      >
                        <span className={`font-medium text-sm sm:text-base ${match.player2 ? 'text-white' : 'text-slate-500'}`}>
                          {match.player2?.gamertag || 'TBD'}
                        </span>
                        {match.winner?.id === match.player2?.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-400"
                          >
                            <Trophy className="w-5 h-5" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {isAdmin && match.player1 && match.player2 && !match.winner && (
                      <p className="text-xs text-center text-slate-400 mt-1 sm:mt-2">
                        Click a player to declare winner
                      </p>
                    )}

                    {isAdmin && match.winner && (
                      <div className="mt-2 sm:mt-3 flex justify-center">
                        <button
                          onClick={(e) => handleUndoWinner(match.id, e)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-600/80 hover:bg-slate-500 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1 sm:gap-1.5"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span className="hidden sm:inline">Undo Winner</span>
                          <span className="sm:hidden">Undo</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Champion Celebration */}
      <AnimatePresence>
        {champion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-12 text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="inline-block"
            >
              <Crown className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-2">Tournament Champion</h2>
            <p className="text-2xl text-yellow-400 font-semibold">{champion.gamertag}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Tournament Bracket
        </h2>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950"
          >
            <div className="h-full flex flex-col">
              {/* Fullscreen Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  {tournament.name} - Tournament Bracket
                </h2>
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Minimize className="w-5 h-5" />
                  Exit Fullscreen
                </button>
              </div>

              {/* Fullscreen Content */}
              <div className="flex-1 p-6 overflow-auto">
                {bracketContent}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular View */}
      {!isFullscreen && bracketContent}

      {/* Winner Animation */}
      <AnimatePresence>
        {showWinnerAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 0.5 }}
              className="bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl"
            >
              <p className="text-2xl font-bold">Winner!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}