<template>
  <div class="bg-gray-50 flex-grow">
    <Header />

    <div class="sm:max-w-xl mx-auto sm:my-6">
      <div class="p-6 bg-white sm:rounded border border-indigo-200 shadow-sm">
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
