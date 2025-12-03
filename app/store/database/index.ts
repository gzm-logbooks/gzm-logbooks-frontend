import { acceptHMRUpdate, defineStore } from 'pinia';
import type { RxDatabase } from 'rxdb';
import { removeRxDatabase } from 'rxdb';
import type { UserDatabase } from './rxdb/database';

/**
 *
 * @returns
 */
async function awaitUserDatabase(): Promise<UserDatabase> {
  const { $rxdb: rxdbPromise } = useNuxtApp();

  return await rxdbPromise;
}

/**
 * Utility to reset and reload the application.
 *
 * @returns List of deleted collections
 */
async function resetDatabase(database: UserDatabase): Promise<string[]> {
  if (confirm('This will delete all of your data!') !== true) {
    throw new Error('Cancelled');
  }

  //
  console.warn('Deleting database...');

  const deleted = await removeRxDatabase(database.name, database.storage);

  console.log(`Deleted ${deleted.length} collections`);

  //
  return deleted;
}

/**
 *
 */
export type DatabaseStatus = 'pending' | 'ready' | 'error';

export type OnReadyCallable = (
  db: UserDatabase,
  status: DatabaseStatus,
) => unknown;

/**
 *
 */
export const useDatabase = defineStore('userDatabase', () => {
  const rxdbInstance = shallowRef<UserDatabase>();
  const rxdbError = ref();

  // State...
  const status = ref<DatabaseStatus>('pending');
  const isReady = computed(() => status.value === 'ready');
  const isLoading = computed(() => status.value === 'pending');

  // Set up the main database instance...
  const whenReady = awaitUserDatabase()
    .then((db: UserDatabase) => {
      rxdbInstance.value = db;
      status.value = 'ready';
    })
    .catch((error: unknown) => {
      console.error('Failed to initialize RxDB:', error);
      status.value = 'error';
      rxdbError.value = error;
    });

  // Helper functions...
  function onReady(callable: OnReadyCallable) {
    return whenReady.then(() => callable(getUserDatabase(), unref(status)));
  }

  function getUserDatabase(): UserDatabase {
    const instance = rxdbInstance.value;

    if (!instance) {
      throw new Error('RXDB instance unavailable');
    }

    return instance;
  }

  async function resetUserDatabase(): Promise<void> {
    return resetDatabase(getUserDatabase())
      .then(() => undefined)
      .finally(() => {
        window.location.reload();
      });
  }

  async function seedUserLogbook(): Promise<any> {
    const instance = getUserDatabase();

    console.info('Seeding user logbook(s)');

    return Promise.all([instance.logbooks.seed()]);
  }

  // Query functions...
  const getLogbooksQuery = () => getUserDatabase().logbooks.find();
  const getLogbookEntriesQuery = (id: string) =>
    getUserDatabase().entries.find().where({ id }).sort('timestamp');

  return {
    rxdbInstance,
    rxdbError,

    status,
    isReady,
    isLoading,

    getLogbooksQuery,
    getLogbookEntriesQuery,

    onReady,
    awaitUserDatabase,
    resetUserDatabase,
    seedUserLogbook,

    // debug
    // allEntries,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDatabase, import.meta.hot));
}
