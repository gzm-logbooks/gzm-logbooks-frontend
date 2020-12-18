<template>
  <Suspense>
    <template #default>
      <ion-router-outlet />
    </template>
  </Suspense>
</template>

<script>
import { IonRouterOutlet } from '@ionic/vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    IonRouterOutlet,
  },
})
</script>
