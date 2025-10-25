import { defineStore, acceptHMRUpdate } from 'pinia'
import type { RxDatabase, RxStorage } from 'rxdb'
import { addRxPlugin, createRxDatabase, removeRxDatabase } from 'rxdb'
import type { UserDatabase } from './rxdb/database'
import { seedFakeLogbook } from './rxdb/seeder'

export type DatabaseStatus = 'pending' | 'ready' | 'error'

/**
 * Utility to reset and reload the application.
 */
async function resetDatabase(database: RxDatabase) {
  if (confirm('This will delete all of your data!') !== true) {
    return
  }

  //
  console.warn('Deleting database...')

  const deleted = await removeRxDatabase(database.name, database.storage)

  console.log(`Deleted ${deleted.length} collections`)
}

export const useDatabase = defineStore('userDatabase', () => {
  // STATE
  const status = ref<DatabaseStatus>('pending')
  const database = shallowRef<UserDatabase | null>(null)

  // CONVENIENCE COMPUTED PROPERTIES (for backward compatibility and readability)
  const isReady = computed(() => status.value === 'ready')
  const isLoading = computed(() => status.value === 'pending')

  const { $rxdb: rxdbPromise } = useNuxtApp()

  rxdbPromise
    .then((db: UserDatabase) => {
      database.value = db
      status.value = 'ready'
    })
    .catch((error: any) => {
      console.error('Failed to initialize RxDB:', error)
      status.value = 'error'
    })

  async function getUserDatabase() {
    return await rxdbPromise
  }

  async function resetUserDatabase() {
    await resetDatabase(database.value)

    window.location.reload()
  }

  async function seedUserLogbook() {
    console.info('Seeding user logbook(s)')

    return Promise.all([database.value?.logbooks.seed()])
  }

  function getLogbooksQuery() {
    return database.value.logbooks.find()
  }

  function getLogbookEntriesQuery(id: string) {
    return database.value.entries.find().where({ id }).sort('timestamp')
  }

  return {
    status,
    database,
    isReady,
    isLoading,

    getLogbooksQuery,
    getLogbookEntriesQuery,

    getUserDatabase,
    resetUserDatabase,
    seedUserLogbook,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDatabase, import.meta.hot))
}
