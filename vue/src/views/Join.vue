<script>
import api from '@/api'
import ErrorDisplay from '@/components/ErrorDisplay.vue'

export default {
  name: 'JoinView',
  components: {
    ErrorDisplay
  },
  data() {
    return {
      gameCode: '',
      errors: []
    }
  },
  methods: {
    async joinGame() {
      this.errors = []
      try {
        const response = await api.patch(`/api/games/${this.gameCode}/join`)
        this.$router.push({ name: 'game', params: { id: response.data.id } })
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors
        } else {
          this.errors = ['Impossible de rejoindre la partie. Vérifiez le code.']
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
  <div class="join">
    <div class="header">
      <h1>REJOINDRE UNE PARTIE</h1>
      <button @click="goBack" class="close-btn">X</button>
    </div>

    <ErrorDisplay :errors="errors" />

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
</style>
