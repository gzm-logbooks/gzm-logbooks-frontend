<template>
  <LayoutPage v-if="!$fetchState.pending">
    <Card class="bg-gray-50">
      <template #top>
        <div class="card-body bg-gray-50">
          <div class="z-20 flex items-start h-16 gap-2 ml-auto -mb-16">
            <template v-if="edit">
              <button
                class="bg-yellow-200 button button--primary"
                @click="reset"
              >
                Cancel
                <span class="btn__icon"></span>
              </button>

              <button
                class="bg-green-200 button button--primary"
                @click="$formulate.submit('logbook')"
              >
                Save
                <span class="btn__icon">💾</span>
              </button>
            </template>
            <template v-else>
              <button class="btn btn-outline" @click="edit = true">
                Rename
                <span class="btn__icon">✏️</span>
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
        <div class="flex mb-2 space-x-4">
          <h2 class="self-end mr-auto text-lg font-medium">Recent entries</h2>
          <nuxt-link
            class="btn btn-outline"
            :to="logbook.getNewEntryRoute()"
          >
            Add entry
          </nuxt-link>
        </div>

        <!-- Logbook entries feed -->
        <div class="space-y-1 entries">
          <h3 class="pt-4 text-lg font-medium">This week</h3>

          <!-- Most recent entry -->
          <nuxt-link
            :to="lastEntry.getRoute()"
            class="grid items-end grid-cols-3 entries__entry"
          >
            <span class="mr-auto text-lg font-medium">
              {{ recentDateFormatter.format(new Date(lastEntry.timestamp)) }}
            </span>

            <CircleSemi
              class="col-span-2 col-start-2 entry__slice"
              :state="{
                red: lastEntry.amountRed,
                amber: lastEntry.amountAmber,
                green: lastEntry.amountGreen,
              }"
            />
          </nuxt-link>

          <!-- Last week's entries -->
          <nuxt-link
            v-for="entry in lastWeekEntries"
            :key="entry.primary"
            :to="entry.getRoute()"
            class="grid items-end content-end grid-cols-3 entries__entry"
          >
            <span>
              {{ recentDateFormatter.format(new Date(entry.timestamp)) }}
            </span>

            <CircleStrip
              style="height: 60px"
              class="col-span-2 col-start-2 entry__slice"
              :state="{
                red: entry.amountRed,
                amber: entry.amountAmber,
                green: entry.amountGreen,
              }"
            />
          </nuxt-link>

          <!-- Older entries -->
          <h3 class="pt-4 text-lg font-medium">Older</h3>

          <nuxt-link
            v-for="entry in olderEntries"
            :key="entry.primary"
            :to="entry.getRoute()"
            class="grid items-center grid-cols-3 entries__entry"
          >
            <span>
              {{ olderDateFormatter.format(new Date(entry.timestamp)) }}
            </span>

            <CircleStrip
              style="height: 30px"
              class="col-span-2 col-start-2 entry__slice"
              :state="{
                red: entry.amountRed,
                amber: entry.amountAmber,
                green: entry.amountGreen,
              }"
            />
          </nuxt-link>
        </div>
      </Card>

      <div class="flex justify-end">
        <nuxt-link class="btn" :to="logbook.getNewEntryRoute()"
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

    // Get all entries.
    this.entries = await db.entries
      .find()
      .where({ logbook: logbookId })
      .sort({ timestamp: 'desc' })
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

    // Slices of logbook entries...
    lastEntry() {
      // Get last logbook entry.
      return this.entries[0]
    },

    lastWeekEntries() {
      // Get last weeks records.
      return this.entries
        .slice(1)
        .filter(
          (entry) =>
            Date.now() - 7 * 24 * 60 * 60 * 1000 < new Date(entry.timestamp)
        )
    },

    olderEntries() {
      // Get other records.
      return this.entries
        .slice(1)
        .filter(
          (entry) =>
            Date.now() - 7 * 24 * 60 * 60 * 1000 > new Date(entry.timestamp)
        )
    },

    // Setup date formatters...
    recentDateFormatter: () =>
      new Intl.DateTimeFormat('default', {
        weekday: 'long',
        month: '2-digit',
        day: '2-digit',
      }),

    olderDateFormatter: () =>
      new Intl.DateTimeFormat('default', {
        month: '2-digit',
        day: '2-digit',
      }),
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
        name: this.logbook.name,
      }
      this.$fetch() // Dirty
      //
      this.edit = false
    },
  },
}
</script>

<style scoped>
.entries__entry {
  transition: 0.5s;
  transition-property: opacity;
}

.entries:hover .entry__slice {
  opacity: 0.5;
}

.entries__entry:hover .entry__slice {
  opacity: 1;
}
</style>
