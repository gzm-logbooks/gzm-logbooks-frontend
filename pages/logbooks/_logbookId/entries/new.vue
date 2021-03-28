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
import { circleInputModelToEntryAmounts } from '~/data/utils'

export default {
  data() {
    return {
      fields: {},
      logbook: {},
      rag: {},
    }
  },

  async fetch() {
    const { logbookId } = this.$route.params

    // Get logbook record from database.
    this.logbook = await this.$db.logbooks.findOne(logbookId).exec()

    // Redirect if logbook is missing.
    if (!this.logbook) {
      return this.$router.push({ name: 'logbooks' })
    }
  },

  methods: {
    async save(fields) {
      const { rag, logbook } = this

      // Build document data.
      const data = {
        ...fields,
        ...circleInputModelToEntryAmounts(rag),
        timestamp: new Date(fields.timestamp).toISOString(),
        logbook: logbook.primary,
      }

      // Create document in db.
      const doc = await this.$db.entries.insert(data)
      // .catch((error) => console.log(error))

      if (doc) {
        // Redirect to logbook page.
        const logbookId = this.logbook.primary

        return this.$router.push({
          name: 'logbooks-logbookId',
          params: { logbookId },
        })
      }
    },
  },
}
</script>
