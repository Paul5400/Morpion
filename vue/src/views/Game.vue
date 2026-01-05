<script>
import api from '@/api'

export default {
  name: 'GameView',
  data() {
    return {
      game: null,
      user: null,
      socket: null,
      error: null
    }
  },
  // Chargement des données avant d'afficher la page
  async beforeRouteEnter(to, from, next) {
    try {
      const [gameRes, profileRes] = await Promise.all([
        api.get(`/api/games/${to.params.id}`),
        api.get('/api/profile')
      ])
      next(vm => {
        vm.game = gameRes.data
        vm.user = profileRes.data
        console.log('=== GAME DATA ===')
        console.log(JSON.stringify(vm.game, null, 2))
        console.log('=== USER DATA ===')
        console.log(JSON.stringify(vm.user, null, 2))
        // Une fois les données chargées, on lance les WebSockets
        vm.waitForOpponentMove()
      })
    } catch (error) {
      console.error('Erreur lors de l’initialisation de la partie :', error)
      next(false)
    }
  },
  // Sécurité : on ferme la socket si on quitte le composant
  beforeUnmount() {
    if (this.socket) {
      this.socket.close()
    }
  },
  methods: {
    // Connexion WebSocket pour synchronisation temps réel
    waitForOpponentMove() {
      this.socket = new WebSocket('wss://morpion-api.edu.netlor.fr/websockets')

      this.socket.onopen = () => {
        const connectMsg = {
          action: 'connect',
          game_id: this.game.id,
          player_id: this.user.id
        }
        this.socket.send(JSON.stringify(connectMsg))
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        switch (data.action) {
          case 'opponent-join':
          case 'opponent-play':
            this.refreshGameData()
            break
          case 'opponent-quit':
            alert('Votre adversaire a quitté la partie.')
            this.goBack()
            break
        }
      }
    },

    async refreshGameData() {
      try {
        const response = await api.get(`/api/games/${this.game.id}`)
        this.game = response.data
      } catch (error) {
        console.error('Erreur lors du rafraîchissement :', error)
      }
    },

    goBack() {
      this.$router.push({ name: 'home' })
    },

    getCellChar(row, col) {
      const cellKey = `r${row}c${col}`
      const cellValue = this.game[cellKey]
      if (!cellValue) return ''
      return cellValue === this.game.owner_id ? 'X' : 'O'
    },

    async play(row, col) {
      this.error = null
      try {
        const response = await api.patch(`/api/games/${this.game.id}/play/${row}/${col}`)
        this.game = response.data
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.error = error.response.data.errors[0]
        } else {
          this.error = 'Impossible de jouer cette case.'
        }
      }
    }
  }
}
</script>

<template>
  <div class="game-view" v-if="game">
    <div class="header">
      <h2>Partie #{{ game.code }}</h2>
      <button @click="goBack">Quitter la partie</button>
    </div>

    <div class="players-info">
      <div :class="{ active: game.next_player_id === game.owner_id }">
        JOUEUR 1 (Propriétaire): {{ game.owner.name }}
      </div>
      <div :class="{ active: game.next_player_id === game.opponent_id }">
        JOUEUR 2: {{ game.opponent ? game.opponent.name : 'En attente...' }}
      </div>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <!-- Grille de jeu -->
    <div v-if="game.opponent && game.state !== 2" class="game-container">
      <div class="grid">
        <div v-for="r in 3" :key="'r'+r" class="row">
          <div v-for="c in 3" :key="'c'+c" class="cell" @click="play(r, c)">
            {{ getCellChar(r, c) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Fin de partie -->
    <div v-if="game.opponent && game.state === 2" class="end-game">
      <h1 v-if="game.winner_id">
        {{ game.winner_id === game.owner_id ? game.owner.name : game.opponent.name }}<br>
        A GAGNÉ !!
      </h1>
      <h1 v-else>MATCH NUL</h1>
      <button @click="goBack">RETOUR</button>
    </div>

    <!-- Attente adversaire -->
    <div v-else-if="!game.opponent" class="waiting">
      <p>En attente d'un adversaire ...</p>
      <p>Code à communiquer : <strong>{{ game.code }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.players-info {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}
.active {
  font-weight: bold;
  color: green;
  text-decoration: underline;
}
.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.row {
  display: flex;
  gap: 5px;
}
.cell {
  width: 100px;
  height: 100px;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  cursor: pointer;
}
.cell:hover {
  background-color: #f0f0f0;
}
.turn-info {
  text-align: center;
  font-style: italic;
}
.error {
  color: red;
  text-align: center;
}
.end-game {
  text-align: center;
  padding: 50px;
  border: 5px solid gold;
}
</style>
