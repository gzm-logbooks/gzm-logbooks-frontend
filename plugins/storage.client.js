
import RemoteStorage from 'remotestoragejs'
import { defineNuxtPlugin } from '#app'

/**
 * Register the plugin...
 */
export default function ({ app, $config }, inject) {
  const { appInfo, services } = $config

  // Add $remoteStorage field to app context.
  inject(
    'remoteStorage',
    setupRemoteStorage({
      rootPath: appInfo.name,
      ...services,
    })
  )
}

/**
 * Get an instance of the remote storage service.
 */
export function setupRemoteStorage({
  rootPath,
  googleDriveClientId,
  dropboxAppKey,
}) {
  const remoteStorage = new RemoteStorage({ logging: true })

  remoteStorage.access.claim(rootPath, 'rw')
  remoteStorage.caching.enable(`/${rootPath}/`)

  remoteStorage.setApiKeys({
    dropbox: dropboxAppKey,
    googledrive: googleDriveClientId,
  })

  return remoteStorage
}
