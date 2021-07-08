const hour = 1000 * 60 * 60
const day = hour * 24
const week = day * 7

const entryFactory = (
  logbookId,
  from = new Date(),
  amount = 40,
  step = 2 * week,
  spread = week,
) => {
  //
  function getSpread() {
    return parseInt(Math.random() * spread)
  }

  function getAmounts() {
    // const max = { red: 0.05, amber: 0.33 }
    const amountGreen = Math.min(
      Math.max(
        Math.sqrt(-2 * Math.log(Math.random())) *
          Math.cos(2 * Math.PI * Math.random()) *
          0.5 +
          1 / 4,
        0
      ),
      0.8
    )
    const amountAmber = Math.min(
      Math.max(
        Math.sqrt(-2 * Math.log(Math.random())) *
          Math.cos(2 * Math.PI * Math.random()) *
          0.5 +
          1 / 2,
        amountGreen + 0.1
      ),
      0.9
    )
    const amountRed = Math.min(
      Math.max(
        Math.sqrt(-2 * Math.log(Math.random())) *
          Math.cos(2 * Math.PI * Math.random()) *
          0.5 +
          3 / 4,
        amountAmber + 0.1
      ),
      1
    )

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
    const next = new Date(lastTime.getTime() - (step + getSpread()))

    entries.push({
      timestamp: next.toISOString(),
      logbook: logbookId,
      ...getAmounts(),
    })
  }

  return entries
}

export const seedDatabase = async function (db) {
  const logbook = await db.logbooks.insert({
    name: 'Example Logbook',
  })

  let counter = 0
  const timer = setInterval(async function () {
    await db.entries.bulkInsert(entryFactory(logbook.primary, new Date(), 1))

    counter++
    if (counter >= 40) {
      clearInterval(timer)
    }
  }, 200)
}
