import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
const Game = () => import('../views/Game.vue')
const Join = () => import('../views/Join.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/games/:id',
      name: 'game',
      component: Game
    },
    {
      path: '/join',
      name: 'join',
      component: Join
    }
  ]
})

export default router
