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
  const rxdbInstance = shallowRef<UserDatabase | null>(null)

  // CONVENIENCE COMPUTED PROPERTIES (for backward compatibility and readability)
  const isReady = computed(() => status.value === 'ready')
  const isLoading = computed(() => status.value === 'pending')

  const { $rxdb: rxdbPromise } = useNuxtApp()

  rxdbPromise
    .then((db: UserDatabase) => {
      rxdbInstance.value = db
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
    const instance = rxdbInstance.value

    if (!instance) {
      throw new Error('RXDB instance unavailable')
    }

    await resetDatabase(rxdbInstance.value)

    window.location.reload()
  }

  async function seedUserLogbook() {
    const instance = rxdbInstance.value

    if (!instance) {
      throw new Error('RXDB instance unavailable')
    }

    console.info('Seeding user logbook(s)')

    return Promise.all([instance.logbooks.seed()])
  }

  function getLogbooksQuery() {
    const instance = rxdbInstance.value

    if (!instance) {
      throw new Error('RXDB instance unavailable')
    }

    return instance.logbooks.find()
  }

  function getLogbookEntriesQuery(id: string) {
    const instance = rxdbInstance.value

    if (!instance) {
      throw new Error('RXDB instance unavailable')
    }

    return instance.entries.find().where({ id }).sort('timestamp')
  }

  return {
    status,
    rxdbInstance,

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
