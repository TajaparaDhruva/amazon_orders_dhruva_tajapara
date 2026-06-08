import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// Axios instance pointing at the Vite proxy → backend
const api = axios.create({
    baseURL: '/api/v1',
    headers: { 'Content-Type': 'application/json' }
})

// Attach JWT from localStorage to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('vf_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export function AuthProvider({ children }) {
    const [user, setUser]     = useState(null)
    const [token, setToken]   = useState(() => localStorage.getItem('vf_token'))
    const [loading, setLoading] = useState(true)

    // On mount, restore user from localStorage
    useEffect(() => {
        const savedUser  = localStorage.getItem('vf_user')
        const savedToken = localStorage.getItem('vf_token')
        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser))
                setToken(savedToken)
            } catch {
                localStorage.removeItem('vf_user')
                localStorage.removeItem('vf_token')
            }
        }
        setLoading(false)
    }, [])

    const persist = (userData, tokenData) => {
        setUser(userData)
        setToken(tokenData)
        localStorage.setItem('vf_user', JSON.stringify(userData))
        localStorage.setItem('vf_token', tokenData)
    }

    const clear = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('vf_user')
        localStorage.removeItem('vf_token')
    }

    /**
     * Register a new user.
     * @param {object} fields  — { name, email, password, role }
     * role should be 'user' (customer) or 'seller'
     */
    const register = useCallback(async ({ name, email, password, role }) => {
        const { data } = await api.post('/auth/register', { name, email, password, role })
        if (data.success) {
            persist(data.data, data.token)
            return data.data
        }
        throw new Error(data.message || 'Registration failed')
    }, [])

    /**
     * Log in an existing user.
     * @param {object} fields  — { email, password }
     */
    const login = useCallback(async ({ email, password }) => {
        const { data } = await api.post('/auth/login', { email, password })
        if (data.success) {
            persist(data.data, data.token)
            return data.data
        }
        throw new Error(data.message || 'Login failed')
    }, [])

    /**
     * Log out — clears token and user state.
     */
    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout')
        } catch {
            // ignore network errors on logout
        } finally {
            clear()
        }
    }, [])

    const value = { user, token, loading, login, register, logout, api }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}

export default AuthContext
