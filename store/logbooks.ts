import { defineStore } from 'pinia'
import { ref, watchEffect, watch, computed, readonly } from 'vue'
import { nanoid } from 'nanoid'
import { useDatabase } from './database'
import { useAppRoutes } from '~/composables/useAppRoutes'
import type {
  LogbookDocumentType,
  LogbookCollection,
  LogbookDocument,
} from '~/data/schemas/logbook'
import type { RouteLocationRaw } from 'vue-router'
import type {
  LogbookEntryDocument,
  LogbookEntryDocumentType,
} from '~/data/schemas'

import { useSubscription } from '@vueuse/rxjs'

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
type StoreStatus = 'waiting_db' | 'pending' | 'loaded' | 'error'

export const useLogbookStore = defineStore('logbook', () => {
  const dbStore = useDatabase()
  const router = useAppRoutes()

  // State and internal vars...
  const logbooksDocuments = ref<LogbookDocument[]>([])
  let logbooksCollection: LogbookCollection | undefined
  let logbooksSubscribed = false
  let logbooksLoaded = false
  let logbooksError = false

  const entriesDocuments = ref<LogbookEntryDocument[]>([])
  let entriesCollection: LogbookCollection | undefined
  let entriesSubscribed = false
  let entriesLoaded = false
  let entriesError = false

  // Start in the state where we are waiting for the dependency
  const status = ref<StoreStatus>('waiting_db')

  // Convenience computed properties for external use
  const isLoading = computed(
    () => status.value === 'pending' || status.value === 'waiting_db',
  )
  const isLoaded = computed(() => status.value === 'loaded')
  const hasError = computed(() => status.value === 'error')

  /**
   * Finds the collection reference and starts the subscription.
   */
  function setupSubscriptions() {
    // Only run if the database is actually ready
    if (dbStore.status !== 'ready') {
      return
    }

    status.value = 'pending' // Transition to local loading state

    const db = dbStore.database
    if (!db) return // Should not happen if status is 'ready', but safe guard

    // All logbooks...
    if (!logbooksSubscribed) {
      logbooksCollection = db.logbooks
      logbooksSubscribed = true

      // Define the reactive RxDB query
      const query = logbooksCollection.find().sort({ name: 'asc' })
      // --- 1. Logbook Subscription (Parent Data) ---
      const logbookQuery = logbooksCollection.find().sort({ name: 'asc' })

      useSubscription(
        logbookQuery.$.subscribe({
          next: (docs) => {
            logbooksDocuments.value = docs
            logbooksLoaded = true
            logbooksError = null // Clear any previous error on success
          },
          error: (err) => {
            console.error('Logbook RxDB Subscription Error:', err)
            logbooksDocuments.value = []
            logbooksLoaded = false
            logbooksError = err
          },
        }),
      )
    }

    // All entries...
    // TODO: Do we really need to fetch all entries?
    if (!entriesSubscribed) {
      entriesCollection = db.entries
      entriesSubscribed = true

      const entriesQuery = entriesCollection.find()

      useSubscription(
        entriesQuery.$.subscribe({
          next: (docs) => {
            entriesDocuments.value = docs
            entriesLoaded = true
            entriesError = null // Clear any previous error on success
          },
          error: (err) => {
            console.error('Logbook Entries RxDB Subscription Error:', err)
            entriesDocuments.value = []
            entriesLoaded = false
            entriesError = err
          },
        }),
      )
    }
  }

  // Watch the database status and trigger transitions accordingly.
  watch(
    () => dbStore.status,
    (dbStatus) => {
      console.log(`Logbook Store: DB status changed to ${dbStatus}.`)

      if (dbStatus === 'ready' && (!logbooksSubscribed || !entriesSubscribed)) {
        // Database is ready, and we haven't started listening yet -> Go to PENDING (local loading)
        setupSubscriptions()
      }
    },
    { immediate: true },
  )

  async function createLogbook(name: string) {
    if (!logbooksCollection) {
      throw new Error('Internal database not ready')
    }

    await logbooksCollection.insert({
      id: nanoid(10),
      name: name.trim(),
    })
  }

  const logbooks = computed<LogbookItem[]>(() => {
    if (status.value === 'error' || !logbooksCollection) {
      return []
    }

    // Apply the transformation only when logbooksDocuments changes
    return logbooksDocuments.value.map((doc: LogbookDocument): LogbookItem => {
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
    })
  })

  return {
    logbooks,
    status, // Expose the full status
    isLoading,
    isLoaded,
    hasError,
    createLogbook,
  }
})
