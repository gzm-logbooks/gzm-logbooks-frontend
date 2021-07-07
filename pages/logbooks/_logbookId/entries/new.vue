<template>
  <LayoutPage v-if="!$fetchState.pending">
    <LayoutPageHeader>
      <template #title>
        <h1>Add a new entry</h1>
      </template>

      <nuxt-link class="link" :to="logbook.getRoute()">
        Back to logbook "{{ logbook.name }}"
      </nuxt-link>
    </LayoutPageHeader>

    <Card class="mb-4">
      <div class="mb-4 flex justify-center">
        <span class="text-xl italic">How did things go today?</span>
      </div>

      <FormulateForm v-model="fields" name="entry" @submit="save">
        <FormEntryFields />
      </FormulateForm>
    </Card>

    <div class="flex justify-end">
      <button class="button" @click="$formulate.submit('entry')">
        Add entry
      </button>
    </div>
  </LayoutPage>
</template>

<script>
import { format } from 'date-fns'

export default {
  data() {
    return {
      fields: {
        timestamp: format(new Date(), 'yyyy-MM-dd'),
      },
      logbook: {},
    }
  },

  async fetch() {
    const { logbookId } = this.$route.params
    const db = await this.$db

    // Get logbook record from database.
    this.logbook = await db.logbooks.findOne(logbookId).exec()

    // Redirect if logbook is missing.
    if (!this.logbook) {
      return this.$router.push({ name: 'logbooks' })
    }
  },

  methods: {
    async save(fields) {
      const { logbook } = this
      const db = await this.$db

      const { comment, mood } = fields

      // Build document data.
      const data = {
        ...mood,
        comment,
        timestamp: new Date(fields.timestamp).toISOString(),
        logbook: logbook.primary,
      }

      // Create document in db.
      const doc = await db.entries.insert(data)
      // .catch((error) => console.log(error))

      if (doc) {
        // Back to logbook.
        return this.$router.push(this.logbook.getRoute())
      }
    },
  },
}
</script>
