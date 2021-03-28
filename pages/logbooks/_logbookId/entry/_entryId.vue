<template>
  <LayoutPage>
    <template #title>
      <h1>Update existing entry</h1>
    </template>

    <CircleInput />
  </LayoutPage>
</template>

<script>
export default {
  data() {
    return {
      entry: {},
      fields: {},
      logbook: {},
      rag: {},
    }
  },
  async fetch() {
    const { logbookId, entryId } = this.$route.params

    // Get logbook record from database.
    this.logbook = await this.$db.logbooks.findOne(logbookId).exec()

    // Get logbook entry record from database.
    this.entry = await this.$db.entry.findOne(entryId).exec()

    // Redirect if logbook is missing.
    if (!this.logbook) {
      this.$router.push({ name: 'logbooks' })
    }
  },
  methods: {
    async save(fields) {
      const { rag, logbook } = this

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
      const doc = await this.$db.entries.insert(data)
      // .catch((error) => console.log(error))

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
