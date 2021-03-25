<template>
  <div class="bg-gray-50 flex-grow">
    <Header />

    <div class="sm:px-6">
      <div
        class="bg-white mx-auto p-6 sm:max-w-xl sm:my-6 border border-indigo-200 shadow-sm sm:rounded"
      >
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // Print routes for debug.
    console.log('Routes...', this.$nuxt.context.app.router.getRoutes())
  },
}
</script>

<style>
html,
body,
#__nuxt,
#__layout {
  height: 100%;
}

#__layout {
  display: flex;
  flex-direction: column;
}
</style>
