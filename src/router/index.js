import { createRouter, createWebHistory } from '@ionic/vue-router'
import SubjectRouterOutlet from '../views/subjects/RouterOutlet.vue'
import SubjectIndex from '../views/subjects/Index.vue'
import SubjectCreate from '../views/subjects/Create.vue'
import SubjectShow from '../views/subjects/Show.vue'

const routes = [
  {
    path: '/',
    redirect: '/subjects',
  },
  {
    path: '/subjects',
    component: SubjectRouterOutlet,
    children: [
      {
        path: '',
        name: 'subject-index',
        component: SubjectIndex,
      },
      {
        path: 'create',
        name: 'subject-create',
        component: SubjectCreate,
      },
      {
        path: ':subject',
        name: 'subject-show',
        component: SubjectShow,
      },
    ],
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
