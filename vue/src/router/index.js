// ============================================
// EXERCICES 4, 5, 6, 8 - Configuration du Router
// ============================================
// Définition des routes de l'application

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
    // EXERCICE 4 - Route de la page d'accueil
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    // EXERCICE 5 - Route du profil utilisateur
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    // EXERCICE 6 - Route de la partie (avec paramètre :id)
    {
      path: '/games/:id',
      name: 'game',
      component: Game
    },
    // EXERCICE 8 - Route pour rejoindre une partie
    {
      path: '/join',
      name: 'join',
      component: Join
    }
  ]
})

export default router
