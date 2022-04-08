<template>
  <nuxt-link :to="route">
    <Card content-class="p-2">
      <span class="card-title">{{ $get(logbook, 'name') }}</span>
      <p class="mb-1 text-sm text-gray-600">{{ countEntries }} entries</p>

      <template #top>
        <div class="shadow-inner min-h-[8rem]">
          <ProgressChart v-if="entries.length > 1" :entries="entries" />
        </div>
      </template>
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
    const entriesQuery = db.entries
      .find()
      .where({ logbook: this.primary })
      .sort('timestamp')

    this.$subscribeTo(logbookQuery.$, (logbook) => (this.logbook = logbook))
    this.$subscribeTo(entriesQuery.$, (entries) => (this.entries = entries))
  },
  computed: {
    route() {
      return this.logbook?.getRoute() ?? {}
    },
    countEntries() {
      return this.entries?.length ?? 0
    },
  },
}
</script>
