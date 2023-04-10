// Composables
import { createRouter, createWebHistory } from 'vue-router'
import JoinSession from '@/views/JoinSession.vue'
import Home from '@/views/Home.vue'
import Session from '@/views/Session.vue'
import AuthService from '@/api/AuthService';

const routes = [
  {
    path: '/',
    name: 'Home',
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

router.beforeEach(async (to, from) => {
  if (to.name == routes[1].name) {
    var authService = new AuthService();
    await authService.loginUsingLocalStorageData();
  
    if (authService.isLogged()) {
      return true;
    } else {
      return {name: 'Home'}
    }
  }
})

export default router
