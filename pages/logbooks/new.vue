<template>
  <LayoutPage>
    <template #title>
      <h1>Add a new logbook</h1>
    </template>

    <Card class="m-4">
      <template #title>Logbook details</template>

      <FormLogbook @submit="save" />
    </Card>

    <button class="button" @click="$formulate.submit('logbook')">
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
