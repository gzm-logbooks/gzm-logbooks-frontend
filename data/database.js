import { createRxDatabase, removeRxDatabase } from 'rxdb/plugins/core'

// Load schemas.
import entrySchema from '~/data/schemas/entry.json'
import logbookSchema from '~/data/schemas/logbook.json'

let dbInstance = null

export async function getDatabaseInstance() {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await createDatabase()

  return dbInstance
}

/**
 *
 * @returns
 */
export async function createDatabase() {
  const db = await createRxDatabase({
    name: 'logbooks',
    adapter: 'indexeddb',
  })

  await db.addCollections({
    //
    logbooks: {
      schema: logbookSchema,

      migrationStrategies: {
        1() {
          return null
        },
      },

      methods: {
        getRoute() {
          const { primary } = this

          if (!primary) {
            return null
          }

          return {
            name: 'logbooks-logbookId',
            params: {
              logbookId: primary,
            },
          }
        },

        getNewEntryRoute() {
          const { primary } = this

          if (!primary) {
            return null
          }

          return {
            name: 'logbooks-logbookId-entries-new',
            params: {
              logbookId: primary,
            },
          }
        },
      },
    },

    //
    entries: {
      schema: entrySchema,

      migrationStrategies: {
        1() {
          return null
        },
      },

      methods: {
        getRoute() {
          const { primary, logbook } = this

          if (!primary || !logbook) {
            return null
          }

          return {
            name: 'logbooks-logbookId-entries-entryId',
            params: {
              logbookId: logbook,
              entryId: primary,
            },
          }
        },
      },
    },
  })

  // Delay for testing 😈
  // // await new Promise((resolve) => {
  // //   setTimeout(resolve, 6666)
  // // })

  return db
}

/**
 *
 */
export async function resetDatabase() {
  if (confirm('This will delete all of your data!') !== true) {
    return
  }

  //
  console.warn('Deleting database...')

  await removeRxDatabase('logbooks', 'indexeddb')

  //
  await this.$nuxt.refresh()
}
