<template>
  <nuxt-link :to="route">
    <Card class="mb-4" content-class="p-2">
      <span class="text-lg font-medium">{{ $get(logbook, 'name') }}</span>
      <p class="text-sm mb-1 text-gray-600">{} entries</p>
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
      countEntries: null,
      lastEntry: null,
    }
  },
  async fetch() {
    // Get logbook record from database.
    this.logbook = await this.$db.logbooks.findOne(this.primary).exec()
    console.log(this.logbook)
  },
  computed: {
    route() {
      return this.logbook?.getRoute() || {}
    },
  },
}
</script>
