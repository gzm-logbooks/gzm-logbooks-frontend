<template>
  <nuxt-link :to="route">
    <Card class="mb-4 p-2">
      <span class="text-lg font-medium">{{ logbook.name }}</span>
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
      logbook: {},
      countEntries: null,
      lastEntry: null,
    }
  },
  async fetch() {
    // Get logbook record from database.
    this.logbook = await this.$db.logbooks.findOne(this.primary).exec()
  },
  computed: {
    route() {
      return { name: 'logbooks-logbookId', params: { logbookId: this.primary } }
    },
  },
}
</script>
