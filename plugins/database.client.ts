import type { RxDatabase, RxStorage } from 'rxdb'
import { addRxPlugin, createRxDatabase, removeRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema'
import { collections, type UserDatabase } from '~/data/database'

// 1. Add ALL RxDB plugins here
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBMigrationSchemaPlugin)
if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin)
}

// 2. Setup the storage (reusable)
const storage: RxStorage<unknown, unknown> = wrappedValidateAjvStorage({
  storage: getRxStorageDexie(),
})

let dbPromise: Promise<UserDatabase> | null = null

/**
 * Initializes and returns the singleton RxDB database instance.
 */
async function initDatabase(): Promise<UserDatabase> {
  if (dbPromise) {
    return dbPromise
  } else {
    dbPromise = (async () => {
      console.info('RxDB: Initializing database...')

      // Core database creation logic
      const db = (await createRxDatabase({
        name: 'logbooks',
        storage: storage,
        // Pass the storage instance to the database for later use if needed
        // storageRef: storage,
      })) as UserDatabase

      await db.addCollections(collections)
      console.info('RxDB: Collections added successfully.')
      return db
    })()
  }

  return dbPromise
}

/**
 * Register the plugin...
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  // Inject the database and utilities into the Nuxt app context
  return {
    provide: {
      // $rxdb is the fully initialized RxDatabase instance (used by Pinia feature stores)
      rxdb: initDatabase(),

      // You can still provide the raw storage if a custom feature needs it
      rxdbStorage: storage,
    }
  }
})
