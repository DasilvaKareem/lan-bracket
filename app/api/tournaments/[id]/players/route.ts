import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, gamertag, email, phone } = body

    // Check if tournament is full
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        _count: {
          select: { players: true }
        }
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    if (tournament.status !== 'registration_open') {
      return NextResponse.json(
        { error: 'Registration is closed for this tournament' },
        { status: 400 }
      )
    }

    if (tournament._count.players >= tournament.maxPlayers) {
      return NextResponse.json(
        { error: 'Tournament is full' },
        { status: 400 }
      )
    }

    // Create player with seed based on registration order
    const player = await prisma.player.create({
      data: {
        name,
        gamertag,
        email,
        phone,
        tournamentId: id,
        seed: tournament._count.players + 1
      }
    })

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json(
      { error: 'Failed to register player' },
      { status: 500 }
    )
  }
}