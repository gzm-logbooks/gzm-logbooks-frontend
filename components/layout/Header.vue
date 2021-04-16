<template>
  <div class="bg-indigo-100 border-b border-indigo-200 text-indigo-800 px-6">
    <LayoutContainer class="flex">
      <div
        class="py-3 flex flex-1 items-center flex-wrap sm:flex-nowrap sm:h-16 sm:py-0"
      >
        <div
          class="mb-3 w-full sm:w-auto sm:m-0 text-lg md:text-xl text-center"
        >
          <nuxt-link to="/" class="font-bold"> growth-app </nuxt-link>
        </div>

        <div class="flex-grow sm:order-first">
          <div>
            <button
              v-if="canGoBack"
              class="button button-outline"
              @click="$router.back()"
            >
              Back
            </button>
          </div>
        </div>

        <div class="flex-grow sm:order-last"></div>
      </div>
      <div class="max-w-xl md:max-w-4xl xl:max-w-6xl mx-auto flex"></div>
    </LayoutContainer>
  </div>
</template>

<script>
export default {
  computed: {
    canGoBack() {
      return window.history?.length > 2
    },
  },
}
</script>
