<script>
import api from '@/api'

export default {
  name: 'ProfileView',
  data() {
    return {
      // Données de l'utilisateur
      user: {
        name: '',
        email: ''
      },
      // Liste des erreurs potentielles retournées par l'API
      errors: []
    }
  },
  // Hook exécuté avant d'entrer dans la route
  async beforeRouteEnter(to, from, next) {
    try {
      const response = await api.get('/api/profile')
      // On passe une callback à next pour accéder à l'instance du composant (vm)
      next(vm => {
        vm.user = response.data
      })
    } catch (error) {
      console.error('Erreur lors de la récupération du profil :', error)
      next(false) // On bloque l'accès si erreur
    }
  },
  methods: {
    // Enregistre les modifications du profil
    async saveProfile() {
      this.errors = []
      try {
        await api.put('/api/profile', this.user)
        alert('Profil mis à jour avec succès !')
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          // On récupère les messages d'erreurs du serveur
          this.errors = error.response.data.errors
        } else {
          this.errors = ['Une erreur est survenue lors de la mise à jour.']
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
  <div class="profile">
    <div class="header">
      <h1>MON PROFIL</h1>
      <button @click="goBack" class="close-btn">X</button>
    </div>

    <!-- Affichage local des erreurs (Ex 5) -->
    <div v-if="errors.length" class="errors">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <form @submit.prevent="saveProfile">
      <div class="field">
        <label for="name">Surnom</label>
        <input id="name" v-model="user.name" type="text" required />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="user.email" type="email" required />
      </div>
      <button type="submit">ENREGISTRER</button>
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
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
.errors {
  color: red;
  border: 1px solid red;
  padding: 10px;
  margin-bottom: 10px;
}
.close-btn {
  cursor: pointer;
}
</style>
