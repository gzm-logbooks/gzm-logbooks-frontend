import { createRouter, createWebHistory } from '@ionic/vue-router'
import SubjectList from '../views/subjects/List.vue'
import SubjectSingle from '../views/subjects/Single.vue'
import SubjectAddEntry from '../views/subjects/AddEntry.vue'

const routes = [
  {
    path: '/',
    redirect: '/subjects',
  },
  {
    path: '/subjects',
    name: 'subject-index',
    component: SubjectList,
  },
  {
    path: '/subjects/:subject',
    name: 'subject',
    component: SubjectSingle,
  },
  {
    path: '/subjects/:subject/add',
    name: 'subject-add-record',
    component: SubjectAddEntry,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
