import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import ListView from '@/views/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'detail',

      component: MainView,
    },
    {
      path: '/list',
      name: 'list',

      component: ListView,
    },
    {
      path: '/sign-in',
      name: 'sign in',

      component: () => import('../views/SignInView.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign up',

      component: () => import('../views/SignUpView.vue'),
    },
  ],
})

export default router
