import { useObservable, useSubscription } from '@vueuse/rxjs';
import { format } from 'date-fns';
import { keyBy } from 'es-toolkit';
import { nanoid } from 'nanoid';
import { defineStore } from 'pinia';
import { EMPTY, firstValueFrom, Observable, Subject } from 'rxjs';
import { filter, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { computed, ref, toRaw } from 'vue';
import { useAppRoutes } from '~/composables/useAppRoutes';
import type {
  LogbookEntryDocument,
  LogbookEntryDocumentType,
} from '~/store/database/rxdb/schemas';
import type {
  LogbookDocument,
  LogbookDocumentType,
} from '~/store/database/rxdb/schemas/logbook';
import { useDatabase } from './database';

export interface LogbookItem {
  doc?: LogbookDocument;
  data: LogbookDocumentType;
  entries: Ref<LogbookEntryItem[]>;
  entriesCount: Ref<number>;
  activity: Ref<{
    oldestEntry: Date;
    latestEntry: Date;
  }>;
}

export interface LogbookEntryItem {
  doc?: LogbookEntryDocument;
  data: LogbookEntryDocumentType;
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
type LogbooksReadyStatus = 'pending' | 'ready' | 'error';

/**
 * Logbooks collection
 *
 * Here's where the references, computed values, and actions which are used to
 * view and manage multiple logbooks at a time live.
 */
export const useLogbookCollectionStore = defineStore('logbooks', () => {
  const database = useDatabase();

  const router = useAppRoutes();
  const rxdbLogbooks = ref<LogbookDocument[]>([]);
  const rxdbEntriesByLogbook = ref(
    new Map<string, Readonly<Ref<LogbookEntryDocument[]>>>(),
  );

  // Start in the state where we are waiting for the dependency
  const status = ref<LogbooksReadyStatus>('pending');

  // State and internal vars...
  const rxdbLogbooksError = ref<any>(null);

  // A Subject to signal when to complete ongoing subscriptions if the store is re-initialized (e.g., HMR)
  const destroy$ = new Subject<void>();

  /**
   * Finds the collection reference and starts the subscription.
   */
  function setupSubscriptions(): Promise {
    console.log('Setting up subscriptions');

    if (!database.rxdbInstance) {
      // This case should ideally not happen if database.status === 'ready' is checked.
      return Promise.reject(new Error('Internal database not ready.'));
    }

    const query = database.rxdbInstance.logbooks.find().sort({ name: 'asc' });

    const logbooksObservable = query.$.pipe(
      // Ensure this observable completes if the store is destroyed/re-initialized
      takeUntil(destroy$),

      // Use tap to perform side effects: updating `rxdbLogbooks.value` and `rxdbEntriesByLogbook`
      // for all emissions (including initial empty ones if any).
      tap((logbookDocs) => {
        rxdbLogbooks.value = logbookDocs; // Continuous update of the main logbooks ref

        // Set up logbook entries observables for each doc
        for (const doc of logbookDocs) {
          if (!rxdbEntriesByLogbook.value.has(doc.id)) {
            const observableRef = getLogbookEntriesReactive(doc);
            rxdbEntriesByLogbook.value.set(doc.id, observableRef);
            console.log(
              `Added reactive entries observable for logbook ID: ${doc.id}`,
              observableRef,
            );
          }
        }
        rxdbLogbooksError.value = null; // Clear any previous error on success
      }),

      // Share the subscription and replay the last value to new subscribers
      shareReplay(1),
    );

    const subscription = logbooksObservable.subscribe();

    useSubscription(subscription);
  }

  // Convenience computed properties for external use
  const isLoading = computed(() => status.value === 'pending');
  const isLoaded = computed(() => status.value === 'ready');
  const hasError = computed(() => status.value === 'error');

  function getLogbookEntriesReactive(
    doc: LogbookDocument,
  ): Readonly<Ref<LogbookEntryDocument[]>> {
    return useObservable(doc.getEntriesQuery().$, { initialValue: [] });
  }

  async function createLogbook(name: string) {
    if (!database.rxdbInstance) {
      throw new Error('Internal database not ready');
    }

    await database.rxdbInstance.logbooks.insert({
      id: nanoid(10),
      name: name.trim(),
    });
  }

  database.$subscribe(
    () => {
      console.log(`Logbook Store: DB status changed to ${database.status}.`);

      if (database.status === 'ready') {
        setupSubscriptions();
        // Database is ready, and we haven't started listening yet -> Go to PENDING (local loading)
      }
    },
    { immediate: true },
  );

  // TODO
  // const logbookEntries

  const logbooks = computed<LogbookItem[]>(() => {
    // FIXME
    // this returns items

    // return rxdbLogbooks.value

    // but this returns empty array
    // return Array.from(rxdbLogbooks.value)

    // Apply the transformation only when rxdbLogbooks changes
    return Array.from(rxdbLogbooks.value).map((doc): LogbookItem => {
      // 1. Get plain data (strips RxDB persistence methods)
      const data = doc.toJSON() as LogbookDocumentType;

      const logbookId = data.id;

      const entries = computed(() => {
        const logbookEntriesRef = rxdbEntriesByLogbook.value.get(logbookId);

        console.log({
          fromMap: logbookEntriesRef,
          toRaw: toRaw(rxdbLogbooks),
          unref: unref(logbookEntriesRef),
          value: logbookEntriesRef?.value,
        });

        return Array.from(unref(logbookEntriesRef) || []).map(
          (doc: LogbookEntryDocument): LogbookEntryItem => {
            return {
              doc: doc,
              data: doc.toJSON() as LogbookEntryDocumentType,
            };
          },
        );
      });

      const entriesCount = computed(() => {
        console.log(
          `Logbook Store: - Computing 'entriesCount' for ${logbookId}`,
        );

        const logbookEntriesRef = rxdbEntriesByLogbook.value.get(logbookId);

        console.log(
          `Logbook Store: - 'logbookEntriesRef' for ${logbookId} (count):`,
          logbookEntriesRef,
        );

        const unrefedEntries = unref(logbookEntriesRef);

        const count = unrefedEntries?.length || 0;

        console.log(
          `Logbook Store: - Final 'entriesCount' for ${logbookId}: ${count}`,
        );
        return count;
      });

      // console.log(entries.value)

      const _activity = computed(() => {
        unref(entries.value).reduce(
          (_acc, _currentValue) => {
            // if (currentValue.data)
          },
          {
            oldestEntry: null,
            latestEntry: null,
          },
        );
      });

      // 2. Inject Presentation/Action methods
      return {
        data,

        // Model actions...
        update: (fields: Partial<LogbookDocumentType>) => {
          return doc.patch({ ...fields });
        },

        delete: () => {
          return doc.remove();
        },

        addEntry: (_fields: LogbookEntryDocumentType) => {
          // TODO: Use logbookEntry store when implemented...
        },

        // rxEntries,
        entries,
        entriesCount,
        // activity,

        getEntries: async () => {
          return await database.rxdbInstance?.entries.find().exec();
        },

        // Routes...
        getRoute: () => router.getLogbookRoute({ logbookId }),
        getEntryRoute: (entryId: string) =>
          router.getLogbookEntryRoute({ logbookId, entryId }),
        getCreateEntryRoute: () =>
          router.getLogbookCreateEntryRoute({ logbookId }),
      };
    });
  });

  const logbooksById = computed(() => {
    return keyBy(logbooks.value, (item: LogbookItem) => item.data.id);
  });

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
  };
});

/**
 * Logbook details
 *
 * References and actions to view, manipulate, and manage entries of a single
 * logbook.
 */
export const useLogbookStore = (logbookId: string) => {
  return defineStore(`logbook[${logbookId}]`, () => {
    const logbooksStore = useLogbookCollectionStore();
    const { logbooksById } = storeToRefs(logbooksStore);

    console.log({ logbooksStore, logbooksById });
    // const logbook = logbooksById.value[logbookId];
    const logbook = ref(logbooksStore.logbooksById.value[logbookId]);

    console.log({ logbook });

    // const logbook = computed(() => logbooksStore.logbooksById.value[logbookId])
    const entries = logbook.entries;

    // import { format } from 'date-fns'
    // import { useDatabase } from '~/store/database'
    // import { scaledMoodInput } from '~/../data/config'

    const _edit = ref<boolean>(false);
    const _fields = ref({});

    // Get all entries.
    // const entries = await logbook.value.getEntries()

    console.log({ logbookId, entries });

    const lastEntry = computed(() => entries.value?.[0]);

    const lastWeekEntries = computed(() =>
      (entries.value ?? [])
        .slice(1)
        .filter(
          (entry) =>
            Date.now() - 7 * 24 * 60 * 60 * 1000 < new Date(entry.timestamp),
        ),
    );
    const olderEntries = computed(() =>
      (entries.value ?? [])
        .slice(1)
        .filter(
          (entry) =>
            Date.now() - 7 * 24 * 60 * 60 * 1000 > new Date(entry.timestamp),
        ),
    );

    // TODO
    function downloadLogbook() {
      const data = entries.map((entry) => {
        const {
          timestamp,
          comment,
          amountAnxiety,
          amountGrowth,
          amountComfort,
        } = entry;

        const mood = scaledMoodInput({
          amountAnxiety,
          amountGrowth,
          amountComfort,
        });

        return [
          format(new Date(timestamp), 'yyyy-MM-dd'),
          comment,
          mood.amountAnxiety.toFixed(4),
          mood.amountGrowth.toFixed(4),
          mood.amountComfort.toFixed(4),
        ];
      });

      let csv = 'Date,Comment,Anxiety,Growth,Comfort,\n';
      data.forEach((row) => {
        csv += row.join(',');
        csv += '\n';
      });

      const hiddenElement = document.createElement('a');
      hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
      hiddenElement.target = '_blank';
      hiddenElement.download = `${logbook.value.name}.csv`;
      hiddenElement.click();
    }

    // TODO: move to store
    // async function _save(fields) {
    //   const data = {
    //     name: fields.name,
    //   }

    //   await logbook.value.atomicPatch(data)
    // }

    // function reset() {
    //   console.log(logbook.value)

    //   const { name } = logbook.value
    //   console.log(logbook.value)

    //   fields.value = {
    //     name: logbook.value.name,
    //   }

    //   //
    //   edit.value = false
    // }

    return {
      logbook,
      entries,
      lastEntry,
      lastWeekEntries,
      olderEntries,
      downloadLogbook,
    };
  })();
};

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useLogbookCollectionStore, import.meta.hot),
    // acceptHMRUpdate(useLogbookStore, import.meta.hot),
  );
}
function scaledMoodInput(_arg0: {
  amountAnxiety: any;
  amountGrowth: any;
  amountComfort: any;
}) {
  throw new Error('Function not implemented.');
}
