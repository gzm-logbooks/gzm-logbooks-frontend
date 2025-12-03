<template>
  <LayoutPage v-if="status !== 'pending'">
    <LayoutPageHeader>
      <template #title>
        <div class="flex items-center gap-2">
          <FormKit v-if="edit" v-model="fields" name="logbook" @submit="save">
            <FormLogbookFields />
          </FormKit>

          <h1 v-else>
            {{ logbook.name }}
          </h1>
        </div>
      </template>

      <template #inline-actions>
        <!-- Rename -->
        <template>
          <template v-if="edit">
            <button class="gap-2 btn btn-warning" @click="reset">Cancel</button>

            <button
              class="gap-2 btn btn-success"
              @click="$formulate.submit('logbook')"
            >
              Save
              <span>💾</span>
            </button>
          </template>

          <template v-else>
            <button class="gap-2 btn" @click="edit = true">
              Rename
              <span>✏️</span>
            </button>
          </template>
        </template>
      </template>

      <template #main-actions>
        <nuxt-link class="btn btn-primary" :to="logbook.getCreateEntryRoute()">
          Add entry
        </nuxt-link>

        <nuxt-link class="btn btn-outline" :to="{ name: 'logbooks' }">
          Back to logbooks
        </nuxt-link>

        <button class="gap-2 btn btn-success" @click="downloadLogbook">
          Download
          <span>💾</span>
        </button>
      </template>
    </LayoutPageHeader>

    {{ status }}

    <template v-if="entries?.length === 0">
      <p>There are no entries in this logbook.</p>
    </template>

    <template v-else>
      <Card class="mb-6 bg-base-200">
        <!-- <template #title>
        <h3>My progress</h3>
      </template> -->

        <div class="min-h-48">
          <ProgressChart
            v-if="entries?.length > 1"
            :entries="entries"
            full
            @selected="chartClicked"
          />
        </div>
      </Card>

      <Card class="mb-6 bg-base-200">
        <div class="flex mb-2 space-x-4">
          <h2 class="self-end mr-auto text-lg font-medium">Recent entries</h2>
          <nuxt-link
            class="btn btn-primary"
            :to="logbook.getCreateEntryRoute()"
          >
            Add entry
          </nuxt-link>
        </div>

        <!-- Logbook entries feed -->
        <div class="space-y-1 entries">
          <!-- <h3 class="pt-4 text-lg font-medium">This week</h3> -->

          <!-- Most recent entry -->
          <nuxt-link
            v-if="lastEntry"
            :to="getLogbookEntryRoute(lastentry.getRouteParams())"
            class="grid items-end grid-cols-3 entries__entry"
          >
            <span class="mr-auto text-lg font-medium">
              {{ recentDateFormatter.format(new Date(lastEntry.timestamp)) }}
            </span>

            <CircleSemi
              class="col-span-2 col-start-2 entry__slice"
              :state="{
                anxiety: lastEntry.amountAnxiety,
                growth: lastEntry.amountGrowth,
                comfort: lastEntry.amountComfort,
              }"
            />
          </nuxt-link>

          <!-- Last week's entries -->
          <nuxt-link
            v-for="entry in lastWeekEntries"
            :key="entry.primary"
            :to="getLogbookEntryRoute(entry.getRouteParams())"
            class="grid items-end content-end grid-cols-3 entries__entry"
          >
            <span>
              {{ recentDateFormatter.format(new Date(entry.timestamp)) }}
            </span>

            <CircleStrip
              style="height: 60px"
              class="col-span-2 col-start-2 entry__slice"
              :state="{
                anxiety: entry.amountAnxiety,
                growth: entry.amountGrowth,
                comfort: entry.amountComfort,
              }"
            />
          </nuxt-link>

          <!-- Older entries -->
          <!-- <h3 class="pt-4 text-lg font-medium">Older</h3> -->

          <nuxt-link
            v-for="entry in olderEntries"
            :key="entry.primary"
            :to="getLogbookEntryRoute(entry.getRouteParams())"
            class="grid items-center grid-cols-3 entries__entry"
          >
            <span>
              {{ olderDateFormatter.format(new Date(entry.timestamp)) }}
            </span>

            <CircleStrip
              style="height: 30px"
              class="col-span-2 col-start-2 entry__slice"
              :state="{
                anxiety: entry.amountAnxiety,
                growth: entry.amountGrowth,
                comfort: entry.amountComfort,
              }"
            />
          </nuxt-link>
        </div>
      </Card>
    </template>

    <!-- -->
    <template v-if="status !== 'pending'" #debug>
      <Card>
        <template #title> Saved data </template>
        <pre>{{ JSON.stringify(logbook, null, 2) }}</pre>
      </Card>
    </template>
  </LayoutPage>
</template>

<script lang="ts" setup>
import { useLogbookStore } from '~/store/logbooks'

const { getLogbookRoute, getLogbookEntryRoute, getLogbookCreateEntryRoute } =
  useAppRoutes()

const { params } = useRoute()
const { logbookId } = params as { logbookId: string }



// const { data, error, status } = await useAsyncData(async () => {
//   return {
//     logbook: db.logbooks.findOne(logbookId).exec(),
//     entries: db.entries
//       .find()
//       .where({ logbook: logbookId })
//       .sort({ timestamp: 'desc' })
//       .exec(),
//   }
// })

const logbookStore = useLogbookStore(logbookId)

console.log(logbookStore)

const { logbook, entries, lastEntry, lastWeekEntries, olderEntries } = storeToRefs(logbookStore)

const _recentDateFormatter = () =>
  new Intl.DateTimeFormat('default', {
    weekday: 'long',
    month: '2-digit',
    day: '2-digit',
  })

const _olderDateFormatter = () =>
  new Intl.DateTimeFormat('default', {
    month: '2-digit',
    day: '2-digit',
  })

onMounted(async () => {
  // Redirect if logbook is missing.
  if (!logbook.value) {
    await navigateTo({ name: 'logbooks' })
  }

  // Set form data.
  reset()
})

function _chartClicked(timestamp) {
  navigateTo({
    name: 'logbooks-logbookId-entries-entryId',
    params: {
      // TODO
      logbookId: logbook.value.id,
      entryId: timestamp,
    },
  })
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
