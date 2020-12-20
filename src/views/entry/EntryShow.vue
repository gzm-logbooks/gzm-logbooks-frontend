<template>
  <base-view>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>{{ subject?.name }}</ion-title>

          <ion-buttons slot="primary">
            <ion-button color="primary">Add Entry</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Subjects</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-grid fixed class="ion-no-margin ion-no-padding">
          <ion-card>
            <ion-card-header>
              <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
              <ion-card-title>{{ subject?.name }}</ion-card-title>
            </ion-card-header>

            <ion-card-content> </ion-card-content>
          </ion-card>
        </ion-grid>
      </ion-content>
    </ion-page>
  </base-view>
</template>

<script>
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonGrid,
} from '@ionic/vue'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useObservable } from '@vueuse/rxjs'

import Subject from '@/components/Subject'
import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    Subject,
  },
  mounted() {},
  async setup() {
    //
    const route = useRoute()

    //
    const db = await getDatabase()

    // Get subject query as observable.
    const subject = useObservable(db.subjects.findOne(route.params.subject).$)
    console.log(subject)

    return {
      subject,
    }
  },
})
</script>
