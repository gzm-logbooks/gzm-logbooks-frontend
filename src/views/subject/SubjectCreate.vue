<template>
  <base-view>
    <form @submit.prevent="save">
      <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-title>Add a new subject</ion-title>

            <ion-buttons slot="start">
              <ion-back-button default-href="/"></ion-back-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <subject-form v-bind:subject="subject" />

          <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button @click="save">
              <ion-icon :icon="saveIcon"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-content>
      </ion-page>
    </form>
  </base-view>
</template>

<script>
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonInput,
  toastController,
} from '@ionic/vue'
import { save as saveIcon } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import SubjectForm from '@/components/SubjectForm'
import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {
    IonFab,
    IonFabButton,
    IonIcon,
    IonInput,
    SubjectForm,
  },
  data() {
    return {
      subject: {},
    }
  },
  async setup() {
    //
    const route = useRoute()

    //
    const db = await getDatabase()

    return {
      route,
      db,
      saveIcon,
    }
  },
  methods: {
    async save() {
      console.log('Saving...')

      //
      const data = { ...this.subject }
      console.log(data)

      //
      const doc = await this.db.subjects.insert(data).catch(async (err) => {
        console.log(err)

        const toast = await toastController.create({
          message: err,
          color: 'danger',
          duration: 2000,
        })

        toast.present()
      })

      if (doc) {
        this.$router.push({
          name: 'subject-show',
          params: { subject: doc.primary },
        })
      }
    },
  },
})
</script>
