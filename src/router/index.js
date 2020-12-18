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
    name: 'subject-index',
    component: SubjectIndex,
  },
  {
    path: '/new-subject',
    name: 'subject-create',
    component: SubjectCreate,
  },
  {
    path: '/:subject',
    name: 'subject-show',
    component: SubjectShow,
  },
  {
    path: '/:subject/new-entry',
    name: 'entry-create',
    component: EntryCreate,
  },
  {
    path: '/:subject/:entry',
    name: 'entry-show',
    component: EntryShow,
  },
  // {
  //   path: '/subjects/:subject/add',
  //   name: 'subject-add-record',
  //   component: SubjectAddEntry,
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
