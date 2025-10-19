import { defineStore } from 'pinia'
import { ref, watchEffect, watch, computed, readonly, toRaw } from 'vue'
import { nanoid } from 'nanoid'
import { useDatabase } from './database'
import { useAppRoutes } from '~/composables/useAppRoutes'
import type {
  LogbookDocumentType,
  LogbookCollection,
  LogbookDocument,
} from '~/store/database/rxdb/schemas/logbook'
import type { RouteLocationRaw } from 'vue-router'
import type {
  LogbookEntryCollection,
  LogbookEntryDocument,
  LogbookEntryDocumentType,
} from '~/store/database/rxdb/schemas'

import { useSubscription, useObservable } from '@vueuse/rxjs'

export interface LogbookItem {
  data: LogbookDocumentType
  entryCount?: number
  entryLast?: Date
}

export interface LogbookEntryItem {
  data: LogbookDocumentType
}

// export interface LogbookItem extends LogbookDocumentType {
//   update: (fields: Partial<LogbookDocumentType>) => Promise<LogbookDocument>
//   delete: () => Promise<LogbookDocument>
//   addEntry: (fields: LogbookEntryDocumentType) => Promise<LogbookEntryDocument>
//   getRoute: () => RouteLocationRaw
//   getEntryRoute: (id: string) => RouteLocationRaw
//   getCreateEntryRoute: () => RouteLocationRaw
// }

// export interface LogbookEntryItem {
//   update: (fields: Partial<LogbookEntryDocumentType>) => Promise<LogbookEntryDocument>
//   delete: () => Promise<LogbookEntryDocument>
//   getRoute: () => RouteLocationRaw
//   getLogbookRoute: () => RouteLocationRaw
// }

// Define the possible states for local data loading
// Note the added 'waiting_db' state which reflects the dependency hierarchy.
type LogbooksReadyStatus = 'pending' | 'ready' | 'error'

export const useLogbookStore = defineStore('logbooks', () => {
  const router = useAppRoutes()

  let logbooksDocuments: Ref
  let entriesDocuments: Ref

  // State and internal vars...
  const logbooksError = ref<any>(null)

  const entriesError = ref<any>(null)

  // Start in the state where we are waiting for the dependency
  const status = ref<LogbooksReadyStatus>('pending')

  // Convenience computed properties for external use
  const isLoading = computed(() => status.value === 'pending')
  const isLoaded = computed(() => status.value === 'ready')
  const hasError = computed(() => status.value === 'error')

  /**
   * Finds the collection reference and starts the subscription.
   */
  function setupSubscriptions() {
    const { database, status: databaseStatus } = useDatabase()

    // Only run if the database is actually ready
    if (databaseStatus !== 'ready' || !database) {
      return
    }

    status.value = 'pending' // Transition to local loading state

    // All logbooks
    logbooksDocuments = useObservable(
      database.logbooks.find().sort({ name: 'asc' }).$,
      {
        onError: (err) => {
          console.error('Logbook RxDB Subscription Error:', err)
          logbooksError.value = err
        },
      },
    )

    // All entries...
    // TODO: Do we really need to fetch all entries?
    entriesDocuments = useObservable(database.entries.find().$, {
      onError: (err) => {
        console.error('Logbook RxDB Subscription Error:', err)
        entriesError.value = err
      },
    })

    status.value = 'ready'
  }

  async function createLogbook(name: string) {
    const { database, status: databaseStatus } = useDatabase()

    if (!database?.logbooks) {
      throw new Error('Internal database not ready')
    }

    await database.logbooks.insert({
      id: nanoid(10),
      name: name.trim(),
    })
  }

  // Watch the database status and trigger transitions accordingly.
  const databaseStore = useDatabase()

  watch(
    () => databaseStore.status,
    (databaseStatus) => {
      console.log(`Logbook Store: DB status changed to ${databaseStatus}.`)

      if (databaseStatus === 'ready') {
        // Database is ready, and we haven't started listening yet -> Go to PENDING (local loading)
        setupSubscriptions()
      }
    },
    { immediate: true },
  )

  // TODO
  // const logbookEntries

  const logbooks = computed<LogbookItem[]>(() => {
    // Apply the transformation only when logbooksDocuments changes
    return Array.from(logbooksDocuments?.value ?? []).map(
      (doc: LogbookDocument): LogbookItem => {
        // 1. Get plain data (strips RxDB persistence methods)
        const data = doc.toJSON() as LogbookDocumentType

        const logbookId = data.id

        // 2. Inject Presentation/Action methods
        return {
          data,

          // Model actions...
          update: (fields: Partial<LogbookDocumentType>) => {
            return doc.patch({ ...fields })
          },

          delete: () => {
            return doc.remove()
          },

          addEntry: (fields: LogbookEntryDocumentType) => {
            // TODO: Use logbookEntry store when implemented...
          },

          // Routes...
          getRoute: () => router.getLogbookRoute({ logbookId }),
          getEntryRoute: (entryId: string) =>
            router.getLogbookEntryRoute({ logbookId, entryId }),
          getCreateEntryRoute: () =>
            router.getLogbookCreateEntryRoute({ logbookId }),
        }
      },
    )
  })

  return {
    status,
    logbooksDocuments,
    entriesDocuments,

    logbooks,
    isLoading,
    isLoaded,
    hasError,
    createLogbook,
  }
})
