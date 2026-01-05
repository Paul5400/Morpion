import axios from 'axios'

const DEFAULT_KEY = '{uXxoh!tZLQF'

const instance = axios.create({
  baseURL: 'https://morpion-api.edu.netlor.fr',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour injecter la clé dynamique avant chaque requête
instance.interceptors.request.use(config => {
  const key = localStorage.getItem('morpion_api_key') || DEFAULT_KEY
  config.headers['Authorization'] = `key=${key}`
  return config
})

export default instance
