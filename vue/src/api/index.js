import axios from 'axios'

// Création d'une instance Axios pré-configurée
const instance = axios.create({
  // URL de base de l'API
  baseURL: 'https://morpion-api.edu.netlor.fr',
  headers: {
    // Indique que l'on communique en JSON
    'Content-Type': 'application/json',
    // Authentification via la clé API
    'Authorization': 'key={uXxoh!tZLQF'
  }
})

export default instance
