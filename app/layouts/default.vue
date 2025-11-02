<template>
  <ClientOnly>
    <Head>
      <!-- <Script type="text/css" children="body { background-color: green; }" /> -->
    </Head>

    <div class="flex flex-col grow">
      <LayoutHeader />

      <LayoutContainer max="lg" class="my-4 px-2">
        <DemoWarning />
      </LayoutContainer>

      <NuxtErrorBoundary @error="logError">
        <slot class="px-4" v-if="isReady" />
      </NuxtErrorBoundary>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useConfigStore } from '~/store/config'
import { useDatabase } from '~/store/database'

const { currentTheme } = storeToRefs(useConfigStore())

useHead({
  bodyAttrs: {
    'data-theme': currentTheme,
  },
})

function logError(error: Error) {
  const { message, stack, cause } = error

  console.error(error, { message, stack, cause })

  // throw error
}

const { isReady } = storeToRefs(useDatabase())
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
