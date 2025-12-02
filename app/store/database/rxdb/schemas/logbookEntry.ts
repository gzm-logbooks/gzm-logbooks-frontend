import type {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
} from 'rxdb';
import { toTypedRxJsonSchema } from 'rxdb';

export const logbookEntrySchemaLiteral = {
  title: 'Entry',
  type: 'object',
  version: 4,
  properties: {
    timestamp: {
      type: 'string',
      minLength: 12,
      maxLength: 100,
    },
    logbook: {
      type: 'string',
      ref: 'logbooks',
      minLength: 1,
      maxLength: 100,
    },
    amountAnxiety: {
      type: 'number',
    },
    amountGrowth: {
      type: 'number',
    },
    amountComfort: {
      type: 'number',
    },
    comment: {
      type: 'string',
    },
  },
  primaryKey: 'timestamp',
  indexes: ['logbook'],
  required: ['timestamp', 'logbook'],
} as const;

const _schemaTyped = toTypedRxJsonSchema(logbookEntrySchemaLiteral);

// aggregate the document type from the schema
export type LogbookEntryDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof _schemaTyped
>;

export type LogbookEntryDocumentMethods = {
  getRouteParams: () => object;
};

// we declare one static ORM-method for the collection
export type LogbookEntryCollectionMethods = {};

export type LogbookEntryDocument = RxDocument<
  LogbookEntryDocumentType,
  LogbookEntryDocumentMethods
>;

// and then merge all our types
export type LogbookEntryCollection = RxCollection<
  LogbookEntryDocumentType,
  LogbookEntryDocumentMethods,
  LogbookEntryCollectionMethods
>;

// create the typed RxJsonSchema from the literal typed object.
export const logbookEntrySchema: RxJsonSchema<LogbookEntryDocumentType> =
  logbookEntrySchemaLiteral;

export const logbookEntryDocumentMethods: LogbookEntryDocumentMethods = {
  getRouteParams(): object {
    const { primary, logbook } = this;

    if (!primary || !logbook) {
      throw new Error('Missing core data');
    }

    return {
      logbookId: logbook,
      entryId: primary,
    };
  },
};

export const logbookEntryCollectionMethods: LogbookEntryCollectionMethods = {};
