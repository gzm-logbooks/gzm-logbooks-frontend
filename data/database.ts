import {
  createRxDatabase,
  removeRxDatabase,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxStorage
} from 'rxdb'
import { getRxStorageLoki } from 'rxdb/plugins/lokijs'
import LokiIncrementalIndexedDBAdapter from 'lokijs/src/incremental-indexeddb-adapter'
import { useNuxtApp } from '#app'
import { compile, compileFromFile } from 'json-schema-to-typescript'

// Load schemas.
import { entrySchemaLiteral, entrySchema } from '~/data/schemas/entry.ts'
import { logbookSchemaLiteral, logbookSchema } from '~/data/schemas/logbook.ts'

/**
 *
 * @returns
 */
export async function createDatabase () {
  const db = await createRxDatabase({
    name: 'logbooks',
    storage: getRxStorageLoki({
      adapter: new LokiIncrementalIndexedDBAdapter()
      //  autosave: true, autosaveInterval: 5000, autoload: true, persistenceMethod: 'memory'
    })
  })

  await db.addCollections({
    //
    logbooks: {
      schema: logbookSchema,

      migrationStrategies: {
        // TODO: Add migrations for previous versions.
        0 (oldDoc) {
          return null
        },
        1 (oldDoc) {
          return null
        },
        2 (oldDoc) {
          return null
        }
      },

      methods: {
        getRoute () {
          const { primary } = this

          if (!primary) {
            return null
          }

          return {
            name: 'logbooks-logbookId',
            params: {
              logbookId: primary
            }
          }
        },

        getNewEntryRoute () {
          const { primary } = this

          if (!primary) {
            return null
          }

          return {
            name: 'logbooks-logbookId-entries-new',
            params: {
              logbookId: primary
            }
          }
        }
      }
    },

    //
    entries: {
      schema: entrySchemaLiteral,

      migrationStrategies: {
        // TODO: Add migrations for previous versions.
        0 (oldDoc) {
          return null
        },
        1 (oldDoc) {
          return null
        },
        2 (oldDoc) {
          return null
        }
      },

      methods: {
        getRoute () {
          const { primary, logbook } = this

          if (!primary || !logbook) {
            return null
          }

          return {
            name: 'logbooks-logbookId-entries-entryId',
            params: {
              logbookId: logbook,
              entryId: primary
            }
          }
        }
      }
    }
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
export async function resetDatabase (storage: RxStorage<any, any>) {
  if (confirm('This will delete all of your data!') !== true) {
    return
  }

  //
  console.warn('Deleting database...')

  await removeRxDatabase('logbooks', storage)

  //
  await this.$nuxt.refresh()
}
