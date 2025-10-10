import { defineStore } from 'pinia'
import { ref, watchEffect, watch, computed, readonly } from 'vue'
import { nanoid } from 'nanoid'
import { useDatabase } from './database'
import { useAppRoutes } from '~/composables/useAppRoutes'
import type { LogbookDocumentType, LogbookCollection, LogbookDocument } from '~/data/schemas/logbook'
import type { RouteLocationRaw } from 'vue-router'

export interface LogbookItem extends LogbookDocumentType {
  update: (fields: Partial<LogbookDocumentType>) => Promise<LogbookDocument>
  delete: () => Promise<LogbookDocument>
  getRoute: () => RouteLocationRaw
  getEntryRoute: (id: any) => RouteLocationRaw
  getCreateEntryRoute: () => RouteLocationRaw
}

// Define the possible states for local data loading
// Note the added 'waiting_db' state which reflects the dependency hierarchy.
type StoreStatus = 'waiting_db' | 'pending' | 'loaded' | 'error'

export const useLogbookStore = defineStore('logbook', () => {
  const dbStore = useDatabase()
  const router = useAppRoutes()

  // State
  const rxLogbooks = ref<LogbookDocument[]>([])

  // Start in the state where we are waiting for the dependency
  const status = ref<StoreStatus>('waiting_db')

  // Convenience computed properties for external use
  const isLoading = computed(() => status.value === 'pending' || status.value === 'waiting_db')
  const isLoaded = computed(() => status.value === 'loaded')
  const hasError = computed(() => status.value === 'error')

  let collection: LogbookCollection | undefined
  let subscriptionActive = false

  /**
   * Finds the collection reference and starts the subscription.
   */
  function setupCollectionAndSubscription() {
    // Only run if the database is actually ready
    if (dbStore.status !== 'ready') {
      return
    }

    const db = dbStore.database
    if (!db) return // Should not happen if status is 'ready', but safe guard

    collection = db.logbooks
    status.value = 'pending' // Transition to local loading state

    // Define the reactive RxDB query
    const query = collection.find().sort({ name: 'asc' })

    watchEffect((onCleanup) => {
      // Use the observer object structure to properly handle next (data) and error
      const subscription = query.$.subscribe({
        next: (docs) => {
          // Map RxDocuments to plain objects for Pinia state
          rxLogbooks.value = docs
          status.value = 'loaded' // Data has been successfully loaded
          subscriptionActive = true
        },
        error: (err) => {
          console.error('Logbook RxDB Subscription Error:', err)
          status.value = 'error' // Critical: Communicate failure to the UI
          rxLogbooks.value = [] // Clear potentially corrupt data
          subscriptionActive = false
        },
      })

      // RxJS cleanup hook
      onCleanup(() => {
        subscription.unsubscribe()
        subscriptionActive = false
      })
    })
  }

  // Watch the database status and trigger transitions accordingly.
  watch(() => dbStore.status, (dbStatus) => {
    console.log(`Logbook Store: DB status changed to ${dbStatus}.`)

    if (dbStatus === 'ready' && !subscriptionActive) {
      // Database is ready, and we haven't started listening yet -> Go to PENDING (local loading)
      setupCollectionAndSubscription()
    } else if (dbStatus === 'pending') {
      // Database is still starting -> Remain WAITING
      status.value = 'waiting_db'
    } else if (dbStatus === 'error') {
      // Database failed to initialize -> Go to ERROR
      console.error("Logbook Store: Inheritance Error. Cannot load data because the Database failed.")
      status.value = 'error'
    }
  }, { immediate: true })

  async function createLogbook(name: string) {
    if (!collection) {
      throw new Error("Internal database not ready")
    }

    await collection.insert({
      id: nanoid(10),
      name: name.trim(),
    })
  }

const logbooks = computed<LogbookItem[]>(() => {
    if (status.value === 'error' || !collection) {
      return []
    }

    // Apply the transformation only when rxLogbooks changes
    return rxLogbooks.value.map((doc: LogbookDocument): LogbookItem => {
      // 1. Get plain data (strips RxDB persistence methods)
      const rawData = doc.toJSON() as LogbookDocumentType;

      const logbookId = rawData.id;

      // 2. Inject Presentation/Action methods
      return {
        ...rawData,

        // Model actions...
        update: (fields: Partial<LogbookDocumentType>) => {
          return doc.patch({ ...fields })
        },

        delete: () => {
          return doc.remove()
        },

        // Routes...
        getRoute: () => router.getLogbookRoute({ logbookId }),
        getEntryRoute: (entryId: any) => router.getLogbookEntryRoute({ logbookId, entryId }),
        getCreateEntryRoute: () => router.getLogbookCreateEntryRoute({ logbookId }),
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
