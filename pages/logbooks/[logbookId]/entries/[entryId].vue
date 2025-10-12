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
          :to="getLogbookRoute(logbook.getRouteParams())"
        >
          Back to logbook "{{ logbook.value.name }}"
        </nuxt-link>
      </template>
    </LayoutPageHeader>

    <!-- -->
    <div class="flex flex-col w-full mb-4 lg:flex-row">
      <Card class="w-full bg-base-200 grow shrink">
        <div class="flex justify-between mb-4">
          <h3 class="text-xl">
            {{ date }}
          </h3>

          <span>{{ dateRelative }}</span>
        </div>

        <FormKit v-model="fields" type="form" name="entry" @submit="save">
          <FormEntryFields />
        </FormKit>

        <div class="flex justify-end">
          <button class="btn btn-primary" @click="$formulate.submit('entry')">
            Update entry
          </button>
        </div>
      </Card>

      <div class="divider lg:divider-horizontal" />

      <GrowthAnalysis :mood="fields.mood" class="w-full max-w-sm" />
    </div>

    <!-- -->
    <template v-if="!$fetchState.pending" #debug>
      <Card>
        <template #title> Saved data </template>
        <pre>{{ JSON.stringify(entry, null, 2) }}</pre>
      </Card>
    </template>
  </LayoutPage>
</template>

<script lang="ts">
import { format, formatDistance } from 'date-fns'
import { useDatabase } from '~/store/database'
import { useAppRoutes } from '../../../../composables/useAppRoutes'

export default {
  async setup() {
    const { params } = useRoute()
    const { logbookId, entryId } = params as {
      logbookId: string
      entryId: string
    }

    const { getLogbookRoute } = useAppRoutes()

    const { userData } = storeToRefs(useDatabase())

    // Get entry record from database.
    const entry = await userData.value.entries
      .findOne({
        selector: { logbook: logbookId, _id: entryId },
      })
      .exec()

    // Get logbook record from database.
    const logbook = await entry.populate('logbook')

    // Redirect if logbook is missing.
    if (!logbook || !entry) {
      return navigateTo({ name: 'logbooks' })
    }

    return {
      logbook,
      entry,
    }
  },
  data() {
    return {
      entry: {},
      fields: {},
      logbook: null,
    }
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

  beforeMount() {
    // Set form data.
    this.reset()
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
        return navigateTo(getLogbookRoute(this.logbook.getRouteParams()))
      }
    },
  },
}
</script>
