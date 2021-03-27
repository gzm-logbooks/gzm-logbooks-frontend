<template>
  <div>
    <h1 class="text-bold text-lg">this is the logbooks page ree</h1>

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

    <nuxt-link to="/logbooks/new">Add Logbook</nuxt-link>
  </div>
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
