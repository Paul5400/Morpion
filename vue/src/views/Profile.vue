<script>
// ============================================
// EXERCICE 5 - Profil utilisateur
// ============================================
// Formulaire pour éditer le nom et l'email
// avec gestion des erreurs serveur

import api from '@/api'
import ErrorDisplay from '@/components/ErrorDisplay.vue'

export default {
  name: 'ProfileView',
  components: {
    ErrorDisplay
  },
  data() {
    return {
      user: {
        name: '',
        email: ''
      },
      // Clé API stockée localement pour identifier le joueur
      apiKey: localStorage.getItem('morpion_api_key') || 'OPyk>I6jjtJr',
      errors: []
    }
  },
  // EXERCICE 5 - Hook beforeRouteEnter pour charger le profil
  async beforeRouteEnter(to, from, next) {
    try {
      const response = await api.get('/api/profile')
      next(vm => {
        vm.user = response.data
      })
    } catch (error) {
      console.error('Erreur lors de la récupération du profil :', error)
      next(false) // Bloque l'accès en cas d'erreur
    }
  },
  methods: {
    // EXERCICE 5 - Sauvegarde du profil via PUT /api/profile
    async saveProfile() {
      this.errors = []
      try {
        await api.put('/api/profile', this.user)
        // Enregistre la clé dans le stockage du navigateur
        localStorage.setItem('morpion_api_key', this.apiKey)
        alert('Profil et clé API mis à jour avec succès !')
      } catch (error) {
        // EXERCICE 5 - Affichage des erreurs retournées par le serveur
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors
        } else {
          this.errors = ['Une erreur est survenue lors de la mise à jour.']
        }
      }
    },
    // EXERCICE 5 - Retour à l'accueil
    goBack() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<template>
  <div class="profile-container">
    <div class="card">
      <div class="header">
        <h1>Mon Profil</h1>
        <button @click="goBack" class="close-btn">&times;</button>
      </div>

      <ErrorDisplay :errors="errors" />

      <form @submit.prevent="saveProfile">
        <div class="field">
          <label for="name">SURNOM</label>
          <input id="name" v-model="user.name" type="text" required />
        </div>
        <div class="field">
          <label for="email">EMAIL</label>
          <input id="email" v-model="user.email" type="email" required />
        </div>
        <div class="field">
          <label for="apiKey">CLÉ API</label>
          <input id="apiKey" v-model="apiKey" type="text" required />
          <small class="helper-text">Changez un caractère pour tester avec un autre joueur.</small>
        </div>
        <button type="submit" class="w-full">ENREGISTRER LES MODIFICATIONS</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  width: 100%;
  max-width: 500px;
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
  margin-bottom: 20px;
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

.helper-text {
  margin-top: 5px;
  color: var(--text-light);
  font-size: 0.75rem;
  font-style: italic;
}

.w-full {
  width: 100%;
  margin-top: 10px;
}
</style>
