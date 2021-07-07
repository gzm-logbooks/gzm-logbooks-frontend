<template>
  <nuxt-link :to="route">
    <Card class="mb-4" content-class="p-2">
      <span class="text-lg font-medium">{{ $get(logbook, 'name') }}</span>
      <p class="text-sm mb-1 text-gray-600">{{ countEntries }} entries</p>
    </Card>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    primary: { type: String, required: true },
  },
  data() {
    return {
      logbook: null,
      entries: [],
    }
  },
  async fetch() {
    const db = await this.$db
    const logbookId = this.primary

    // Get logbook record from database.
    const logbookQuery = db.logbooks.findOne(logbookId)

    //
    const entriesQuery = db.entries.find().where({ logbook: this.primary })

    this.$subscribeTo(logbookQuery.$, (logbook) => (this.logbook = logbook))
    this.$subscribeTo(entriesQuery.$, (entries) => (this.entries = entries))
  },
  computed: {
    route() {
      return this.logbook?.getRoute() || {}
    },
    countEntries() {
      return this.entries?.length || 0
    },
  },
}
</script>
