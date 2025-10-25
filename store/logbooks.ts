import { defineStore } from 'pinia'
import { ref, watchEffect, watch, computed, readonly, toRaw } from 'vue'
import { nanoid } from 'nanoid'
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

import { keyBy } from 'lodash-es'
import { useSubscription, useObservable } from '@vueuse/rxjs'
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
  const router = useAppRoutes()

  const { database, status: databaseStatus } = storeToRefs(useDatabase())

  const logbooksSource$ = computed(() => {
    // Only return the actual RxDB query stream if the database is ready
    if (databaseStatus.value === 'ready' && !!database.value) {
      return database.value.logbooks.find().sort({ name: 'asc' }).$
    }
    // Otherwise, return an empty stream
    return EMPTY
  })

  // --- 2. Create the Vue Ref ONCE at the top level ---
  // This is the CRITICAL line that ensures cleanup
  const logbooksObservableRef = useObservable(logbooksSource$, {
    onError: (err) => {
      console.error('Logbook RxDB Subscription Error:', err)
      logbooksError.value = err
      status.value = 'error'
    },
  }) as Ref<LogbookDocument[] | undefined>

  // --- 3. Access the data ---
  // This unwraps the ref and provides an array (even if undefined/empty)
  // Our RXDB observer populated ref, not available immediately.
  // Use loaded logbooks or provide initial value
  const logbooksDocuments = computed(() => logbooksObservableRef.value || [])


  // State and internal vars...
  const logbooksError = ref<any>(null)

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
    const { status: databaseStatus } = useDatabase()

    // Only run if the database is actually ready
    if (databaseStatus !== 'ready' || !database) {
      return
    }

    status.value = 'pending' // Transition to local loading state

    // // All entries...
    // // TODO: Do we really need to fetch all entries?
    // entriesDocuments = useObservable(database.entries.find().$, {
    //   onError: (err) => {
    //     console.error('Logbook RxDB Subscription Error:', err)
    //     entriesError.value = err
    //   },
    // })

    status.value = 'ready'
  }

  function getLogbookEntriesReactive(
    doc: LogbookDocument,
  ): Readonly<Ref<any[]>> {
    return useObservable(doc.getEntriesQuery().$)
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
    console.log(logbooksDocuments.value)

    // FIXME
    // this returns items

    return logbooksDocuments.value

    // but this returns empty array
    // return Array.from(logbooksDocuments.value)

    // Apply the transformation only when logbooksDocuments changes
    return Array.from(logbooksDocuments?.value ?? []).map(
      (doc: LogbookDocument): LogbookItem => {
        // 1. Get plain data (strips RxDB persistence methods)
        const data = doc.toJSON() as LogbookDocumentType

        const logbookId = data.id

        const rxEntries = getLogbookEntriesReactive(doc)

        const entries = computed(() => {
          console.log(rxEntries.value)

          return rxEntries.value.map(
            (doc: LogbookEntryDocument): LogbookEntryItem => {
              return {
                doc: doc,
                data: doc.toJSON() as LogbookEntryDocumentType,
              }
            },
          )
        })

        const entriesCount = computed(() => unref(entries.value).length)

        console.log(entries.value)

        // const activity = computed(() => {
        //   unref(entries.value).reduce(
        //     (acc, currentValue) => {
        //       // if (currentValue.data)
        //     },
        //     {
        //       oldestEntry: null,
        //       latestEntry: null,
        //     },
        //   )
        // })

        // 2. Inject Presentation/Action methods
        return {
          data,

          doc,

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

          rxEntries,
          // entries,
          entriesCount,
          // activity,

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

  const logbooksById = computed(() => {
    return keyBy(logbooks.value, (item: LogbookItem) => item.data.id)
  })

  // const entriesByLogbookId = computed(() => {
  //     return logbooks.value.map((logbook) => getLogbookEntriesReactive(logbook.doc))
  // })

  return {
    status,
    logbooksDocuments,

    logbooks,
    logbooksById,
    // entriesByLogbookId,

    isLoading,
    isLoaded,
    hasError,
    createLogbook,
  }
})
