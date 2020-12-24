import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
import * as IndexeddbAdaptor from 'pouchdb-adapter-indexeddb'

// Load schemas.
import entrySchema from '@/schemas/entry.json'
import subjectSchema from '@/schemas/subject.json'

// Add plugins.
addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(IndexeddbAdaptor)

// Add the dev plugins.
if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

//
export const createDatabase = async function () {
  const db = await createRxDatabase({
    name: 'subjects',
    adapter: 'indexeddb',
  })

  await db.addCollections({
    subjects: {
      schema: subjectSchema,
    },
    entries: {
      schema: entrySchema,
    },
  })

  return db
}

// Create a global instance.
const instance = createDatabase()

export const getDatabase = async function () {
  return await instance
}

// Expose global instance in dev env.
if (process.env.NODE_ENV === 'development') {
  getDatabase().then((db) => {
    window.db = db
  })
}
