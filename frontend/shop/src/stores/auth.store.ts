import { defineStore } from 'pinia'
import { http } from '../api/http'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token'),
    }),

    actions: {
        async login(email: string, password: string) {
            const { data } = await http.post('/auth/login', { email, password })
            this.token = data.token
            localStorage.setItem('token', data.token)
        },
    },
})
