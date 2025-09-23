import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; matchId: string }> }
) {
  try {
    const { id, matchId } = await params
    const body = await request.json()
    const { winnerId, status } = body

    // Update the match
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        winnerId,
        status,
      },
      include: {
        winner: true,
      }
    })

    // If this match has a winner, advance them to the next round
    if (winnerId && status === 'completed') {
      // Find the next match this winner should advance to
      const nextRound = match.round + 1
      const nextMatchNumber = Math.floor(match.matchNumber / 2)
      const isPlayer1 = match.matchNumber % 2 === 0

      const nextMatch = await prisma.match.findFirst({
        where: {
          tournamentId: id,
          round: nextRound,
          matchNumber: nextMatchNumber,
        }
      })

      if (nextMatch) {
        await prisma.match.update({
          where: { id: nextMatch.id },
          data: isPlayer1 ? { player1Id: winnerId } : { player2Id: winnerId }
        })
      }
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}