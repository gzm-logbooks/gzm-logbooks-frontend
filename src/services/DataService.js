import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
import * as IndexeddbAdaptor from 'pouchdb-adapter-indexeddb'

import subjectSchema from '@/schemas/subject.json'
import entrySchema from '@/schemas/entry.json'

// Add plugins.
addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)

// Add the dev plugins.
if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

//
addRxPlugin(IndexeddbAdaptor)

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

  window.db = db

  return db
}

export const getDatabase = async function () {
  return await instance
}

const instance = createDatabase()
