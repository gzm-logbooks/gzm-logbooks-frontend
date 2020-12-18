<template>
  <ion-list>
    <ion-item
      v-for="subject in subjects"
      :key="subject.primary"
      button
      :router-link="{
        name: 'subject-show',
        params: { subject: subject.primary },
      }"
    >
      <ion-label>{{ subject.name }}</ion-label>
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
    const subjects = useObservable(db.subjects.find().$)

    return {
      router,
      subjects,
    }
  },
  methods: {},
})
</script>
