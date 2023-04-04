// Composables
import { createRouter, createWebHistory } from 'vue-router'
import JoinSession from '@/views/JoinSession.vue'
import Home from '@/views/Home.vue'
import Session from '@/views/Session.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/:roomName',
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
