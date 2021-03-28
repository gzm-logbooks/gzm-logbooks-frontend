<template>
  <LayoutPage>
    <template #title>Add a new logbook</template>

    <Card class="p-6 m-4">
      <FormLogbook @submit="save" />
    </Card>

    <button class="btn" @click="$formulate.submit('logbook')">
      Create logbook
    </button>
  </LayoutPage>
</template>

<script>
export default {
  methods: {
    async save(fields) {
      // Create document in db.
      const doc = await this.$db.logbooks.insert(fields)
      // .catch(error) => console.log(error))

      if (doc) {
        // Redirect to logbook page.
        const logbookId = doc.primary

        return this.$router.push({
          name: 'logbooks-logbookId',
          params: { logbookId },
        })
      }
    },
  },
}
</script>
