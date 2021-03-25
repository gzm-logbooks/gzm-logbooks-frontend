<template>
  <div class="bg-gray-200">
    <Header />

    <div class="max-w-xl">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // Print routes for debug.
    console.log('Routes...', this.$nuxt.context.app.router.getRoutes())
  }
}
</script>
