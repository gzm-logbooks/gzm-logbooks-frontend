<template>
  <base-view>
    <form @submit.prevent="save">
      <ion-page>
        <ion-header :translucent="true">
          <ion-toolbar>
            <ion-title>Entry</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content fullscreen>
          <ion-header collapse="condense">
            <ion-toolbar>
              <ion-title size="large">Entry</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-grid fixed class="ion-no-margin ion-no-padding">
            <entry-form v-bind:entry="fields" />
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
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonGrid,
} from '@ionic/vue'
import { defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useObservable } from '@vueuse/rxjs'

import EntryForm from '@/components/EntryForm'
import { getDatabase } from '@/services/DataService'

export default defineComponent({
  components: {
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

    const fields = reactive(entry.toJSON())
    console.log(fields)

    return {
      subject,
      entry,
      fields,
    }
  },
  methods: {
    async save() {
      console.log('Saving...')

      //
      const data = {
        ...this.fields,
      }

      await this.entry.atomicPatch(data)
    }
  }
})
</script>
