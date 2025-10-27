import { defineStore } from 'pinia'
import { ref, computed, toRaw } from 'vue'
import { nanoid } from 'nanoid'
import type { Observable } from 'rxjs'
import { EMPTY } from 'rxjs'
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

import { keyBy } from 'es-toolkit'
import { useSubscription, useObservable, toObserver, from } from '@vueuse/rxjs'
import { compareAsc } from 'date-fns'

export interface LogbookItem {
  doc?: LogbookDocument
  data: LogbookDocumentType
  entries: Ref<LogbookEntryItem[]>
  entriesCount: Ref<number>
  activity: Ref<{
    oldestEntry: Date
    latestEntry: Date
  }>
}

export interface LogbookEntryItem {
  doc?: LogbookEntryDocument
  data: LogbookEntryDocumentType
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
  const database = useDatabase()

  const router = useAppRoutes()
  const rxdbLogbooks = ref<LogbookDocument[]>([])
  const rxdbEntriesByLogbook = reactive(
    new Map<string, Readonly<Ref<LogbookEntryDocument[]>>>(),
  )

  // Start in the state where we are waiting for the dependency
  const status = ref<LogbooksReadyStatus>('pending')

  // State and internal vars...
  const rxdbLogbooksError = ref<any>(null)

  /**
   * Finds the collection reference and starts the subscription.
   */
  function setupSubscriptions() {
    console.log('Setting up subscriptions')

    // All logbooks...
    if (database.rxdbInstance && status.value !== 'ready') {
      const query = database.rxdbInstance.logbooks.find().sort({ name: 'asc' })

      useSubscription(
        query.$.subscribe({
          next: (logbookDocs) => {
            // Save logbooks data...
            rxdbLogbooks.value = logbookDocs

            // Set up logbook entries observables...
            for (const doc of logbookDocs) {
              if (!rxdbEntriesByLogbook.has(doc.id)) {
                // If the logbook is new or its entries observable isn't tracked yet, add it
                rxdbEntriesByLogbook.set(
                  doc.id,
                  toRaw(getLogbookEntriesReactive(doc)),
                )
                console.log(
                  `Added reactive entries observable for logbook ID: ${doc.id}`,
                )
              } else {
                // For existing logbooks, reuse the existing observable.
                // No explicit action needed if it already exists, unless you want to log.
                console.log(
                  `Reusing reactive entries observable for logbook ID: ${doc.id}`,
                )
              }
            }

            rxdbLogbooksError.value = null // Clear any previous error on success
            status.value = 'ready'
          },
          error: (err) => {
            console.error('Logbook RxDB Subscription Error:', err)
            rxdbLogbooks.value = []
            rxdbLogbooksError.value = err
            status.value = 'error'
          },
        }),
      )
    }
  }

  // Convenience computed properties for external use
  const isLoading = computed(() => status.value === 'pending')
  const isLoaded = computed(() => status.value === 'ready')
  const hasError = computed(() => status.value === 'error')

  function getLogbookEntriesReactive(
    doc: LogbookDocument,
  ): Readonly<Ref<LogbookEntryDocument[]>> {
    return useObservable(doc.getEntriesQuery().$, { initialValue: [] })
  }

  async function createLogbook(name: string) {
    if (!database.rxdbInstance) {
      throw new Error('Internal database not ready')
    }

    await database.rxdbInstance.logbooks.insert({
      id: nanoid(10),
      name: name.trim(),
    })
  }

  database.$subscribe(
    () => {
      console.log(`Logbook Store: DB status changed to ${database.status}.`)

      if (database.status === 'ready') {
        setupSubscriptions()
        // Database is ready, and we haven't started listening yet -> Go to PENDING (local loading)
      }
    },
    { immediate: true },
  )

  // TODO
  // const logbookEntries

  const logbooks = computed<LogbookItem[]>(() => {
    console.log(rxdbLogbooks.value)

    // FIXME
    // this returns items

    // return rxdbLogbooks.value

    // but this returns empty array
    // return Array.from(rxdbLogbooks.value)

    // Apply the transformation only when rxdbLogbooks changes
    return Array.from(rxdbLogbooks.value).map((doc): LogbookItem => {
      // 1. Get plain data (strips RxDB persistence methods)
      const data = doc.toJSON() as LogbookDocumentType

      const logbookId = data.id

      const entries = computed(() => {
        const logbookEntriesRef = rxdbEntriesByLogbook.get(logbookId)

        return Array.from(unref(logbookEntriesRef) || []).map(
          (doc: LogbookEntryDocument): LogbookEntryItem => {
            return {
              doc: doc,
              data: doc.toJSON() as LogbookEntryDocumentType,
            }
          },
        )
      })

      const entriesCount = computed(() => {
        console.log(
          `Logbook Store: - Computing 'entriesCount' for ${logbookId}`,
        )

        const logbookEntriesRef = rxdbEntriesByLogbook.get(logbookId)

        console.log(
          `Logbook Store: - 'logbookEntriesRef' for ${logbookId} (count):`,
          logbookEntriesRef,
        )

        const unrefedEntries = unref(logbookEntriesRef)

        const count = unrefedEntries?.length || 0

        console.log(
          `Logbook Store: - Final 'entriesCount' for ${logbookId}: ${count}`,
        )
        return count
      })

      // console.log(entries.value)

      const activity = computed(() => {
        unref(entries.value).reduce(
          (acc, currentValue) => {
            // if (currentValue.data)
          },
          {
            oldestEntry: null,
            latestEntry: null,
          },
        )
      })

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

        // rxEntries,
        entries,
        entriesCount,
        // activity,

        // Routes...
        getRoute: () => router.getLogbookRoute({ logbookId }),
        getEntryRoute: (entryId: string) =>
          router.getLogbookEntryRoute({ logbookId, entryId }),
        getCreateEntryRoute: () =>
          router.getLogbookCreateEntryRoute({ logbookId }),
      }
    })
  })

  const logbooksById = computed(() => {
    return keyBy(logbooks.value, (item: LogbookItem) => item.data.id)
  })

  // const entriesByLogbookId = computed(() => {
  //     return logbooks.value.map((logbook) => getLogbookEntriesReactive(logbook.doc))
  // })

  return {
    status,
    rxdbLogbooks,
    rxdbEntriesByLogbook,

    logbooks,
    logbooksById,

    // entriesByLogbookId,

    isLoading,
    isLoaded,
    hasError,
    createLogbook,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLogbookStore, import.meta.hot))
}
