<script>
import api from '@/api'

export default {
  name: 'HomeView',
  methods: {
    // Méthode pour créer une nouvelle partie
    async createGame() {
      try {
        const response = await api.post('/api/games', {})
        // On redirige vers la vue de la partie avec l'ID reçu
        this.$router.push({ name: 'game', params: { id: response.data.id } })
      } catch (error) {
        console.error('Erreur lors de la création de la partie :', error)
        alert('Impossible de créer une partie.')
      }
    },
    // Redirection vers la vue pour rejoindre une partie
    joinGame() {
      this.$router.push({ name: 'join' })
    },
    // Redirection vers le profil utilisateur
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
      <button @click="joinGame" class="secondary">REJOINDRE UNE PARTIE</button>
      <button @click="goUserProfile" class="text-btn">MON PROFIL</button>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.secondary {
  background-color: var(--text-light);
}

.secondary:hover {
  background-color: var(--text);
}

.text-btn {
  background: none;
  color: var(--primary);
  border: none;
  font-weight: 600;
  box-shadow: none;
}

.text-btn:hover {
  transform: none;
  text-decoration: underline;
  background: none;
}
</style>
