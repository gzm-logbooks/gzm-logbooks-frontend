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
      <div class="flex justify-center mb-4">
        <span class="text-xl italic">How did things go today?</span>
      </div>

      <p class="text-3xl font-bold">{{ analysis.toFixed(2) }}</p>

      <p>{{ fields.mood }}</p>

      <FormulateForm v-model="fields" name="entry" @submit="save">
        <FormEntryFields />
      </FormulateForm>

      <template #footer>
        <div class="flex ml-auto">
          <button class="button" @click="$formulate.submit('entry')">
            Save entry
          </button>
        </div>
      </template>
    </Card>
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

  computed: {
    analysis() {
      const mood = this.fields?.mood

      if (!mood) {
        return 0
      }

      //
      const { amountRed, amountAmber, amountGreen } = mood ?? {
        amountRed: 0,
        amountAmber: 0,
        amountGreen: 0,
      }

      const ringRed = (amountRed - amountAmber - 0.05) / 0.8
      const ringAmber = (amountAmber - amountGreen - 0.05) / 0.8
      const ringGreen = (amountGreen - 0.1) / 0.8

      // const ringGreen = amountGreen - 0.14
      // const ringAmber = amountAmber - ringGreen
      // const ringRed = amountRed - amountAmber

      return (ringGreen - ringRed) / (ringAmber + 1)
    },

    scaleBand() {
      return this.analysis
    },
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
