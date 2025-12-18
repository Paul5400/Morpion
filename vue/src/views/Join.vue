<script>
import api from '@/api'

export default {
  name: 'JoinView',
  data() {
    return {
      // Code de la partie à rejoindre
      gameCode: '',
      // Erreurs éventuelles
      errors: []
    }
  },
  methods: {
    // Tente de rejoindre une partie avec le code saisi
    async joinGame() {
      this.errors = []
      try {
        const response = await api.patch(`/api/games/${this.gameCode}/join`)
        // Si succès, l'API retourne les infos de la partie, on redirige vers l'id
        this.$router.push({ name: 'game', params: { id: response.data.id } })
      } catch (error) {
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
  <div class="join">
    <div class="header">
      <h1>REJOINDRE UNE PARTIE</h1>
      <button @click="goBack" class="close-btn">X</button>
    </div>

    <!-- Affichage local des erreurs (Ex 8) -->
    <div v-if="errors.length" class="errors">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <form @submit.prevent="joinGame">
      <div class="field">
        <label for="code">CODE DE LA PARTIE</label>
        <input id="code" v-model="gameCode" type="text" required placeholder="Ex: 1R3G55" />
      </div>
      <button type="submit">REJOINDRE</button>
    </form>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.field {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.errors {
  color: red;
  border: 1px solid red;
  padding: 10px;
  margin-bottom: 15px;
}
</style>
