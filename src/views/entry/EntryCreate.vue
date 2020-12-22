<template>
  <base-view>
    <form @submit.prevent="save">
      <ion-page>
        <ion-header :translucent="true">
          <ion-toolbar>
            <ion-title>Add a new record</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content fullscreen>
          <ion-header collapse="condense">
            <ion-toolbar>
              <ion-title size="large">Add a new record</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-grid fixed class="ion-no-margin ion-no-padding">
            <entry-form v-bind:entry="entry" />
          </ion-grid>

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
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  toastController,
} from '@ionic/vue'
import { save as saveIcon } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import EntryForm from '@/components/EntryForm'
import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {
    IonContent,
    IonFooter,
    IonGrid,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    EntryForm,
  },
  data() {
    return {
      entry: {
        timestamp: NaN,
      },
    }
  },
  async setup() {
    //
    const route = useRoute()

    //
    const db = await getDatabase()

    // Check subject exists.
    const subject = await db.subjects.findOne(route.params.subject).exec()
    if (!subject) {
      // TODO: Handle error.
      throw new Error('Subject does not exist')
    }

    return {
      route,
      db,
      subject,
      saveIcon,
    }
  },
  methods: {
    async save() {
      console.log('Saving...')

      //
      const data = {
        ...this.entry,
        subject: this.subject.primary,
      }
      console.log(data)

      //
      const doc = await this.db.entries.insert(data).catch(async (err) => {
        console.log(err)

        const toast = await toastController.create({
          message: err,
          color: 'danger',
          duration: 2000,
        })

        toast.present()
      })

      if (doc) {
        console.log(doc.toJSON())

        this.$router.push({
          name: 'subject-show',
          params: { subject: this.subject.primary },
        })
      }
    },
  },
})
</script>
