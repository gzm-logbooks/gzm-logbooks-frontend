<template>
  <LayoutPage v-if="!$fetchState.pending">
    <LayoutPageHeader>
      <template #title>
        <h1>Logbooks</h1>
      </template>

      <template #inline-actions></template>

      <template #main-actions>
        <button type="button" class="cursor-not-allowed btn" disabled>
          Add logbook from web
        </button>

        <nuxt-link class="btn btn-primary" to="/logbooks/new">
          Create blank logbook
        </nuxt-link>

        <button class="btn btn-info animate-bounce" @click="$seed">
          Generate demo logbook
        </button>
      </template>
    </LayoutPageHeader>

    <div class="flex justify-end gap-2 mb-4"></div>

    <Card class="mb-4 bg-base-200">
      <template #title> </template>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <LogbookItem
          v-for="logbook in logbooks"
          :key="logbook.primary"
          :primary="logbook.primary"
        />

        <Card>
          <nuxt-link class="flex-1 btn btn-outline" to="/logbooks/new">
            Add Logbook
          </nuxt-link>
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
