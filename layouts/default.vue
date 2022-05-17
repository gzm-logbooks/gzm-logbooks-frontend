<template>
  <ClientOnly>
    <div class="flex flex-col grow" :data-theme="themeName">
      <LayoutHeader />

      <LayoutContainer max="lg" class="my-4">
        <DemoWarning />
      </LayoutContainer>

      <NuxtErrorBoundary @error="(error) => console.error(error)">
        <Nuxt class="px-4" />
      </NuxtErrorBoundary>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  mounted() {
    // Print routes for debug.
    // console.log('Routes...', this.$nuxt.context.app.router.getRoutes())
  },

  computed: {
    themeName() {
      return localStorage.currentTheme
    },
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
