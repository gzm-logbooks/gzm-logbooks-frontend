<template>
  <base-view>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Subjects</ion-title>

          <ion-buttons slot="end">
            <ion-button
              color="primary"
              :router-link="{ name: 'subject-create' }"
              >Add subject</ion-button
            >
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-grid fixed class="ion-no-margin ion-no-padding">
          <SubjectsList />
        </ion-grid>
      </ion-content>
    </ion-page>
  </base-view>
</template>

<script>
import SubjectsList from '@/components/SubjectsList'
import { getDatabase } from '@/services/DataService'
import { IonGrid, IonButton } from '@ionic/vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { IonGrid, SubjectsList },
})
</script>
