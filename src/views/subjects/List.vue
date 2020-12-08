<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Subjects</ion-title>

        <ion-buttons slot="primary">
          <ion-button color="primary">Add subject</ion-button>
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
        <Suspense>
          <template #default>
            <SubjectsList />
          </template>
        </Suspense>
      </ion-grid>
    </ion-content>
  </ion-page>
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

import { getDatabase } from '@/services/DatabaseService'
import SubjectsList from '@/components/SubjectsList'

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    SubjectsList,
  },
})
</script>
