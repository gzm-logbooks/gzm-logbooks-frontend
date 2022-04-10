
import RemoteStorage from 'remotestoragejs'
import { defineNuxtPlugin } from '#app'

/**
 * Register the plugin...
 */
export default defineNuxtPlugin((nuxtApp) => {
  const { buildInfo } = useRuntimeConfig()

  const remoteStorage = setupRemoteStorage(buildInfo.name)

  // Add $remoteStorage field to app context.
  return {
    provide: {
      remoteStorage,
    },
  }
})

/**
 * Get an instance of the remote storage service.
 */
export function setupRemoteStorage(rootPath) {
  const remoteStorage = new RemoteStorage({ logging: true })

  remoteStorage.access.claim(rootPath, 'rw')
  remoteStorage.caching.enable(`/${rootPath}/`)

  return remoteStorage
}
