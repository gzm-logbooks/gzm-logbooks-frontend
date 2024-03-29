<template>
  <LayoutPage v-if="!$fetchState.pending || true">
    <LayoutPageHeader>
      <template #title>
        <h1>Update existing entry</h1>
      </template>

      <template #main-actions>
        <nuxt-link
          v-if="logbook"
          class="btn btn-outline"
          :to="logbook.getRoute()"
        >
          Back to logbook "{{ $get(logbook, 'name') }}"
        </nuxt-link>
      </template>
    </LayoutPageHeader>

    <!-- -->
    <div class="flex flex-col w-full mb-4 lg:flex-row">
      <Card class="w-full bg-base-200 grow shrink">
        <div class="flex justify-between mb-4">
          <h3 class="text-xl">{{ date }}</h3>

          <span>{{ dateRelative }}</span>
        </div>

        <FormulateForm v-model="fields" name="entry" @submit="save">
          <FormEntryFields />
        </FormulateForm>

        <div class="flex justify-end">
          <button class="btn btn-primary" @click="$formulate.submit('entry')">
            Update entry
          </button>
        </div>
      </Card>

      <div class="divider lg:divider-horizontal"></div>

      <GrowthAnalysis :mood="fields.mood" class="w-full max-w-sm" />
    </div>

    <!-- -->
    <template v-if="!$fetchState.pending" #debug>
      <Card>
        <template #title>Saved data</template>
        <pre>{{ JSON.stringify(entry, null, 2) }}</pre>
      </Card>
    </template>
  </LayoutPage>
</template>

<script>
import { format, formatDistance } from 'date-fns'

export default {
  data() {
    return {
      entry: {},
      fields: {},
      logbook: null,
    }
  },

  async fetch() {
    const { logbookId, entryId } = this.$route.params
    const db = await this.$db

    // Get entry record from database.
    this.entry = await db.entries
      .findOne({
        selector: { logbook: logbookId, _id: entryId },
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
    date() {
      const { timestamp } = this.entry

      if (timestamp) {
        return format(new Date(timestamp), 'yyyy-MM-dd')
      }

      return ''
    },
    dateRelative() {
      const { timestamp } = this.entry

      if (timestamp) {
        return formatDistance(new Date(timestamp), new Date(), {
          addSuffix: true,
        })
      }

      return ''
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
