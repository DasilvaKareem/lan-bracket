import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateBracket(players: any[], maxPlayers: number) {
  const totalRounds = Math.ceil(Math.log2(maxPlayers))
  const matches = []
  
  // Create first round matches
  const firstRoundMatches = Math.floor(players.length / 2)
  for (let i = 0; i < firstRoundMatches; i++) {
    matches.push({
      round: 1,
      matchNumber: i,
      player1Id: players[i * 2]?.id || null,
      player2Id: players[i * 2 + 1]?.id || null,
      status: 'pending'
    })
  }
  
  // Create remaining rounds
  let matchesInPreviousRound = firstRoundMatches
  for (let round = 2; round <= totalRounds; round++) {
    const matchesInThisRound = Math.floor(matchesInPreviousRound / 2)
    for (let i = 0; i < matchesInThisRound; i++) {
      matches.push({
        round,
        matchNumber: i,
        player1Id: null,
        player2Id: null,
        status: 'pending'
      })
    }
    matchesInPreviousRound = matchesInThisRound
  }
  
  return matches
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { players: { orderBy: { seed: 'asc' } } }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    if (tournament.players.length < 2) {
      return NextResponse.json(
        { error: 'Need at least 2 players to start' },
        { status: 400 }
      )
    }

    // Generate bracket structure
    const bracketData = generateBracket(tournament.players, tournament.maxPlayers)

    // Create all matches in a transaction
    await prisma.$transaction([
      // Delete existing matches if any
      prisma.match.deleteMany({
        where: { tournamentId: id }
      }),
      // Create new matches
      ...bracketData.map(match =>
        prisma.match.create({
          data: {
            ...match,
            tournamentId: id,
          }
        })
      ),
      // Update tournament status
      prisma.tournament.update({
        where: { id },
        data: { status: 'in_progress' }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error starting tournament:', error)
    return NextResponse.json(
      { error: 'Failed to start tournament' },
      { status: 500 }
    )
  }
}