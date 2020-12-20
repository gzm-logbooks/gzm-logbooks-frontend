import { createRouter, createWebHistory } from '@ionic/vue-router'

import RouterOutlet from '../views/main/RouterOutlet.vue'

import SubjectIndex from '../views/subject/SubjectIndex.vue'
import SubjectCreate from '../views/subject/SubjectCreate.vue'
import SubjectShow from '../views/subject/SubjectShow.vue'

// import EntryIndex from '../views/entry/EntryIndex.vue'
import EntryCreate from '../views/entry/EntryCreate.vue'
import EntryShow from '../views/entry/EntryShow.vue'

const routes = [
  {
    path: '/',
    redirect: '/subjects',
  },
  {
    path: '/subjects',
    name: 'subject-index',
    component: SubjectIndex,
  },
  {
    path: '/subjects/new',
    name: 'subject-create',
    component: SubjectCreate,
  },
  {
    path: '/subjects/:subject',
    name: 'subject-show',
    component: SubjectShow,
  },
  {
    path: '/subjects/:subject/entry/new',
    name: 'entry-create',
    component: EntryCreate,
  },
  {
    path: '/subjects/:subject/entry/:entry',
    name: 'entry-show',
    component: EntryShow,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
