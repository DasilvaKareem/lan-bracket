const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearPlayers() {
  try {
    // Delete all players
    const result = await prisma.player.deleteMany({})
    
    console.log(`✅ Deleted ${result.count} players`)
    
    // Also delete any matches that might exist
    const matchResult = await prisma.match.deleteMany({})
    
    console.log(`✅ Deleted ${matchResult.count} matches`)
    
    // Reset tournament statuses to registration_open
    const tournamentResult = await prisma.tournament.updateMany({
      data: {
        status: 'registration_open'
      }
    })
    
    console.log(`✅ Reset ${tournamentResult.count} tournaments to registration_open`)
    
    console.log('🎉 All seeded data cleared!')
  } catch (error) {
    console.error('Error clearing data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearPlayers()