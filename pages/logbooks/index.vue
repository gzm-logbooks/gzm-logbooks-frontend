<template>
  <LayoutPage v-if="!$fetchState.pending">
    <LayoutPageHeader>
      <template #title>
        <h1>Logbooks</h1>
      </template>
    </LayoutPageHeader>

    <Card class="mb-4">
      <template #title>
        <div class="flex gap-1 ml-auto">
          <nuxt-link class="btn btn-outline" to="/logbooks/new">Create blank logbook</nuxt-link>
          <button class="btn" disabled>Add logbook from web</button>
          <button class="btn" @click="$seed">Generate demo logbook</button>

        </div>
      </template>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <LogbookItem
          v-for="logbook in logbooks"
          :key="logbook.primary"
          :primary="logbook.primary"
        />

        <Card class="rounded-lg">
          <nuxt-link
            class="flex-1 button button--center button--outline"
            to="/logbooks/new"
            >Add Logbook</nuxt-link
          >
        </Card>
      </div>
    </Card>
  </LayoutPage>
</template>

<script lang="javascript">
export default {
  data() {
    return {
      logbooks: [],
    }
  },

  async fetch() {
    const db = await this.$db

    const logbooksQuery = db.logbooks.find()

    this.$subscribeTo(logbooksQuery.$, (logbooks) => (this.logbooks = logbooks))
  },
}
</script>
