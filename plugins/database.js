import { addRxPlugin } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
import * as IndexeddbAdaptor from 'pouchdb-adapter-indexeddb'

import { seedFakeLogbook } from '~/data/seeder'
import { getDatabaseInstance } from '~/data/database'

// Add plugins.
addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBMigrationPlugin)
addRxPlugin(IndexeddbAdaptor)

// Add the dev plugins.
if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

/**
 * Register the plugin...
 */
export default function ({ app }, inject) {
  // Initialize the database.
  const pendingInstance = getDatabaseInstance()

  // Add $db field to app context.
  inject('db', pendingInstance)
  inject('seed', async () => {
    seedFakeLogbook(await pendingInstance, 200)
  })
}
