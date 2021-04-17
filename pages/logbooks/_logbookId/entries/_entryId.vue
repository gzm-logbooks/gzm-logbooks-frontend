<template>
  <LayoutPage v-if="!$fetchState.pending">
    <LayoutPageHeader>
      <template #title>
        <h1>Update existing entry</h1>
      </template>

      <nuxt-link class="link" :to="logbook.getRoute()">
        Back to logbook "{{ logbook.name }}"
      </nuxt-link>
    </LayoutPageHeader>

    <Card class="mb-4">
      <FormulateForm v-model="fields" name="entry" @submit="save">
        <FormEntryFields />
      </FormulateForm>
    </Card>

    <div class="flex justify-end">
      <button class="button" @click="$formulate.submit('entry')">Save</button>
    </div>
  </LayoutPage>
</template>

<script>
import { format } from 'date-fns'

export default {
  data() {
    return {
      entry: {},
      fields: {},
      logbook: {},
    }
  },

  async fetch() {
    const { logbookId, entryId } = this.$route.params

    // Get entry record from database.
    this.entry = await this.$db.entries
      .findOne({
        selector: { logbook: logbookId, timestamp: entryId },
      })
      .exec()

    // Get logbook record from database.
    this.logbook = await this.entry.populate('logbook')

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
      const {
        timestamp,
        comment,

        amountRed,
        amountAmber,
        amountGreen,
      } = this.entry

      //
      this.fields = {
        timestamp: format(new Date(timestamp), 'yyyy-MM-dd'),
        comment,
        mood: {
          amountRed,
          amountAmber,
          amountGreen,
        },
      }
    },

    async save(fields) {
      const { logbook } = this

      const { comment, mood } = fields

      // Build document data.
      const data = {
        ...mood,
        comment,
        timestamp: new Date(fields.timestamp).toISOString(),
        logbook: logbook.primary,
      }

      // Create document in db.
      const doc = await this.entry.atomicPatch(data)
      // .catch((error) => console.log(error))

      if (doc) {
        // Back to logbook page.
        return this.$router.push(this.logbook.getRoute())
      }
    },
  },
}
</script>