import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  RxDatabase, addRxPlugin,
  createRxDatabase,
  removeRxDatabase,
  RxStorage
} from 'rxdb'

// import { addPouchPlugin,  } from 'rxdb/plugins/lokijs'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
// import * as IndexeddbAdaptor from 'pouchdb-adapter-indexeddb'

import { getRxStorageLoki } from 'rxdb/plugins/lokijs'
import LokiIncrementalIndexedDBAdapter from 'lokijs/src/incremental-indexeddb-adapter'
import { schemas, collections } from '~/data/database'
import { seedFakeLogbook } from '~/store/database/seeder'

// Add plugins.
addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBMigrationPlugin)
// addPouchPlugin(IndexeddbAdaptor)

// Add the dev plugins.
if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin)
}

export const useDatabase = defineStore('entriesDb', () => {
  const storage = ref<RxStorage<any, any>>()
  const db = ref<RxDatabase>()

  /**
   *
   */
  async function createDatabase () {
    storage.value = getRxStorageLoki({
      adapter: new LokiIncrementalIndexedDBAdapter()
    //  autosave: true, autosaveInterval: 5000, autoload: true, persistenceMethod: 'memory'
    })

    db.value = await createRxDatabase({
      name: 'logbooks',
      storage: getRxStorageLoki({
        adapter: new LokiIncrementalIndexedDBAdapter()
      //  autosave: true, autosaveInterval: 5000, autoload: true, persistenceMethod: 'memory'
      })
    }).then((db) => {
      try {
        db.addCollections(collections)
      } catch {

      }

      return db
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
  async function resetDatabase () {
    if (confirm('This will delete all of your data!') !== true) {
      return
    }

    //
    console.warn('Deleting database...')

    await removeRxDatabase('logbooks', storage.value)
  }

  function getLogbooksQuery () {
    // rxdb.logbooks.findOne(logbookId)
  }

  function getLogbookEntriesQuery (logbook: string) {
    return db.value.entries
      .find()
      .where({ logbook })
      .sort('timestamp')
  }

  return {
    db,
    rxdb: db,

    createDatabase,
    resetDatabase,

    getLogbooksQuery,
    getLogbookEntriesQuery,
    // fetchState: db,
    // entries:  computed(() => db.value.entries),
    seed: () => { seedFakeLogbook(db.value) }
  }
})

// Initialize the database.
// useDatabase().createDatabase()

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDatabase, import.meta.hot))
}
