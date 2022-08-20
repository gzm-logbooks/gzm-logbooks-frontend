<template>
  <ClientOnly>
    <Head>
      <Script type="text/css" children="body { background-color: green; }" />
    </Head>

    <div class="flex flex-col grow" :data-theme="themeName">
      <LayoutHeader />

      <LayoutContainer max="lg" class="my-4 px-2">
        <DemoWarning />
      </LayoutContainer>

      <NuxtErrorBoundary @error="logError">
        <slot v-if="db" class="px-4" />
      </NuxtErrorBoundary>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
</script>

<script lang="ts">
import { useDatabase } from '@/store/database'
useHead({
  script: [
    {
      body: 'window.global = window;'
    }
  ]
})

export default {
  computed: {
    themeName () {
      return localStorage.currentTheme
    },
    db: () => useDatabase().rxdb
  },
  mounted () {
    // Print routes for debug.
    // console.log('Routes...', this.$nuxt.context.app.router.getRoutes())
  },
  methods: {
    logError: error => console.error(error)
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
