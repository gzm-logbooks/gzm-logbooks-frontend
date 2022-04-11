<template>
  <div id="remoteStorageWidget" ref="widgetContainer"></div>
</template>

<script>
import Widget from 'remotestorage-widget'

export default {
  async mounted() {
    const { $remoteStorage: storage } = this
    const { widgetContainer: element } = this.$refs

    console.log({ storage, element })

    if (!storage || !element) {
      throw new Error('Could not set up remote storage widget.')
    }

    await storage.on('ready', () => {
      const widget = new Widget(storage)

      widget.attach(element.id)
    })
  },
}
</script>
