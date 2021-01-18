<template>
  <base-view>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ subject?.name }}</ion-title>

          <ion-buttons slot="start">
            <ion-back-button default-href="/"></ion-back-button>
          </ion-buttons>

          <ion-buttons slot="end">
            <ion-button
              color="primary"
              :router-link="{
                name: 'entry-create',
                params: { subject: subject.primary },
              }"
            >
              Add Entry
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-grid fixed class="ion-no-margin ion-no-padding">
          <ion-card>
            <ion-card-header>
              <ion-card-subtitle>Your progress</ion-card-subtitle>
              <ion-card-title>{{ subject?.name }}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-content>
              <progress-chart v-if="entries.length > 1" 
                :options="options"
                :entries="entries"
                @selected="chartClicked"
              />
              <div v-else ref="no-data">Nothing to display</div>
            
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-content>
              <EntriesList />
            </ion-card-content>
          </ion-card>          

        </ion-grid>
      </ion-content>
    </ion-page>
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
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useObservable } from '@vueuse/rxjs'

//import Subject from '@/components/Subject'
import { getDatabase } from '@/services/DataService'
import ProgressChart from '@/components/ProgressChart'
import EntriesList from '@/components/EntriesList'

export default defineComponent({
  components: {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    ProgressChart,
    EntriesList,
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

    const entries = await db.entries
      .find()
      .where({ subject: subject.primary })
      .exec()

    return {
      subject,
      entries,
    }
  },
  methods: {
    chartClicked(timestamp) {
      this.$router.push({
        name: 'entry-show',
        params: {
          subject: this.subject.primary,
          entry: timestamp,
        },
      })
    },
  },
})
</script>
