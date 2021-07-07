import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
import * as IndexeddbAdaptor from 'pouchdb-adapter-indexeddb'

import { seedDatabase } from '~/data/seeder'

// Load schemas.
import entrySchema from '~/data/schemas/entry.json'
import logbookSchema from '~/data/schemas/logbook.json'

// Add plugins.
addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(IndexeddbAdaptor)

// Add the dev plugins.
if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

//
export const createDatabase = async function () {
  const db = await createRxDatabase({
    name: 'logbooks',
    adapter: 'indexeddb',
  })

  await db.addCollections({
    logbooks: {
      schema: logbookSchema,
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
    entries: {
      schema: entrySchema,
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

export default function ({ app }, inject) {
  // Initialize the database.
  const pendingInstance = createDatabase()

  // Add $db field to app context.
  inject('db', pendingInstance)
  inject('seed', seedDatabase)
}
