<template>
  <LayoutPage v-if="!$fetchState.pending">
    <LayoutPageHeader>
      <template #title>
        <h1>View logbook: {{ $get(logbook, 'name') }}</h1>
      </template>

      <nuxt-link class="link" :to="{ name: 'logbooks' }">
        Back to logbooks
      </nuxt-link>
    </LayoutPageHeader>

    <Card class="mb-6 bg-yellow-50">
      <h2 class="text-lg font-medium mb-2">My progress</h2>
      <div class="border border-dashed border-gray-200 min-h-48">
        <ProgressChart
          v-if="entries.length > 1"
          :entries="entries"
          @selected="chartClicked"
        />
      </div>
    </Card>

    <Card class="mb-6">
      <div class="flex space-x-4 mb-2">
        <h2 class="text-lg font-medium self-end mr-auto">Recent entries</h2>
        <nuxt-link
          class="button button-outline"
          :to="logbook.getNewEntryRoute()"
        >
          Add entry
        </nuxt-link>
      </div>

      <div v-for="entry in entries" :key="entry.primary">
        <nuxt-link :to="entry.getRoute()">
          {{ new Date(entry.timestamp).toDateString() }}
        </nuxt-link>
      </div>
    </Card>

    <div class="flex justify-end">
      <nuxt-link class="button" :to="logbook.getNewEntryRoute()"
        >Add entry</nuxt-link
      >
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
    const db = await this.$db

    // Get logbook record from database.
    this.logbook = await db.logbooks.findOne(logbookId).exec()

    // Get logbook entry records.
    this.entries = await db.entries
      .find()
      .where({ logbook: logbookId })
      .sort('timestamp')
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

  methods: {
    chartClicked(timestamp) {
      this.$router.push({
        name: 'logbooks-logbookId-entries-entryId',
        params: {
          logbookId: this.logbook.primary,
          entryId: timestamp,
        },
      })
    },
  },
}
</script>
