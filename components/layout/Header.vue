<template>
  <div class="text-gray-800 border-b border-base-200 bg-base-100">
    <LayoutContainer class="flex flex-col gap-1">
      <div class="flex-wrap navbar md:flex-nowrap">
        <!-- Title -->
        <div
          class="flex flex-col w-full text-center text-base-content navbar-center md:w-auto"
        >
          <nuxt-link to="/" class="text-lg font-bold md:text-">
            {{ title }}
          </nuxt-link>

          <span class="text-sm">{{ buildName }}</span>
        </div>

        <!-- Left buttons -->
        <div class="gap-2 md:order-first navbar-start">
          <button
            v-if="canGoBack"
            class="btn btn-outline"
            @click="$router.back()"
          >
            Back
          </button>

          <a
            href="https://forms.gle/8LsDP9BTpcNFk9nZ9"
            target="_blank"
            class="hidden gap-2 md:flex btn btn-info"
          >
            Feedback Form
            <span>📝</span>
          </a>
        </div>

        <!-- Right buttons -->
        <div class="justify-end gap-2 md:order-last navbar-end">
          <button
            class="hidden gap-2 btn btn-warning md:flex"
            @click="resetDatabase()"
          >
            Reset data
            <span>🔥</span>
          </button>

          <nuxt-link class="btn btn-outline" to="/settings">
            Settings
          </nuxt-link>
        </div>

        <!-- -->
        <div class="justify-center gap-2 navbar-center md:hidden">
          <a
            href="https://forms.gle/8LsDP9BTpcNFk9nZ9"
            target="_blank"
            class="gap-2 btn btn-info"
          >
            Feedback Form
            <span>📝</span>
          </a>

          <button class="gap-2 btn btn-warning" @click="resetDatabase()">
            Reset data
            <span>🔥</span>
          </button>
        </div>
      </div>

    </LayoutContainer>
  </div>
</template>

<script>
import { resetDatabase } from '~/data/database'

export default {
  data() {
    const { siteTitle: title, appInfo } = this.$config
    const { buildName } = appInfo

    return {
      title,
      buildName,
    }
  },

  computed: {
    canGoBack() {
      return window.history?.length > 2
    },
  },

  methods: {
    async resetDatabase() {
      try {
        await resetDatabase()
      } finally {
        window.location.reload(true)
      }
    },
  },
}
</script>
