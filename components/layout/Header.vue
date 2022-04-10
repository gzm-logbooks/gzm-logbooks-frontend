<template>
  <div class="text-gray-800 border-b border-base-200 bg-base-100">
    <LayoutContainer class="flex">
      <div
        class="flex flex-wrap items-center flex-1 py-3 sm:flex-nowrap sm:h-16 sm:py-0"
      >
        <!-- Title -->
        <div class="text-lg text-center md:text-xl">
          <nuxt-link to="/" class="font-bold text-base-content"> {{ $config.title }} </nuxt-link>
        </div>

        <!-- Left buttons -->
        <div class="flex-1 order-first grow">
          <div>
            <button
              v-if="canGoBack"
              class="btn btn-outline"
              @click="$router.back()"
            >
              Back
            </button>
          </div>
        </div>

        <!-- Right buttons -->
        <div class="flex justify-end flex-1 order-last gap-2 grow">
          <a href="https://forms.gle/8LsDP9BTpcNFk9nZ9" target="_blank">
            <button class="gap-2 btn">
              Feedback Form
              <span>📝</span>
            </button></a
          >

          <button class="gap-2 btn btn-warning" @click="resetDatabase()">
            Reset data
            <span>🔥</span>
          </button>

          <nuxt-link class="btn btn-outline" to="/settings">
            Settings
          </nuxt-link>
        </div>
      </div>

      <div class="flex max-w-xl mx-auto md:max-w-4xl xl:max-w-6xl"></div>
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
