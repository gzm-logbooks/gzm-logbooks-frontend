import { NuxtApp } from '#app'
import RemoteStorage from 'remotestoragejs'

/**
 * Register the plugin...
 */
export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const { appInfo, services } = useRuntimeConfig()

  const remoteStorage = setupRemoteStorage({
    rootPath: appInfo.name,
    ...services
  })

  // Add $remoteStorage field to app context.
  return {
    provide: {
      remoteStorage
    }
  }
})

/**
 * Get an instance of the remote storage service.
 */
export function setupRemoteStorage ({
  rootPath,
  googleDriveClientId,
  dropboxAppKey
}) {
  const remoteStorage = new RemoteStorage({ logging: true })

  remoteStorage.access.claim(rootPath, 'rw')
  remoteStorage.caching.enable(`/${rootPath}/`)

  remoteStorage.setApiKeys({
    dropbox: dropboxAppKey,
    googledrive: googleDriveClientId
  })

  return remoteStorage
}
