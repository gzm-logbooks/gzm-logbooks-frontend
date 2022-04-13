<template>
  <div class="text-gray-800 border-b border-base-200 bg-base-100">
    <LayoutContainer class="flex flex-col gap-1">
      <div class="flex max-w-xl mx-auto md:max-w-4xl xl:max-w-screen-xl"></div>

      <div class="navbar">
        <!-- Title -->
        <div class="text-center text-base-content navbar-center">
          <nuxt-link to="/" class="text-lg font-bold md:text-xl">
            {{ $config.title }}
          </nuxt-link>
        </div>

        <!-- Left buttons -->
        <div class="flex order-first gap-2 navbar-start">
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
        <div class="flex justify-end gap-2 navbar-end">
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
      </div>

      <div class="flex justify-center flex-1 order-last gap-2 grow">
      <div class="md:hidden">
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
      
      <a
          href="https://github.com/kauhat/gzm-logbooks-frontend/issues/new/choose"
          target="_blank"
          class="gap-2 btn btn-info"
        >
          Issue / Feature suggestion (Requires Github)
          <span>📝</span>
        </a>
      
      </div>
    </LayoutContainer>
  </div>
</template>

<script>
import { resetDatabase } from '~/data/database'

export default {
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
