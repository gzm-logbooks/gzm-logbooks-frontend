<template>
  <LayoutPage>
    <template #title>
      <h1>View logbook: {{ $get(logbook, 'name') }}</h1>
    </template>

    <div v-if="!$fetchState.pending">
      <div class="p-3">{{ JSON.stringify(logbook) }}</div>

      <nuxt-link
        :to="{ name: 'logbooks-logbookId-entry-new', params: { logbookId } }"
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
    const { route, redirect, $db } = this.$nuxt.context
    const { logbookId } = route.params

    // Get logbook record from database.
    const logbook = await $db.logbooks.findOne(logbookId).exec()

    // Redirect if logbook is missing.
    if (!logbook) {
      return redirect('/logbooks')
    }

    //
    this.logbook = logbook
  },

  computed: {
    logbookId() {
      return this.logbook.primary
    },
  },
}
</script>
