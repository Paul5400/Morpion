import axios from 'axios'

// Clé par défaut utilisée si aucune clé n'est trouvée dans le stockage local
const DEFAULT_KEY = '_yZCj{qEjs3J'

const instance = axios.create({
  baseURL: 'https://morpion-api.edu.netlor.fr',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter la clé API à chaque requête automatiquement
instance.interceptors.request.use(config => {
  // On récupère la clé depuis le localStorage ou on utilise la clé par défaut
  const key = localStorage.getItem('morpion_api_key') || DEFAULT_KEY
  config.headers['Authorization'] = `key=${key}`
  return config
})

export default instance
