<template>
  <ClientOnly>
    <div class="flex flex-col grow" :data-theme="themeName">
      <LayoutHeader />

      <LayoutContainer max="lg" class="my-4">
        <DemoWarning />
      </LayoutContainer>

      <NuxtErrorBoundary @error="logError">
        <slot class="px-4" v-if="db" />
      </NuxtErrorBoundary>
    </div>
  </ClientOnly>
</template>

<script lang="ts">
import { useDatabase } from '@/store/database';


export default {
  computed: {
    themeName() {
      return localStorage.currentTheme
    },
    db:() => useDatabase().rxdb
  },
  mounted() {
    // Print routes for debug.
    // console.log('Routes...', this.$nuxt.context.app.router.getRoutes())
  },
  methods: {
    logError: (error) => console.error(error)
  }
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
