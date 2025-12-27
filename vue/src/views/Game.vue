<script>
import api from '@/api'

export default {
  name: 'GameView',
  data() {
    return {
      // Informations de la partie
      game: null,
      // Informations de l'utilisateur courant (pour le player_id)
      user: null,
      // Instance de la WebSocket
      socket: null
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
    // Initialisation de la connexion WebSocket
    waitForOpponentMove() {
      // On utilise l'URL spécifiée dans le sujet
      this.socket = new WebSocket('wss://morpion-api.edu.netlor.fr/websockets')

      this.socket.onopen = () => {
        // Envoi du message de connexion requis par l'API
        const connectMsg = {
          action: 'connect',
          game_id: this.game.id,
          player_id: this.user.id
        }
        this.socket.send(JSON.stringify(connectMsg))
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        // Traitement des messages WS
        switch (data.action) {
          case 'opponent-join':
          case 'opponent-play':
            // On rafraîchit les données de la partie pour voir l'adversaire ou son coup
            this.refreshGameData()
            break
          case 'opponent-quit':
            alert('Votre adversaire a quitté la partie.')
            this.goBack()
            break
        }
      }
    },

    // Rafraîchit les informations de la partie via l'API
    async refreshGameData() {
      try {
        const response = await api.get(`/api/games/${this.game.id}`)
        this.game = response.data
      } catch (error) {
        console.error('Erreur lors du rafraîchissement :', error)
      }
    },

    // Retour à l'accueil
    goBack() {
      this.$router.push({ name: 'home' })
    },

    // Helper pour savoir quel symbole afficher (X ou O)
    getCellChar(row, col) {
      const cell = this.game.board[row-1][col-1]
      if (!cell) return ''
      return cell === this.game.user1_id ? 'X' : 'O'
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

    <!-- Infos joueurs (Ex 7) -->
    <div class="players-info">
      <div :class="{ active: game.next_player_id === game.user1_id }">
        JOUEUR 1: {{ game.user1 ? game.user1.name : 'John Doe' }}
      </div>
      <div :class="{ active: game.next_player_id === game.user2_id }">
        JOUEUR 2: {{ game.user2 ? game.user2.name : '...waiting' }}
      </div>
    </div>

    <!-- Grille de jeu (Ex 7) -->
    <div v-if="game.user2" class="game-container">
      <div class="grid">
        <div v-for="r in 3" :key="'r'+r" class="row">
          <div v-for="c in 3" :key="'c'+c" class="cell">
            {{ getCellChar(r, c) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Attente adversaire (Ex 7) -->
    <div v-else class="waiting">
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
