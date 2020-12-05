<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Subjects</ion-title>

        <ion-buttons>
          <template #primary>
            <ion-button color="primary">Add subject</ion-button>
          </template>
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
        <ion-list>
        </ion-list>
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
} from '@ionic/vue';
import { defineComponent } from 'vue';

import { getDatabase } from '@/services/DatabaseService'

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {
    console.log(getDatabase)
  },
});
</script>
