<template>
  <LayoutPage>
    <template #title>
      <h1>View logbook: {{ $get(logbook, 'name') }}</h1>
    </template>

    <div v-if="!$fetchState.pending">
      <div class="p-3">{{ JSON.stringify(logbook) }}</div>

      <div v-for="entry in entries" :key="entry.primary">
        <nuxt-link
          :to="{
            name: 'logbooks-logbookId-entries-entryId',
            params: { logbookId: logbook.primary, entryId: entry.primary },
          }"
        >
          {{ new Date(entry.timestamp).toDateString() }}
        </nuxt-link>
      </div>

      <nuxt-link
        :to="{ name: 'logbooks-logbookId-entries-new', params: { logbookId } }"
        >Add entry</nuxt-link
      >
    </div>

    <nuxt-link to="/logbooks">back</nuxt-link>
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
      .exec()

    // Redirect if logbook is missing.
    if (!this.logbook) {
      return this.$router.push({ name: 'logbooks' })
    }
  },

  computed: {
    logbookId() {
      return this.logbook.primary
    },
  },
}
</script>
