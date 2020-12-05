import { createRxDatabase,  addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import * as IndexeddbAdaptor from 'pouchdb-adapter-indexeddb';

import subjectSchema from '@/schemas/subject.json';

if (process.env.NODE_ENV === 'development') {
  // in dev-mode we add the dev-mode plugin
  // which does many checks and adds full error messages
  addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(IndexeddbAdaptor);

export const createDatabase = async function () {
    const db = await createRxDatabase({
        name: 'subjects',
        adapter: 'indexeddb',
    });

    await db.addCollections({
      subjects: {
        schema: subjectSchema,
      },
    });

    window.db = db

    return db
}

export const getDatabase = async function () {
    return await instance
}

const instance = createDatabase()
