// Composables
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import Join from '@/views/Join.vue'
import JoinSession from '@/views/JoinSession.vue'
import Login from '@/views/Login.vue'
import Session from '@/views/Session.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/join',
    name: 'join',
    component: Join,
  },
  {
    path: '/joinSession',
    name: 'joinSession',
    component: JoinSession,
  },
  {
    path: '/session',
    name: 'session',
    component: Session,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
