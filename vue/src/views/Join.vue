<script>
// ============================================
// EXERCICE 8 - Rejoindre une partie
// ============================================
// Formulaire pour saisir un code de partie
// et rejoindre une partie existante

import api from '@/api'
import ErrorDisplay from '@/components/ErrorDisplay.vue'

export default {
  name: 'JoinView',
  components: {
    ErrorDisplay
  },
  data() {
    return {
      gameCode: '', // Code saisi par l'utilisateur
      errors: []    // Liste des erreurs éventuelles
    }
  },
  methods: {
    // EXERCICE 8 - Rejoindre une partie via PATCH /api/games/:code/join
    async joinGame() {
      this.errors = []
      try {
        // Envoi de la requête de rejoindre avec le code de partie
        const response = await api.patch(`/api/games/${this.gameCode}/join`)
        // EXERCICE 8 - Redirection vers la partie avec l'ID reçu
        this.$router.push({ name: 'game', params: { id: response.data.id } })
      } catch (error) {
        // EXERCICE 8 - Affichage des erreurs (ex: code invalide)
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors
        } else {
          this.errors = ['Impossible de rejoindre la partie. Vérifiez le code.']
        }
      }
    },
    // Retour à l'accueil
    goBack() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<template>
  <div class="join-container">
    <div class="card">
      <div class="header">
        <h1>Rejoindre</h1>
        <button @click="goBack" class="close-btn">&times;</button>
      </div>

      <ErrorDisplay :errors="errors" />

      <form @submit.prevent="joinGame">
        <div class="field">
          <label for="code">CODE DE LA PARTIE</label>
          <input id="code" v-model="gameCode" type="text" required placeholder="Ex: 1R3G55" />
        </div>
        <button type="submit" class="w-full">REJOINDRE</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.join-container {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

.card {
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header h1 {
  margin-bottom: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 2rem;
  padding: 0;
  line-height: 1;
  box-shadow: none;
}

.close-btn:hover {
  color: var(--text);
  transform: none;
  background: none;
}

.field {
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.w-full {
  width: 100%;
}
</style>
