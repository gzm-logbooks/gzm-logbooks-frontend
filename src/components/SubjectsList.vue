<template>
  <ion-list>
    <ion-item v-for="subject in subjects" :key="subject.primary">
      <ion-label button @click="select(subject)">{{ subject.name }}</ion-label>
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
import { Subject } from 'rxjs'
import { map, startWith, scan, pluck, combineLatest } from 'rxjs/operators'

import { getDatabase } from '@/services/DatabaseService'

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
  methods: {
    select(subject) {
      this.router.push({
        name: 'subject',
        params: { subject: subject.primary },
      })
    },
  },
})
</script>
