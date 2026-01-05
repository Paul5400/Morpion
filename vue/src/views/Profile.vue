<script>
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
      apiKey: localStorage.getItem('morpion_api_key') || '{uXxoh!tZLQF',
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
    async saveProfile() {
      this.errors = []
      try {
        await api.put('/api/profile', this.user)
        localStorage.setItem('morpion_api_key', this.apiKey)
        alert('Profil et clé API mis à jour avec succès !')
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors
        } else {
          this.errors = ['Une erreur est survenue lors de la mise à jour.']
        }
      }
    },
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

    <ErrorDisplay :errors="errors" />

    <form @submit.prevent="saveProfile">
      <div class="field">
        <label for="name">Surnom</label>
        <input id="name" v-model="user.name" type="text" required />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="user.email" type="email" required />
      </div>
      <div class="field">
        <label for="apiKey">Clé API (pour test 2 joueurs)</label>
        <input id="apiKey" v-model="apiKey" type="text" required />
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
.close-btn {
  cursor: pointer;
}
</style>
