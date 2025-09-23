import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { passcode } = body

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      select: { adminPasscode: true }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    if (tournament.adminPasscode !== passcode) {
      return NextResponse.json(
        { error: 'Invalid passcode' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error verifying admin:', error)
    return NextResponse.json(
      { error: 'Failed to verify admin' },
      { status: 500 }
    )
  }
}