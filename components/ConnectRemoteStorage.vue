<template>
  <div id="remoteStorageWidget" ref="widgetContainer" />
</template>

<script setup lang="ts">
import Widget from 'remotestorage-widget'

const widgetContainer = ref()

onMounted (async () => {
  const { $remoteStorage: storage } = useNuxtApp()

  const element = widgetContainer.value

  console.log({ storage, element })

  if (!storage || !element) {
    throw new Error('Could not set up remote storage widget.')
  }

  //
  await storage.on('ready', async () => {
    console.log({ Widget })
    // const Widget = await import('remotestorage-widget')
    // .then(
    //   (widget) => widget.attach(element.id)
    // )

    const widget = new Widget(storage)
    widget.attach(element.id)
  })
})
</script>
