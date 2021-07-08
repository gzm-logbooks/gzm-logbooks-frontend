<template>
  <LayoutPage>
    <LayoutPageHeader>
      <template #title>
        <h1>Add a new logbook</h1>
      </template>
    </LayoutPageHeader>

    <Card class="mb-4">
      <FormLogbook @submit="save" />

      <template #footer>
        <div class="flex gap-1 ml-auto">
          <button class="button" @click="$formulate.submit('logbook')">
            Create logbook
          </button>
        </div>
      </template>
    </Card>
  </LayoutPage>
</template>

<script>
export default {
  methods: {
    async save(fields) {
      const db = await this.$db

      // Create document in db.
      const doc = await db.logbooks.insert(fields)
      // .catch(error) => console.log(error))

      if (doc) {
        // Redirect to logbook page.
        return this.$router.push(doc.getRoute())
      }
    },
  },
}
</script>
