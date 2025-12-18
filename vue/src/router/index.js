import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
// Importation paresseuse (lazy loading) pour les autres vues
const Game = () => import('../views/Game.vue')
const Join = () => import('../views/Join.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Redirection par défaut vers la page d'accueil
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
      // Route pour la partie avec un paramètre dynamique :id
      path: '/games/:id',
      name: 'game',
      component: Game
    },
    {
      // Route pour rejoindre une partie via un code
      path: '/join',
      name: 'join',
      component: Join
    }
  ]
})

export default router
