import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Intercepteur pour ajouter le token automatiquement
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Intercepteur pour gérer les erreurs de token
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
        }
        return Promise.reject(error)
      }
    )
  }

  async login(email, password) {
    try {
      const response = await this.api.post('/login', {
        email,
        password
      })

      if (response.data.success) {
        // Stocker le token et les données utilisateur
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return {
          success: true,
          data: {
            token: response.data.token,
            user: response.data.user
          }
        }
      }

      return {
        success: false,
        message: response.data.message || 'Erreur de connexion'
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        }
      }

      return {
        success: false,
        message: 'Erreur de connexion. Vérifiez votre connexion internet.'
      }
    }
  }

}

//   async register(userData) {
//     try {
//       const response = await this.api.post('/register', userData)

//       if (response.data.success) {
//         // Stocker le token et les données utilisateur
//         localStorage.setItem('token', response.data.token)
//         localStorage.setItem('user', JSON.stringify(response.data.user