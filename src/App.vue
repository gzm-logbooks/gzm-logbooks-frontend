<template>
  <ion-app>
    <Suspense>
      <template #default>
        <ion-router-outlet />
      </template>

      <template #fallback>
        <span>Loading&hellip;</span>
      </template>
    </Suspense>
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
})
</script>
