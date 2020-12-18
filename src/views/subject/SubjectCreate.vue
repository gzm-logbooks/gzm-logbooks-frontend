<template>
  <base-view>
    <ion-page>
      <ion-content fullscreen>
        <ion-item>
          <ion-label position="stacked">Name</ion-label>
          <ion-input type="text" v-model="name"></ion-input>
        </ion-item>

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
import { useRouter } from 'vue-router'

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
  setup() {
    const router = useRouter()

    return {
      heart,
      router,
    }
  },
  methods: {
    async save() {
      console.log('Saving...')

      const db = await getDatabase()

      const doc = await db.subjects
        .insert({ name: this.name })
        .catch(async (err) => {
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
