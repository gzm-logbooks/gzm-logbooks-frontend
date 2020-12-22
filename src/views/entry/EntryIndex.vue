<template>
  <base-view>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Entries</ion-title>

          <ion-buttons slot="end">
            <ion-button
              color="primary"
              :router-link="{ name: 'subject-create' }"
              >Add entry</ion-button
            >
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-grid fixed class="ion-no-margin ion-no-padding"> </ion-grid>
      </ion-content>
    </ion-page>
  </base-view>
</template>

<script>
import { IonGrid, IonButton } from '@ionic/vue'
import { defineComponent } from 'vue'

import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {
    IonGrid,
  },
})
</script>
