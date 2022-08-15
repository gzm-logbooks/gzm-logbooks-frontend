import { defineStore, acceptHMRUpdate } from 'pinia'
import { RxDatabase } from 'rxdb';
import { createDatabase } from '~~/data/database';
import { seedFakeLogbook } from '~~/data/seeder';

export const useDatabase = defineStore('entriesDb', () => {
  const db = ref<RxDatabase>()

  // Initialize the database.
  createDatabase().then((rxdb: RxDatabase) => {db.value = rxdb})

  function getLogbooksQuery() {
    // rxdb.logbooks.findOne(logbookId)
  }

  function getLogbookEntriesQuery(logbook: string) {
    return db.value.entries
    .find()
    .where({ logbook: logbook })
    .sort('timestamp')
  }

  return {
    db,
    rxdb: db,
    getLogbooksQuery,
    getLogbookEntriesQuery,
    // fetchState: db,
    // entries:  computed(() => db.value.entries),
    seed: () => {seedFakeLogbook(db.value)}
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDatabase, import.meta.hot))
}
