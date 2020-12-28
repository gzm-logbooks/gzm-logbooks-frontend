<template>
  <ion-list>
    <ion-item
      v-for="entry in entries"
      :key="entry.primary"
      button
      :router-link="{
        name: 'entry-show',
        params: { entry: entry.primary },
      }"
    >
      <ion-label>{{ entry.timestamp }}</ion-label>
    </ion-item>
  </ion-list>
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
import { useRouter } from 'vue-router'
import { useObservable } from '@vueuse/rxjs'

import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {},
  data() {
    return {
      //subjects: [],
    }
  },
  async setup() {
    //
    const router = useRouter()

    //
    const db = await getDatabase()

    // Get subjects query as observable.
    const entries = useObservable(db.entries.find().$)

    return {
      router,
      entries,
    }
  },
  methods: {},
})
</script>