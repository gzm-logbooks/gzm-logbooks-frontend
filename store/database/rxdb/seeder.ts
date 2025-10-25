import type { RxDatabase, RxDocument } from 'rxdb'
import { nanoid } from 'nanoid'
import type { UserDatabase } from '~/store/database/rxdb/database'
import type { LogbookDocument } from '~/store/database/rxdb/schemas'

import { clamp, defaults } from 'lodash-es'
import { growthInputDefaults } from '~/data/mood'
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

  // function boxMuller() {
  //   return (
  //     Math.sqrt(-2 * Math.log(Math.random())) *
  //     Math.cos(2 * Math.PI * Math.random())
  //   )
  // }

  function getAmounts() {
    return fakeMoodInputValues()
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

/**
 * Create a demo logbook and fill it with fake data.
 */
export const seedFakeLogbook = async function (
  db: UserDatabase,
  delay = 200,
): Promise<LogbookDocument> {
  console.log(db)

  const logbook = await db.logbooks.insert({
    id: nanoid(),
    name: 'Example Logbook',
  })

  let counter = 0
  const timer = setInterval(async function () {
    await db.entries.bulkInsert(entryFactory(logbook.primary, new Date(), 1))

    counter++
    if (counter >= 420) {
      clearInterval(timer)
    }
  }, delay)

  return logbook
}

/**
 *
 */
function validateMoodInput(value) {
  const { padding, minRadius } = growthInputDefaults

  const amountComfort = clamp(value.amountComfort, minRadius, 1 - padding * 2)
  const amountGrowth = clamp(
    value.amountGrowth,
    amountComfort + padding,
    1 - padding,
  )

  return {
    amountComfort,
    amountGrowth,
    amountAnxiety: 1,
  }
}

/**
 *
 * @returns
 */
export function fakeMoodInputValues() {
  const { padding, minRadius } = growthInputDefaults

  // const max = { red: 0.05, amber: 0.33 }

  const amountGreen = Math.random() * (1 - minRadius - padding * 2) + minRadius

  const amountAmber = Math.max(
    Math.random() * (1 - minRadius - padding * 2) + minRadius + padding,
    amountGreen + padding,
  )

  return validateMoodInput({
    amountGreen,
    amountAmber,
    amountRed: 1,
  })
}
