import {
  createRxDatabase,
  removeRxDatabase,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
} from 'rxdb'
import { getRxStorageLoki } from 'rxdb/plugins/lokijs'
import LokiIncrementalIndexedDBAdapter from 'lokijs/src/incremental-indexeddb-adapter'
import { useNuxtApp } from '#app'
import { compile, compileFromFile } from 'json-schema-to-typescript'

// Load schemas.
import entrySchemaLiteral from '~/data/schemas/entry.json'
import logbookSchemaLiteral from '~/data/schemas/logbook.json'

export function useDatabase() {
  return useNuxtApp().$db
}

/**
 *
 * @returns
 */
export async function createDatabase() {
  const db = await createRxDatabase({
    name: 'logbooks',
    storage: getRxStorageLoki({adapter: LokiIncrementalIndexedDBAdapter}),
  })

  await db.addCollections({
    //
    logbooks: {
      schema: (() => {
        const logbookSchemaTyped = toTypedRxJsonSchema(logbookSchemaLiteral)

        // aggregate the document type from the schema
        type LogbookDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
          typeof logbookSchemaTyped
        >

        // RxJsonSchema<LogbookDocType>

        // create the typed RxJsonSchema from the literal typed object.
        return logbookSchemaLiteral
      })(),

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
      schema: entrySchemaLiteral,

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

  await removeRxDatabase('logbooks', getRxStorageLoki('indexeddb'))

  //
  await this.$nuxt.refresh()
}
