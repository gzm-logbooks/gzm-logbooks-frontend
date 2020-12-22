<template>
  <base-view>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>{{ subject?.name }}</ion-title>

          <ion-buttons slot="primary">
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

      <ion-content fullscreen>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Subjects</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-grid fixed class="ion-no-margin ion-no-padding">
          <ion-card>
            <ion-card-content>
              <progress-chart
                :options="{ legend: { display: true } }"
                :entries="entries"
                @selected="chartClicked"
              />
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

export default defineComponent({
  components: {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    ProgressChart,
  },
  mounted() {},
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

    console.log({
      subject: subject.toJSON(),
      entries: entries.map((doc) => doc.toJSON()),
    })

    return {
      subject,
      entries,
    }
  },
  methods: {
    chartClicked(timestamp) {
      console.log(event)

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
