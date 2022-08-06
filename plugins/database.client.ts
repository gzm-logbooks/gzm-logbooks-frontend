import { addRxPlugin } from 'rxdb'
// import { addPouchPlugin,  } from 'rxdb/plugins/lokijs'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
// import * as IndexeddbAdaptor from 'pouchdb-adapter-indexeddb'

import { seedFakeLogbook } from '~/data/seeder'
import { createDatabase } from '~/data/database'

// Add plugins.
addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBMigrationPlugin)
// addPouchPlugin(IndexeddbAdaptor)

// Add the dev plugins.
// if (import.meta.env.DEV) {
addRxPlugin(RxDBDevModePlugin)
// }

/**
 * Register the plugin...
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  // Initialize the database.
  const db = await createDatabase()

  console.log({ db })

  return {
    // Add $db and $seed fields to app context.
    provide: {
      db,
      seed: async () => {
        seedFakeLogbook(await db, 200)
      },
    },
  }
})
