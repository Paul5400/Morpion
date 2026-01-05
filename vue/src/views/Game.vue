<script>
import api from '@/api'

export default {
  name: 'GameView',
  data() {
    return {
      game: null,      // Données de la partie en cours
      user: null,      // Profil de l'utilisateur actuel
      socket: null,    // Connexion WebSocket pour le temps réel
      error: null      // Message d'erreur éventuel
    }
  },
  // Récupération des données avant l'affichage de la route
  async beforeRouteEnter(to, from, next) {
    try {
      const [gameRes, profileRes] = await Promise.all([
        api.get(`/api/games/${to.params.id}`),
        api.get('/api/profile')
      ])
      next(vm => {
        vm.game = gameRes.data
        vm.user = profileRes.data
        // On lance l'écoute des messages du serveur (WebSocket)
        vm.waitForOpponentMove()
      })
    } catch (error) {
      console.error('Erreur lors de l’initialisation de la partie :', error)
      next(false)
    }
  },
  // Fermeture de la socket quand on quitte la page
  beforeUnmount() {
    if (this.socket) {
      this.socket.close()
    }
  },
  methods: {
    // Établit la connexion WebSocket pour synchroniser les coups
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
            this.refreshGameData() // Rafraîchit les données du plateau
            break
          case 'opponent-quit':
            alert('Votre adversaire a quitté la partie.')
            this.goBack()
            break
        }
      }
    },

    // Récupère les dernières données de la partie via l'API
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

    // Détermine le symbole (X ou O) à afficher dans une case
    getCellChar(row, col) {
      const cellKey = `r${row}c${col}`
      const cellValue = this.game[cellKey]
      if (!cellValue) return ''
      return cellValue === 1 ? 'X' : 'O'
    },

    // Envoie un coup au serveur
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
    },

    // Permet de créer une nouvelle partie rapidement à la fin
    async rejouer() {
      try {
        const response = await api.post('/api/games', {})
        const newCode = response.data.code
        await navigator.clipboard.writeText(newCode)
        alert(`Nouveau code copié : ${newCode}\nDonnez-le à votre adversaire !`)
        this.$router.push({ name: 'game', params: { id: response.data.id } })
      } catch (error) {
        console.error('Erreur lors de la création de la nouvelle partie:', error)
        this.error = 'Impossible de créer une nouvelle partie.'
      }
    }
  }
}
</script>

<template>
  <div class="game-view" v-if="game">
    <div class="game-header">
      <h2>Partie #{{ game.code }}</h2>
      <button @click="goBack" class="btn-quit">QUITTER</button>
    </div>

    <div class="game-card">
      <div class="players-info">
        <div class="player-slot" :class="{ active: game.next_player_id === game.owner_id }">
          <span class="symbol">X</span>
          <span class="name">{{ game.owner.name }}</span>
        </div>
        <div class="vs">VS</div>
        <div class="player-slot" :class="{ active: game.next_player_id === game.opponent_id }">
          <span class="symbol">O</span>
          <span class="name">{{ game.opponent ? game.opponent.name : 'Attente...' }}</span>
        </div>
      </div>

      <div v-if="error" class="error-badge">
        {{ error }}
      </div>

      <!-- Plateau de jeu -->
      <div v-if="game.opponent && game.state !== 2" class="board-container">
        <div class="grid">
          <div v-for="r in 3" :key="'r'+r" class="row">
            <div v-for="c in 3" :key="'c'+c" 
                 class="cell" 
                 :class="{ 'cell-filled': getCellChar(r, c) }"
                 @click="play(r, c)">
              {{ getCellChar(r, c) }}
            </div>
          </div>
        </div>
        <p class="turn-hint" v-if="game.next_player_id === user.id">À votre tour !</p>
        <p class="turn-hint-other" v-else>En attente de l'adversaire...</p>
      </div>

      <!-- Écran de fin -->
      <div v-if="game.opponent && game.state === 2" class="end-screen">
        <div class="result-box">
          <h1 v-if="game.winner_id" class="winner-title">
            {{ game.winner_id === game.owner_id ? game.owner.name : game.opponent.name }}<br>
            A GAGNÉ !
          </h1>
          <h1 v-else class="draw-title">MATCH NUL</h1>
        </div>
        <div class="end-actions">
          <button @click="rejouer" class="btn-primary">REJOUER</button>
          <button @click="goBack" class="btn-secondary">MENU PRINCIPAL</button>
        </div>
      </div>

      <!-- Attente -->
      <div v-else-if="!game.opponent" class="empty-state">
        <div class="loader"></div>
        <p>En attente d'un adversaire ...</p>
        <div class="code-share">
          <span>Code à partager :</span>
          <strong>{{ game.code }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-view {
  width: 100%;
  max-width: 600px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-quit {
  background-color: var(--text-light);
  font-size: 0.8rem;
}

.game-card {
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  text-align: center;
}

.players-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.player-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border-radius: var(--radius);
  transition: all 0.3s;
  opacity: 0.6;
}

.player-slot.active {
  background-color: #ecfdf5;
  color: #059669;
  opacity: 1;
  box-shadow: 0 0 0 2px #10b981 inset;
}

.symbol {
  font-size: 1.5rem;
  font-weight: 800;
}

.name {
  font-size: 0.9rem;
  font-weight: 600;
}

.vs {
  font-weight: 800;
  color: var(--text-light);
  font-size: 0.8rem;
}

.error-badge {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 8px 15px;
  border-radius: var(--radius);
  margin-bottom: 20px;
  display: inline-block;
  font-size: 0.9rem;
}

.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 30px 0;
}

.row {
  display: flex;
  gap: 8px;
}

.cell {
  width: 90px;
  height: 90px;
  background-color: var(--bg);
  border-radius: var(--radius);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border);
}

.cell:hover:not(.cell-filled) {
  background-color: #f1f5f9;
  border-color: var(--primary);
}

.cell-filled {
  cursor: default;
  background-color: #fff;
}

.turn-hint {
  color: #10b981;
  font-weight: 700;
  animation: pulse 2s infinite;
}

.turn-hint-other {
  color: var(--text-light);
  font-style: italic;
}

.end-screen {
  padding: 20px 0;
}

.result-box {
  margin-bottom: 30px;
}

.winner-title {
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.end-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.code-share {
  margin-top: 20px;
  padding: 15px;
  background-color: #f1f5f9;
  border-radius: var(--radius);
  display: inline-block;
}

.code-share strong {
  margin-left: 10px;
  font-size: 1.2rem;
  color: var(--primary);
}

.loader {
  border: 4px solid var(--border);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
</style>
