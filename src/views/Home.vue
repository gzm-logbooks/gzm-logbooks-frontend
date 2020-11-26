<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Add a new record</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Add a new record</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid fixed class="ion-no-padding">
        <ion-list>
          <ion-list-header>
            <h1>How did things go today?</h1>
          </ion-list-header>

          <ion-item>
            <ion-label>Date</ion-label>
            <ion-datetime :value="date" placeholder="Select Date">
            </ion-datetime>
          </ion-item>

          <ion-item>
            <CircleInput
              @changed="updateRagInput"
              :red-size="red"
              :orange-size="orange"
              :green-size="green"
              class="ion-padding"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Comment</ion-label>
            <ion-textarea></ion-textarea>
          </ion-item>
        </ion-list>
      </ion-grid>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="primary">
          <ion-button color="primary">Add record</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
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

import CircleInput from '@/components/CircleInput';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    CircleInput,
  },
  data() {
    return {
      red: 0.5,
      orange: 0.33,
      green: 0.17,
      comment: '',
      date: new Date().toISOString(),
    };
  },
  methods: {
    // Handles circles component @changed event.
    updateRagInput(event) {
      // Event contents set in $emit() above.
      switch (event.circle) {
        case 'red':
          this.red = event.radius;
          break;
        case 'orange':
          this.orange = event.radius;
          break;
        case 'green':
          this.green = event.radius;
          break;
      }
    },
  },
});
</script>
