import { defineStore, acceptHMRUpdate } from 'pinia'
import type { RxDatabase, RxStorage } from 'rxdb'
import { addRxPlugin, createRxDatabase, removeRxDatabase } from 'rxdb'
import { seedFakeLogbook } from '~/data/seeder'

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
   const { $rxdb: userData } = useNuxtApp()

  async function getUserDatabase() {
    return userData
  }

  async function resetUserDatabase() {
    await resetDatabase(userData)

    window.location.reload()
  }

  async function seedUserLogbook() {
    console.info('Seeding user logbook(s)')

    return Promise.all([seedFakeLogbook(userData)])
  }

  function getLogbooksQuery() {
    return userData.logbooks.find()
  }

  function getLogbookEntriesQuery(id: string) {
    return userData.entries.find().where({ id }).sort('timestamp')
  }

  return {
    userData,

    getLogbooksQuery,
    getLogbookEntriesQuery,

    getUserDatabase,
    resetUserDatabase,
    seedUserLogbook,

    logbooks: computed(() => userData.logbooks),
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDatabase, import.meta.hot))
}
