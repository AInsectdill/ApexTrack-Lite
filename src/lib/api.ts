import axios, { AxiosResponse } from 'axios'

const API_BASE_URL = 'https://www3.apextrack.site/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  account_status: string
  expired_at?: string
}

export interface Offer {
  id: string
  name: string
  url: string
  status: 'active' | 'paused' | 'pending'
  country: string
  device: string
  can_show_to_proxy: boolean
}

export interface DashboardData {
  summary: {
    today_clicks: number
    today_leads: number
    today_revenue: number
    today_epc: number
  }
  recent_clicks: Array<{
    sub_id: string
    offer_name: string
    ip_address: string
    country_code: string
    os: string
    device_type: string
    redirect_type_used: string
    created_at: string
  }>
  performance_report: Array<{
    sub_id: string
    hits: number
    conversions: number
    revenue: number
    cr: number
    epc: number
  }>
  recent_leads: Array<{
    sub_id: string
    payout: number
    country_code: string
    device_type: string
    ip_address: string
    created_at: string
  }>
}

export interface GeneratorData {
  offers: Offer[]
  domains: string[]
  redirect_types: string[]
  types: string[]
  generation_modes: string[]
  shortener_choices: string[]
}

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AxiosResponse<{ token: string; user: User }>> =>
    api.post('/auth/login', credentials),
  
  logout: (): Promise<AxiosResponse> =>
    api.post('/auth/logout'),
}

// Dashboard API
export const dashboardAPI = {
  getData: (): Promise<AxiosResponse<DashboardData>> =>
    api.get('/dashboard'),
}

// Offers API
export const offersAPI = {
  getAll: (): Promise<AxiosResponse<Offer[]>> =>
    api.get('/offers'),
  
  getById: (id: string): Promise<AxiosResponse<Offer>> =>
    api.get(`/offers/${id}`),
  
  create: (offer: Partial<Offer>): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/offers', offer),
  
  update: (id: string, offer: Partial<Offer>): Promise<AxiosResponse<{ message: string }>> =>
    api.put(`/offers/${id}`, offer),
  
  delete: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/offers/${id}`),
}

// Generator API
export const generatorAPI = {
  getData: (): Promise<AxiosResponse<GeneratorData>> =>
    api.get('/generator-data'),
  
  generateSmartlink: (data: FormData): Promise<AxiosResponse<{
    final_shared_url: string
    smartlink_url_after_first_shortening?: string
  }>> =>
    api.post('/generate-smartlink', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

// Users API
export const usersAPI = {
  getAll: (page = 1): Promise<AxiosResponse<{
    data: User[]
    current_page: number
    last_page: number
    links: Array<{ label: string; url: string | null; active: boolean }>
  }>> =>
    api.get(`/users?page=${page}`),
  
  getById: (id: string): Promise<AxiosResponse<User>> =>
    api.get(`/users/${id}`),
  
  create: (user: Partial<User> & { password: string; password_confirmation: string }): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/users', user),
  
  update: (id: string, user: Partial<User>): Promise<AxiosResponse<{ message: string }>> =>
    api.put(`/users/${id}`, user),
  
  delete: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/users/${id}`),
  
  getRoles: (): Promise<AxiosResponse<string[]>> =>
    api.get('/user-roles'),
}

// Profile API
export const profileAPI = {
  get: (): Promise<AxiosResponse<{ user: User }>> =>
    api.get('/profile'),
  
  update: (data: { name: string; email: string }): Promise<AxiosResponse<{ message: string }>> =>
    api.put('/profile', data),
  
  updatePassword: (data: {
    current_password: string
    password: string
    password_confirmation: string
  }): Promise<AxiosResponse<{ message: string }>> =>
    api.put('/password', data),
}

export default api