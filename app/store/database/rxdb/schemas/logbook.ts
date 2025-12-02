import type {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  RxQuery,
} from 'rxdb';
import { toTypedRxJsonSchema } from 'rxdb';
import { seedFakeLogbook } from '../seeder';
import type { LogbookEntryDocumentType } from './logbookEntry';

export const logbookSchemaLiteral = {
  title: 'logbook',
  type: 'object',
  primaryKey: 'id',
  version: 4,
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
      final: true,
    },
    name: {
      type: 'string',
      maxLength: 100,
    },
  },
  required: ['id', 'name'],
  // indexes: []
} as const;

const _schemaTyped = toTypedRxJsonSchema(logbookSchemaLiteral);

// aggregate the document type from the schema
export type LogbookDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof _schemaTyped
>;

export type LogbookDocumentMethods = {
  getEntriesQuery: () => RxQuery<LogbookEntryDocumentType>;
  getRouteParams: () => object;
};

export type LogbookCollectionMethods = {
  seed: () => Promise<any>;
  // countAllDocuments: () => Promise<number>
};

export type LogbookDocument = RxDocument<
  LogbookDocumentType,
  LogbookDocumentMethods
>;

// and then merge all our types
export type LogbookCollection = RxCollection<
  LogbookDocumentType,
  LogbookDocumentMethods,
  LogbookCollectionMethods
>;

// create the typed RxJsonSchema from the literal typed object.
export const logbookSchema: RxJsonSchema<LogbookDocumentType> =
  logbookSchemaLiteral;

export const logbookDocumentMethods: LogbookDocumentMethods = {
  getEntriesQuery() {
    const { database } = this.collection;

    const { primary, id } = this as LogbookDocument;

    return database.entries
      .find({
        selector: {
          logbook: { $eq: primary },
        },
      })
      .sort('timestamp');
  },

  getRouteParams() {
    const { primary, id } = this as LogbookDocument;

    return {
      logbookId: primary,
    };
  },
};

export const logbookCollectionMethods: LogbookCollectionMethods = {
  seed() {
    const { database } = this;

    return seedFakeLogbook(database);
  },
};
