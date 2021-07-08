<template>
  <LayoutPage v-if="!$fetchState.pending">
    <Card class="bg-gray-50">
      <template #top>
        <div class="card__section bg-gray-50">
          <div class="flex items-start gap-2 ml-auto h-16 -mb-16 z-20">
            <template v-if="edit">
              <button
                class="button button--primary bg-yellow-200"
                @click="reset"
              >
                Cancel
                <span class="button__icon"></span>
              </button>

              <button
                class="button button--primary bg-green-200"
                @click="$formulate.submit('logbook')"
              >
                Save
                <span class="button__icon">💾</span>
              </button>
            </template>
            <template v-else>
              <button class="button button--outline" @click="edit = true">
                Rename
                <span class="button__icon">✏️</span>
              </button>
            </template>
          </div>

          <LayoutPageHeader>
            <template #title>
              <h1>{{ $get(logbook, 'name') }}</h1>
            </template>

            <nuxt-link class="link" :to="{ name: 'logbooks' }">
              Back to logbooks
            </nuxt-link>
          </LayoutPageHeader>

          <FormulateForm
            v-if="edit"
            v-model="fields"
            name="logbook"
            @submit="save"
          >
            <FormLogbookFields />
          </FormulateForm>
        </div>
      </template>

      <Card class="mb-6 bg-white">
        <!-- <template #title>
          <h3>My progress</h3>
        </template> -->

        <div class="min-h-48">
          <ProgressChart
            v-if="entries.length > 1"
            :entries="entries"
            full
            @selected="chartClicked"
          />
        </div>
      </Card>

      <Card class="mb-6">
        <div class="flex space-x-4 mb-2">
          <h2 class="text-lg font-medium self-end mr-auto">Recent entries</h2>
          <nuxt-link
            class="button button--outline"
            :to="logbook.getNewEntryRoute()"
          >
            Add entry
          </nuxt-link>
        </div>

        <div v-for="entry in entries" :key="entry.primary">
          <nuxt-link :to="entry.getRoute()">
            {{ new Date(entry.timestamp).toDateString() }}
          </nuxt-link>
        </div>
      </Card>

      <div class="flex justify-end">
        <nuxt-link class="button" :to="logbook.getNewEntryRoute()"
          >Add entry</nuxt-link
        >
      </div>
    </Card>

    <!-- -->
    <template v-if="!$fetchState.pending" #debug>
      <Card>
        <template #title>Saved data</template>
        <pre>{{ JSON.stringify(logbook, null, 2) }}</pre>
      </Card>
    </template>
  </LayoutPage>
</template>

<script>
export default {
  data() {
    return {
      logbook: null,
      edit: false,
      fields: {},
    }
  },

  async fetch() {
    const { logbookId } = this.$route.params
    const db = await this.$db

    // Get logbook record from database.
    this.logbook = await db.logbooks.findOne(logbookId).exec()

    // Get logbook entry records.
    this.entries = await db.entries
      .find()
      .where({ logbook: logbookId })
      .sort('timestamp')
      .exec()

    // Redirect if logbook is missing.
    if (!this.logbook) {
      return this.$router.push({ name: 'logbooks' })
    }

    // Set form data.
    this.reset()
  },

  computed: {
    logbookId() {
      return this.logbook?.primary
    },
  },

  methods: {
    chartClicked(timestamp) {
      this.$router.push({
        name: 'logbooks-logbookId-entries-entryId',
        params: {
          logbookId: this.logbook.primary,
          entryId: timestamp,
        },
      })
    },

    async save(fields) {
      const data = {
        name: fields.name,
      }

      await this.logbook.atomicPatch(data)

      //
      this.$fetch()
    },

    reset() {
      const { name } = this.logbook
      console.log(this.logbook)

      this.fields = {
        name:  this.logbook.name
      }
      this.$fetch() // Dirty
      //
      this.edit = false
    },
  },
}
</script>
