import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* Theme variables */
import './theme/variables.css'

// Register service worker.
import './registerServiceWorker'

// Register global components.
import BaseView from '@/views/Base'
import { IonicVue } from '@ionic/vue'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/display.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/float-elements.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/typography.css'

// Create app.
const app = createApp(App).use(IonicVue).use(router)

Object.entries({
  BaseView,

  //
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonIcon,
  IonTitle,
  IonToolbar,
}).forEach(([name, component]) => app.component(name, component))

router.isReady().then(() => {
  app.mount('#app')
})

import { seedDatabase } from '@/services/SeederService'
window.seed = seedDatabase
