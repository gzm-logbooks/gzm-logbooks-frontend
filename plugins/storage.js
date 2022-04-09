import RemoteStorage from 'remotestoragejs'

/**
 * Register the plugin...
 */
export default function ({ app, $config }, inject) {
  const { appInfo } = $config

  // Add $remoteStorage field to app context.
  inject('remoteStorage', setupRemoteStorage(appInfo.name))
}

/**
 * Get an instance of the remote storage service.
 */
export function setupRemoteStorage(rootPath) {
  const remoteStorage = new RemoteStorage({ logging: true })

  remoteStorage.access.claim(rootPath, 'rw')
  remoteStorage.caching.enable(`/${rootPath}/`)

  return remoteStorage
}
