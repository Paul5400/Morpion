import axios from 'axios'

const DEFAULT_KEY = '{.gc67-o;j9;Z'

const instance = axios.create({
  baseURL: 'https://morpion-api.edu.netlor.fr',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'key={uXxoh!tZLQF'
  }
})

export default instance
