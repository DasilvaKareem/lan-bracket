const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Sample player names for FIFA
const fifaPlayers = [
  'Messi_10', 'Ronaldo_7', 'Neymar_11', 'Mbappe_7', 'Haaland_9', 'Benzema_9', 'Lewandowski_9', 'KDB_17',
  'Modric_10', 'Vinicius_20', 'Salah_11', 'Mane_10', 'Son_7', 'Kane_10', 'Sterling_7', 'Grealish_10',
  'Foden_47', 'Bellingham_22', 'Pedri_16', 'Gavi_6', 'Tchouameni_8', 'Camavinga_12', 'Valverde_15', 'Kroos_8',
  'Casemiro_18', 'Bruno_18', 'Pogba_6', 'Kante_7', 'Mount_19', 'Rice_41', 'Phillips_4', 'Henderson_14',
  'VanDijk_4', 'Rudiger_2', 'Koulibaly_26', 'Marquinhos_5', 'Hakimi_2', 'Cancelo_7', 'Robertson_26', 'TAA_66',
  'Alisson_1', 'Courtois_1', 'Neuer_1', 'Donnarumma_99', 'Ederson_31', 'Ter_Stegen_1', 'Oblak_13', 'Lloris_1'
]

// Sample player names for Smash
const smashPlayers = [
  'Sparg0', 'MkLeo', 'Tweek', 'Glutonny', 'Light', 'Marss', 'Zomba', 'Dabuz',
  'Nairo', 'ESAM', 'Maister', 'Cosmos', 'Kola', 'Riddles', 'BassMage', 'Shuton',
  'ProtoBanham', 'Tea', 'Zackray', 'KEN', 'Yoshidora', 'Gackt', 'Akakikusu', 'Kept',
  'Elegant', 'Fatality', 'Sonix', 'BigBoss'
]

async function seedPlayers() {
  try {
    // Get all tournaments
    const tournaments = await prisma.tournament.findMany({
      select: { id: true, name: true, maxPlayers: true }
    })

    console.log('Found tournaments:', tournaments)

    for (const tournament of tournaments) {
      // Determine which player set to use based on tournament name
      let playerNames = []
      let targetCount = 0
      
      if (tournament.name.toLowerCase().includes('fifa')) {
        playerNames = fifaPlayers
        targetCount = 40
        console.log(`Seeding FIFA tournament "${tournament.name}" with ${targetCount} players`)
      } else if (tournament.name.toLowerCase().includes('smash')) {
        playerNames = smashPlayers
        targetCount = 28
        console.log(`Seeding Smash tournament "${tournament.name}" with ${targetCount} players`)
      } else {
        console.log(`Skipping tournament "${tournament.name}" - no matching criteria`)
        continue
      }

      // Clear existing players
      await prisma.player.deleteMany({
        where: { tournamentId: tournament.id }
      })

      // Create players
      const playersToCreate = []
      for (let i = 0; i < targetCount; i++) {
        const playerName = playerNames[i % playerNames.length]
        const suffix = i >= playerNames.length ? `_${Math.floor(i / playerNames.length) + 1}` : ''
        
        playersToCreate.push({
          name: `${playerName.replace('_', ' ')}${suffix}`,
          gamertag: `${playerName}${suffix}`,
          email: `${playerName.toLowerCase()}${suffix}@example.com`,
          phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          tournamentId: tournament.id,
          seed: i + 1
        })
      }

      // Create players in batches
      await prisma.player.createMany({
        data: playersToCreate
      })

      console.log(`✅ Created ${targetCount} players for "${tournament.name}"`)
    }

    console.log('🎉 Seeding completed!')
  } catch (error) {
    console.error('Error seeding players:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedPlayers()