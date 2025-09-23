import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const players = await prisma.player.findMany({
      where: { tournamentId: id },
      orderBy: { seed: 'asc' }
    })

    if (players.length < 2) {
      return NextResponse.json(
        { error: 'Need at least 2 players to shuffle' },
        { status: 400 }
      )
    }

    // Fisher-Yates shuffle algorithm
    const shuffled = [...players]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Update seeds based on new order
    await prisma.$transaction(
      shuffled.map((player, index) =>
        prisma.player.update({
          where: { id: player.id },
          data: { seed: index + 1 }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error shuffling players:', error)
    return NextResponse.json(
      { error: 'Failed to shuffle players' },
      { status: 500 }
    )
  }
}