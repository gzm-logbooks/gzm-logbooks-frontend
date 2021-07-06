<template>
  <nuxt-link :to="route">
    <Card class="mb-4" content-class="p-2">
      <span class="text-lg font-medium">{{ $get(logbook, 'name') }}</span>
      <p class="text-sm mb-1 text-gray-600"> entries</p>
    </Card>
  </nuxt-link>
</template>

<script>
import { from, count } from 'rxjs/operators'

export default {
  props: {
    primary: { type: String, required: true },
  },
  subscriptions() {
    const entries = (await this.$db).entries
      .find()
      .where({ logbook: this.primary })
      .sort().$

    return {
      entries2: entries,
      entries: entries.subscribe(e => e),
      // countEntries: from(entries).pipe(count()),
    }
  },
  data() {
    return {
      logbook: null,
      // countEntries: null,
      lastEntry: null,
    }
  },
  async fetch() {
    const logbookId = this.primary

    // Get logbook record from database.
    this.logbook = await this.$db.logbooks.findOne(logbookId).exec()

    //
    // this.countEntries = this.$db.entries
    //   .find()
    //   .where({ logbook: logbookId })
    //   .sort()
    //   .$.Count()
  },
  computed: {
    route() {
      return this.logbook?.getRoute() || {}
    },
    // countEntries() {
    //   return this.$observables.entries.pipe(count())
    //   // return count(this.$observables.entries)
    // },
  },
}
</script>
