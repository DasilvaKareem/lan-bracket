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
  const [windowDimensions, setWindowDimensions] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (typeof window !== 'undefined') {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Group matches by round
  const matchesByRound = tournament.matches.reduce((acc: any, match: Match) => {
    if (!acc[match.round]) acc[match.round] = []
    acc[match.round].push(match)
    return acc
  }, {})

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b)
  const totalRounds = Math.ceil(Math.log2(tournament.maxPlayers))

  // Calculate dynamic column width for fullscreen
  const getColumnWidth = () => {
    if (rounds.length === 0) return 250
    return Math.floor(windowDimensions.width / rounds.length)
  }

  // Calculate optimal spacing based on available height
  const getOptimalSpacing = () => {
    if (rounds.length === 0) return 60
    const maxMatches = Math.pow(2, rounds.length - 1)
    const cardHeight = 45 // Approximate card height

    // With scrolling, we can use optimal spacing without being constrained by viewport height
    if (isFullscreen) {
      // Balanced spacing for fullscreen - spacious but not too spread out
      return Math.max(100, cardHeight + 55)
    } else {
      // More generous spacing for regular view
      const headerSpace = 80
      const availableHeight = windowDimensions.height - headerSpace
      const totalCardHeight = maxMatches * cardHeight
      const remainingSpace = availableHeight - totalCardHeight
      const minSpacing = cardHeight + 8
      return Math.max(minSpacing, Math.floor(remainingSpace / maxMatches) + cardHeight)
    }
  }

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
      {/* Mobile View - Vertical Stack */}
      <div className="md:hidden space-y-6">
        {rounds.map((round) => (
          <div key={round} className="w-full">
            <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center bg-slate-800/50 py-2 rounded-lg">
              {getRoundName(round)}
            </h3>
            <div className="space-y-3">
              {matchesByRound[round].map((match: Match) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border-2 transition-all ${
                    selectedMatch === match.id ? 'border-blue-500' : 'border-slate-700'
                  }`}
                  onClick={() => isAdmin && setSelectedMatch(match.id)}
                >
                  <div className="space-y-2">
                    {/* Player 1 */}
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
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
                      <span className={`font-medium ${match.player1 ? 'text-white' : 'text-slate-500'}`}>
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

                    <div className="text-center text-slate-500 text-sm py-1">VS</div>

                    {/* Player 2 */}
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
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
                      <span className={`font-medium ${match.player2 ? 'text-white' : 'text-slate-500'}`}>
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
                    <p className="text-xs text-center text-slate-400 mt-2">
                      Click a player to declare winner
                    </p>
                  )}

                  {isAdmin && match.winner && (
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={(e) => handleUndoWinner(match.id, e)}
                        className="px-3 py-1.5 bg-slate-600/80 hover:bg-slate-500 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Undo
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Horizontal Layout */}
      <div className="hidden md:block overflow-x-auto pb-4">
        <div className="flex gap-4 lg:gap-8 min-w-max">
          {rounds.map((round) => (
            <div key={round} className="flex-1 min-w-[280px] lg:min-w-[300px]">
              <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">
                {getRoundName(round)}
              </h3>
              <div className="space-y-4">
                {matchesByRound[round].map((match: Match) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border-2 transition-all ${
                      selectedMatch === match.id ? 'border-blue-500' : 'border-slate-700'
                    }`}
                    onClick={() => isAdmin && setSelectedMatch(match.id)}
                  >
                    <div className="space-y-2">
                      {/* Player 1 */}
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
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
                        <span className={`font-medium ${match.player1 ? 'text-white' : 'text-slate-500'}`}>
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

                      <div className="text-center text-slate-500 text-sm py-1">VS</div>

                      {/* Player 2 */}
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
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
                        <span className={`font-medium ${match.player2 ? 'text-white' : 'text-slate-500'}`}>
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
                      <p className="text-xs text-center text-slate-400 mt-2">
                        Click a player to declare winner
                      </p>
                    )}

                    {isAdmin && match.winner && (
                      <div className="mt-3 flex justify-center">
                        <button
                          onClick={(e) => handleUndoWinner(match.id, e)}
                          className="px-3 py-1.5 bg-slate-600/80 hover:bg-slate-500 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Undo Winner
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
              {/* Fullscreen Content - Full Height */}
              <div className="flex-1 overflow-hidden relative">
                {/* Exit Fullscreen Button - Floating */}
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-slate-700/80 transition-colors border border-slate-600"
                >
                  <Minimize className="w-4 h-4" />
                  Exit
                </button>
                <div className="w-full h-full relative">
                  <div
                    className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                    style={{
                      width: windowDimensions.width + 'px',
                      height: windowDimensions.height + 'px'
                    }}
                  >
                    {/* Content Container */}
                    <div
                      className="relative min-h-full p-8"
                      style={{
                        minHeight: Math.max(windowDimensions.height, (Math.pow(2, rounds.length - 1) * 120) + 250) + 'px',
                        minWidth: windowDimensions.width + 'px'
                      }}
                    >
                    {/* Bracket Lines SVG */}
                    <svg
                      className="absolute pointer-events-none z-0 w-full h-full"
                      style={{ overflow: 'visible' }}
                    >
                      {rounds.map((round, roundIndex) => {
                        if (roundIndex === rounds.length - 1) return null // No lines from final round

                        const currentRoundMatches = matchesByRound[round]
                        const nextRoundMatches = matchesByRound[rounds[roundIndex + 1]] || []
                        const columnWidth = getColumnWidth()
                        const baseSpacing = getOptimalSpacing()

                        return currentRoundMatches.map((match: Match, matchIndex) => {
                          const nextMatchIndex = Math.floor(matchIndex / 2)
                          const nextMatch = nextRoundMatches[nextMatchIndex]

                          if (!nextMatch) return null

                          const spacing = baseSpacing * Math.pow(2, roundIndex)
                          const nextSpacing = baseSpacing * Math.pow(2, roundIndex + 1)
                          const cardHeight = Math.min(45, Math.max(35, spacing * 0.4))

                          const cardWidth = Math.min(columnWidth - 20, 180) // More margin and smaller cards
                          const cardLeft = (columnWidth - cardWidth) * 0.5

                          const currentX = roundIndex * columnWidth + cardLeft + cardWidth
                          const headerOffset = isFullscreen ? 50 : 30
                          const currentY = headerOffset + (matchIndex * spacing) + (cardHeight * 0.5)
                          const nextX = (roundIndex + 1) * columnWidth + cardLeft
                          const nextY = headerOffset + (nextMatchIndex * nextSpacing) + (cardHeight * 0.5)

                          const midX = currentX + (nextX - currentX) * 0.5

                          return (
                            <g key={`${round}-${match.id}`}>
                              {/* Horizontal line from current match */}
                              <line
                                x1={currentX}
                                y1={currentY}
                                x2={midX}
                                y2={currentY}
                                stroke="#94a3b8"
                                strokeWidth="2.5"
                                opacity="0.9"
                              />
                              {/* Connect to pair partner */}
                              {matchIndex % 2 === 0 && currentRoundMatches[matchIndex + 1] ? (
                                <line
                                  x1={midX}
                                  y1={currentY}
                                  x2={midX}
                                  y2={currentY + spacing}
                                  stroke="#94a3b8"
                                  strokeWidth="2.5"
                                  opacity="0.9"
                                />
                              ) : matchIndex % 2 === 1 ? (
                                <>
                                  {/* Vertical line to midpoint between matches */}
                                  <line
                                    x1={midX}
                                    y1={currentY - spacing}
                                    x2={midX}
                                    y2={currentY}
                                    stroke="#94a3b8"
                                    strokeWidth="2.5"
                                    opacity="0.9"
                                  />
                                  {/* Horizontal line to next round */}
                                  <line
                                    x1={midX}
                                    y1={nextY}
                                    x2={nextX}
                                    y2={nextY}
                                    stroke="#94a3b8"
                                    strokeWidth="2.5"
                                    opacity="0.9"
                                  />
                                  {/* Vertical line to next match */}
                                  <line
                                    x1={midX}
                                    y1={currentY - spacing * 0.5}
                                    x2={midX}
                                    y2={nextY}
                                    stroke="#94a3b8"
                                    strokeWidth="2.5"
                                    opacity="0.9"
                                  />
                                </>
                              ) : null}
                            </g>
                          )
                        })
                      })}
                    </svg>

                    {/* Match Cards */}
                    {rounds.map((round, roundIndex) => {
                      const columnWidth = getColumnWidth()
                      const cardWidth = Math.min(columnWidth - 10, 200)
                      const baseSpacing = getOptimalSpacing()
                      return (
                        <div
                          key={round}
                          className="absolute"
                          style={{
                            left: `${roundIndex * columnWidth}px`,
                            top: '0px',
                            width: `${columnWidth}px`,
                            height: '100%'
                          }}
                        >
                          <h3 className="text-sm font-bold text-slate-200 mb-5 text-center bg-slate-800/40 py-1.5 rounded mx-2">
                            {getRoundName(round)}
                          </h3>
                          <div className="relative">
                            {matchesByRound[round].map((match: Match, matchIndex) => {
                              const spacing = baseSpacing * Math.pow(2, roundIndex)
                              const cardHeight = Math.min(isFullscreen ? 45 : 45, Math.max(40, spacing * 0.4))
                              const headerOffset = isFullscreen ? 50 : 30
                              const topPosition = headerOffset + (matchIndex * spacing)

                              // With scrolling, we don't need safe positioning - let content flow naturally
                              const safeTopPosition = topPosition
                              return (
                                <motion.div
                                  key={match.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`absolute bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 border-2 transition-all z-10 shadow-lg ${
                                    selectedMatch === match.id ? 'border-blue-400 ring-2 ring-blue-400/30' : 'border-slate-600/70 hover:border-slate-500'
                                  }`}
                                  style={{
                                    top: `${safeTopPosition}px`,
                                    width: `${cardWidth}px`,
                                    left: `${(columnWidth - cardWidth) * 0.5}px`,
                                    height: `${cardHeight}px`
                                  }}
                                  onClick={() => isAdmin && setSelectedMatch(match.id)}
                                >
                                <div className="h-full flex flex-col justify-center space-y-1">
                                  {/* Player 1 */}
                                  <div
                                    className={`flex items-center justify-between px-3 py-1 rounded-md cursor-pointer transition-all text-xs border ${
                                      match.winner?.id === match.player1?.id
                                        ? 'bg-green-600/50 text-green-100 border-green-400/50'
                                        : 'bg-slate-700/80 text-slate-200 hover:bg-slate-600/80 border-slate-500/50'
                                    } ${isAdmin && match.player1 && match.player2 && !match.winner ? 'hover:bg-blue-600/40 hover:border-blue-400/50' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (isAdmin && match.player1 && match.player2 && !match.winner) {
                                        handleSetWinner(match.id, match.player1.id)
                                      }
                                    }}
                                  >
                                    <span className="font-medium truncate text-xs">
                                      {match.player1?.gamertag || 'TBD'}
                                    </span>
                                    {match.winner?.id === match.player1?.id && (
                                      <Trophy className="w-3 h-3 text-yellow-400 flex-shrink-0 ml-1 drop-shadow-sm" />
                                    )}
                                  </div>

                                  <div className="text-center text-slate-400 text-xs leading-none font-semibold py-1">VS</div>

                                  {/* Player 2 */}
                                  <div
                                    className={`flex items-center justify-between px-3 py-1 rounded-md cursor-pointer transition-all text-xs border ${
                                      match.winner?.id === match.player2?.id
                                        ? 'bg-green-600/50 text-green-100 border-green-400/50'
                                        : 'bg-slate-700/80 text-slate-200 hover:bg-slate-600/80 border-slate-500/50'
                                    } ${isAdmin && match.player1 && match.player2 && !match.winner ? 'hover:bg-blue-600/40 hover:border-blue-400/50' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (isAdmin && match.player1 && match.player2 && !match.winner) {
                                        handleSetWinner(match.id, match.player2.id)
                                      }
                                    }}
                                  >
                                    <span className="font-medium truncate text-xs">
                                      {match.player2?.gamertag || 'TBD'}
                                    </span>
                                    {match.winner?.id === match.player2?.id && (
                                      <Trophy className="w-3 h-3 text-yellow-400 flex-shrink-0 ml-1 drop-shadow-sm" />
                                    )}
                                  </div>

                                  {isAdmin && match.winner && (
                                    <div className="flex justify-center pt-1">
                                      <button
                                        onClick={(e) => handleUndoWinner(match.id, e)}
                                        className="px-2 py-1 bg-red-600/70 hover:bg-red-500/80 text-white text-xs rounded-md transition-all flex items-center gap-1 border border-red-500/50 hover:border-red-400/70"
                                      >
                                        <RotateCcw className="w-2.5 h-2.5" />
                                        Undo
                                      </button>
                                    </div>
                                  )}
                                </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                    </div>
                  </div>
                </div>
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