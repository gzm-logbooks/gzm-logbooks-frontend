<template>
  <base-view>
    <form @submit.prevent="save">
      <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-title>Edit entry</ion-title>

            <ion-buttons slot="start">
              <ion-back-button default-href="/"></ion-back-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-grid fixed class="ion-no-margin ion-no-padding">
            <entry-form v-bind:entry="entryData" />
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
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonGrid,
} from '@ionic/vue'
import { save as saveIcon } from 'ionicons/icons'
import { defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'

import EntryForm from '@/components/EntryForm'
import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {
    IonBackButton,
    IonGrid,
    EntryForm,
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

    // Get entry
    const entry = await db.entries
      .findOne({
        selector: { subject: subject.primary, timestamp: route.params.entry },
      })
      .exec()
    if (!entry) {
      throw new Error('Entry does not exist')
    }

    const entryData = reactive(entry.toJSON())
    console.log(entryData)

    return {
      subject,
      entry,
      entryData,
      saveIcon,
    }
  },
  methods: {
    async save() {
      //
      const data = {
        ...this.entryData,
      }

      const doc = await this.entry.atomicPatch(data)

      if (doc) {
        this.$router.back()
      }
    },
  },
})
</script>
