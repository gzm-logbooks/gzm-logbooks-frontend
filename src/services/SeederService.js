import { getDatabase } from '@/services/DataService'

const hour = 1000 * 60 * 60
const day = hour * 24
const week = day * 7

const entryFactory = (
  subjectId,
  from = new Date(),
  amount = 40,
  step = -week / 3,
  spread = day / 2
) => {
  //
  function getSpread() {
    return parseInt(Math.random() * spread)
  }

  function getAmounts() {
    const max = { red: 0.05, amber: 0.33 }
    const amountRed = Math.min(Math.random(), 0.8) * 0.5
    const amountAmber = Math.min(Math.random(), 0.8) * amountRed
    const amountGreen = Math.min(Math.random(), 0.8) * amountAmber

    return {
      amountGreen,
      amountAmber,
      amountRed,
    }
  }

  //
  const entries = []

  while (entries.length < amount) {
    const last = entries[entries.length - 1]
    const lastTime = new Date(last ? last.timestamp : from)

    //
    const next = new Date(lastTime.getTime() + step + getSpread())

    entries.push({
      timestamp: next.toISOString(),
      subject: subjectId,
      ...getAmounts(),
    })
  }

  return entries
}

export const seedDatabase = async function () {
  const db = await getDatabase()

  const subject = await db.subjects.insert({
    name: 'Example Subject',
  })

  console.log(await db.entries.bulkInsert(entryFactory(subject.primary)))
}
