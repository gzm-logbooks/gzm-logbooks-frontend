<template>
  <div class="text-gray-800 border-b border-gray-200 card">
    <LayoutContainer class="flex">
      <div
        class="flex flex-wrap items-center flex-1 py-3  sm:flex-nowrap sm:h-16 sm:py-0"
      >
        <div class="text-lg text-center md:text-xl">
          <nuxt-link to="/" class="font-bold"> growth-app </nuxt-link>
        </div>

        <div class="flex-1 flex-grow order-first">
          <div>
            <button
              v-if="canGoBack"
              class="button button--outline"
              @click="$router.back()"
            >
              Back
            </button>
          </div>
        </div>

        <div class="flex-1 flex-grow order-last">
          <div class="ml-auto d-flex">
            <button class="btn btn-warning" @click="resetDatabase()">
              Reset
            </button>
          </div>
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
    resetDatabase,
  },
}
</script>
