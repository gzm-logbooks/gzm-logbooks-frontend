<template>
  <LayoutPage v-if="!$fetchState.pending">
    <LayoutPageHeader>
      <template #title>
        <h1>Logbooks</h1>
      </template>
    </LayoutPageHeader>

    <Card class="mb-4">
      <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <LogbookItem
          v-for="logbook in logbooks"
          :key="logbook.primary"
          :primary="logbook.primary"
        />
      </div>
    </Card>

    <div class="flex justify-end">
      <nuxt-link class="button" to="/logbooks/new">Add Logbook</nuxt-link>
    </div>
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
    this.logbooks = await this.$db.logbooks.find().exec()
  },
}
</script>
