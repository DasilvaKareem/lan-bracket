import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Reset tournament in a transaction
    await prisma.$transaction([
      // Delete all matches
      prisma.match.deleteMany({
        where: { tournamentId: id }
      }),
      // Reset tournament status to registration_open
      prisma.tournament.update({
        where: { id },
        data: { status: 'registration_open' }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error resetting tournament:', error)
    return NextResponse.json(
      { error: 'Failed to reset tournament' },
      { status: 500 }
    )
  }
}