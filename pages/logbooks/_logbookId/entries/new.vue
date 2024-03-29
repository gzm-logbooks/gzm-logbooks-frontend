<template>
  <LayoutPage v-if="!$fetchState.pending">
    <LayoutPageHeader>
      <template #title>
        <h1>Add a new entry</h1>
      </template>

      <template #main-actions>
        <nuxt-link
          v-if="logbook"
          class="btn btn-outline"
          :to="logbook.getRoute()"
        >
          Back to logbook "{{ logbook.name }}"
        </nuxt-link>
      </template>
    </LayoutPageHeader>

    <!-- -->
    <div class="flex flex-col w-full mb-4 lg:flex-row">
      <Card class="w-full bg-base-200 grow shrink">
        <div class="flex justify-center mb-4">
          <span class="text-xl italic">How did things go today?</span>
        </div>

        <FormulateForm v-model="fields" name="entry" @submit="save">
          <FormEntryFields />
        </FormulateForm>

        <div class="flex justify-end">
          <button class="btn btn-primary" @click="$formulate.submit('entry')">
            Save entry
          </button>
        </div>
      </Card>

      <div class="divider lg:divider-horizontal"></div>

      <GrowthAnalysis :mood="fields.mood" class="w-full max-w-sm" />
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
