<template>
  <LayoutPage>
    <template #title>
      <h1>Update existing entry</h1>
    </template>

    <CircleInput v-model="rag" class="mb-4" />

    <FormEntry :values="fields" @submit="save" />

    <div class="flex justify-between mt-6">
      <button class="button" @click="$formulate.submit('entry')">Save</button>
    </div>

    <!-- -->
    <template #debug>
      <Card>
        <template #title>Saved data</template>
        <pre>{{ JSON.stringify(entry, null, 2) }}</pre>
      </Card>
    </template>
  </LayoutPage>
</template>

<script>
import { format } from 'date-fns'
import {
  circleInputModelToEntryAmounts,
  entryAmountsToCircleInputModel,
} from '~/data/utils'

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
    this.entry = await this.$db.entries
      .findOne({
        selector: { logbook: logbookId, timestamp: entryId },
      })
      .exec()

    // Redirect if logbook is missing.
    if (!this.logbook || !this.entry) {
      return this.$router.push({ name: 'logbooks' })
    }

    // Set form data.
    this.reset()
  },

  computed: {
    loading() {
      return this.$fetchState?.pending
    },
  },

  methods: {
    reset() {
      const { timestamp, comment } = this.entry

      //
      this.rag = entryAmountsToCircleInputModel(this.entry)

      //
      this.fields = {
        timestamp: format(new Date(timestamp), 'yyyy-MM-dd'),
        comment,
      }
    },

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
      const doc = await this.entry.atomicPatch(data)
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
