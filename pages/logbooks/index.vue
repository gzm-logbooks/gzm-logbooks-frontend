<template>
  <LayoutPage>
    <template #title><h1>Logbooks</h1></template>

    <ul>
      <li v-for="logbook in logbooks" :key="logbook.primary">
        <nuxt-link
          :to="{
            name: 'logbooks-logbookId',
            params: { logbookId: logbook.primary },
          }"
          >{{ logbook.name }}</nuxt-link
        >
      </li>
    </ul>

    <nuxt-link class="btn" to="/logbooks/new">Add Logbook</nuxt-link>
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
