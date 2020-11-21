<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>

        <ion-buttons slot="primary">
          <ion-button color="primary">Add</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-grid fixed>
          <ion-row>
            <ion-col size-lg="8" size-xl="6" offset-lg="2" offset-xl="3">
              <ion-list>
                <ion-list-header>
                  <h1>How did things go today?</h1>
                </ion-list-header>

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

                <ion-item button color="primary">
                    <ion-label class="ion-text-center">Add</ion-label>
                </ion-item>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
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

<style scoped>
/* #container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
} */
</style>
