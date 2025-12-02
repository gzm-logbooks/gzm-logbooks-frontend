import type { RouteLocationRaw } from 'vue-router';

/**
 * Maps document keys to specific route names (Presentation Layer).
 */
export const useAppRoutes = () => {
  const getLogbookRoute = (params: {
    logbookId: string;
  }): RouteLocationRaw => ({
    name: 'logbooks-logbookId',
    params,
  });

  const getLogbookCreateEntryRoute = (params: {
    logbookId: string;
  }): RouteLocationRaw => ({
    name: 'logbooks-logbookId-entries-new',
    params,
  });

  const getLogbookEntryRoute = (params: {
    logbookId: string;
    entryId: string;
  }): RouteLocationRaw => ({
    name: 'logbooks-logbookId-entries-entryId',
    params,
  });

  return {
    getLogbookRoute,
    getLogbookCreateEntryRoute,
    getLogbookEntryRoute,
  };
};
