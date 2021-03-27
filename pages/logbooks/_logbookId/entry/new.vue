<template>
  <LayoutPage>
    <template #title>
      <h1>Add a new entry</h1>
    </template>

    <div class="mb-4">
      <span class="text-xl italic">How did things go today?</span>
    </div>

    <CircleInput v-model="rag" class="mb-4" />

    <FormEntry v-model="fields" @submit="save" />

    <button class="btn" @click="$formulate.submit('entry')">Add entry</button>
  </LayoutPage>
</template>

<script>
export default {
  data() {
    return {
      fields: {},
      rag: {},
      logbook: {},
    }
  },
  async fetch() {
    this.logbook = await this.$db.logbooks
      .findOne(this.$nuxt.context.route.params.logbooks)
      .exec()

    if (!this.logbook) {
      // TODO: Handle error.
      throw new Error('Logbook does not exist')
    }
  },
  methods: {
    async save(fields) {
      const { rag, logbook } = this
      console.log(fields)

      //
      const amounts = (rag) => {
        return {
          amountRed: rag.red,
          amountAmber: rag.amber,
          amountGreen: rag.green,
        }
      }

      // Build document data.
      const data = {
        ...fields,
        ...amounts(rag),
        timestamp: new Date(fields.timestamp).toISOString(),
        logbook: logbook.primary,
      }

      // Create document in db.
      const doc = await this.$db.entries
        .insert(data)
        .catch((error) => console.log(error))

      if (doc) {
        // Redirect to logbook page.
        const logbookId = this.logbook.primary

        this.$router.push({
          name: 'logbooks-logbookId',
          params: { logbookId },
        })
      }
    },
  },
}
</script>
