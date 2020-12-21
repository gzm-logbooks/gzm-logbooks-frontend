<template>
  <base-view>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Add a new subject</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Add a new subject</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-items>
          <ion-item>
            <ion-label position="stacked">Name</ion-label>
            <ion-input type="text" v-model="name"></ion-input>
          </ion-item>
        </ion-items>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button>
            <ion-icon :icons="heart" @click="save"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    </ion-page>
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
import { heart } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {
    IonFab,
    IonFabButton,
    IonIcon,
    IonInput,
  },
  data() {
    return { name: '' }
  },
  async setup() {
    //
    const route = useRoute()
    const router = useRouter()

    //
    const db = await getDatabase()

    return {
      route,
      router,
      db,
      heart,
    }
  },
  methods: {
    async save() {
      console.log('Saving...')

      //
      const data = { name: this.name }
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
        this.router.push({
          name: 'subject-show',
          params: { subject: doc.primary },
        })
      }
    },
  },
})
</script>
