<template>
  <div class="flex flex-col grow">
    <LayoutHeader />

    <LayoutContainer max="lg" class="px-4 my-4">
      <DemoWarning />
    </LayoutContainer>

    <Nuxt class="px-4" />
  </div>
</template>

<script>
export default {
  mounted() {
    // Print routes for debug.
    // console.log('Routes...', this.$nuxt.context.app.router.getRoutes())
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
