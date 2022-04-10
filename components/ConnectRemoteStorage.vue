<template>
  <div id="remoteStorageWidget" ref="remoteStorageWidget"></div>
</template>

<script>
export default {
  async mounted() {
    const { $remoteStorage: storage } = this
    const { remoteStorageWidget: element } = this.$refs

    console.log({ storage, element })

    if (!storage || !element) {
      throw new Error('Could not set up remote storage widget.')
    }

    //
    await storage.on('ready', () => {
      const Widget = import('remotestorage-widget')
      const widget = new Widget(storage)

      widget.attach(element.id)
    })
  },
}
</script>
