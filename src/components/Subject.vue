<template>
  {{ subject?.name }}
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { defineComponent } from 'vue'
import { useObservable } from '@vueuse/rxjs'
import { useRouter } from 'vue-router'

import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },

  async setup() {
    //
    const router = useRouter()

    //
    const db = await getDatabase()

    // Get subjects query as observable.
    //const subject = useObservable(db.subjects.get$.$)

    return {
      router,
      subject: {},
    }
  },
})
</script>
