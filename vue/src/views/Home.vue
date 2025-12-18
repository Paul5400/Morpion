<script>
import api from '@/api'

export default {
  name: 'HomeView',
  methods: {
    // Méthode pour créer une nouvelle partie
    async createGame() {
      try {
        const response = await api.post('/api/games', {})
        // On redirige vers la vue de la partie avec l'id récupéré
        this.$router.push({ name: 'game', params: { id: response.data.id } })
      } catch (error) {
        console.error('Erreur lors de la création de la partie :', error)
        alert('Impossible de créer une partie.')
      }
    },
    // Navigation vers la page pour rejoindre une partie
    joinGame() {
      this.$router.push({ name: 'join' })
    },
    // Navigation vers la page de profil
    goUserProfile() {
      this.$router.push({ name: 'profile' })
    }
  }
}
</script>

<template>
  <div class="home">
    <h1>Morpion - Accueil</h1>
    <div class="menu">
      <button @click="createGame">NOUVELLE PARTIE</button>
      <button @click="joinGame">REJOINDRE UNE PARTIE</button>
      <button @click="goUserProfile">MON PROFIL</button>
    </div>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
}
</style>
