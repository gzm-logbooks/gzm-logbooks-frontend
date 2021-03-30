<template>
  <LayoutPage>
    <template #title>
      <h1>View logbook: {{ $get(logbook, 'name') }}</h1>
    </template>

    <div v-if="!$fetchState.pending">
      <li v-for="entry in entries" :key="entry.primary">
        <nuxt-link
          :to="{
            name: 'logbooks-logbookId-entries-entryId',
            params: { logbookId: logbook.primary, entryId: entry.primary },
          }"
        >
          {{ new Date(entry.timestamp).toDateString() }}
        </nuxt-link>
      </li>
    </div>

    <div class="flex justify-between mt-6">
      <nuxt-link
        :to="{ name: 'logbooks-logbookId-entries-new', params: { logbookId } }"
        >Add entry</nuxt-link
      >

      <nuxt-link class="button" to="/logbooks">Back</nuxt-link>
    </div>

    <!-- -->
    <template v-if="!$fetchState.pending" #debug>
      <Card>
        <template #title>Saved data</template>
        <pre>{{ JSON.stringify(logbook, null, 2) }}</pre>
      </Card>
    </template>
  </LayoutPage>
</template>

<script>
export default {
  data() {
    return {
      logbook: null,
    }
  },

  async fetch() {
    const { logbookId } = this.$route.params

    // Get logbook record from database.
    this.logbook = await this.$db.logbooks.findOne(logbookId).exec()

    // Get logbook entry records.
    this.entries = await this.$db.entries
      .find()
      .where({ logbook: logbookId })
      .sort()
      .exec()

    // Redirect if logbook is missing.
    if (!this.logbook) {
      return this.$router.push({ name: 'logbooks' })
    }
  },

  computed: {
    logbookId() {
      return this.logbook?.primary
    },
  },
}
</script>
