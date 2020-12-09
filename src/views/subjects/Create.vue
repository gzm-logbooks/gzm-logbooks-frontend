<template>
  <ion-page>
    <ion-content fullscreen>
      <ion-item>
        <ion-label position="stacked">Name</ion-label>
        <ion-input type="text" v-model="name"></ion-input>
      </ion-item>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon name="checkmark" @click="save"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonInput,
  toastController,
} from '@ionic/vue'
import { checkmark } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import { getDatabase } from '@/services/DatabaseService'

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
      checkmark,
      router,
    }
  },
  methods: {
    async save(sss) {
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
